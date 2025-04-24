// server.js
require('dotenv').config();
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// User Schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    subscription: {
        type: String,
        enum: ['free', 'premium', 'pro', 'lifetime'],
        default: 'free'
    },
    stripeCustomerId: String,
    gardenProgress: Object,
    lastActive: Date
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// Stripe Webhook Handler
app.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle subscription events
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            await handleSubscriptionUpdate(session);
            break;
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted':
            const subscription = event.data.object;
            await updateUserSubscription(subscription);
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.json({received: true});
});

async function handleSubscriptionUpdate(session) {
    const customerId = session.customer;
    const subscriptionId = session.subscription;
    
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const plan = subscription.items.data[0].price.id;
    
    // Update user in database
    await User.findOneAndUpdate(
        { stripeCustomerId: customerId },
        { 
            subscription: getPlanFromPriceId(plan),
            lastActive: new Date()
        }
    );
}

async function updateUserSubscription(subscription) {
    const customerId = subscription.customer;
    const status = subscription.status;
    
    let plan = 'free';
    if (status === 'active') {
        const priceId = subscription.items.data[0].price.id;
        plan = getPlanFromPriceId(priceId);
    }
    
    await User.findOneAndUpdate(
        { stripeCustomerId: customerId },
        { subscription: plan }
    );
}

function getPlanFromPriceId(priceId) {
    const prices = {
        [process.env.PREMIUM_MONTHLY_PRICE]: 'premium',
        [process.env.PREMIUM_YEARLY_PRICE]: 'premium',
        [process.env.PRO_MONTHLY_PRICE]: 'pro',
        [process.env.PRO_YEARLY_PRICE]: 'pro',
        [process.env.LIFETIME_PRICE]: 'lifetime'
    };
    
    return prices[priceId] || 'free';
}

// Create Checkout Session
app.post('/create-checkout-session', async (req, res) => {
    const { priceId, customerEmail } = req.body;
    
    try {
        // Check if user exists
        let user = await User.findOne({ email: customerEmail });
        
        // Create Stripe customer if new
        let customerId;
        if (user && user.stripeCustomerId) {
            customerId = user.stripeCustomerId;
        } else {
            const customer = await stripe.customers.create({
                email: customerEmail
            });
            customerId = customer.id;
            
            // Create or update user in DB
            if (user) {
                user.stripeCustomerId = customerId;
                await user.save();
            } else {
                user = await User.create({
                    email: customerEmail,
                    stripeCustomerId: customerId,
                    subscription: 'free',
                    gardenProgress: {}
                });
            }
        }
        
        // Create checkout session
        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            payment_method_types: ['card'],
            line_items: [{
                price: priceId,
                quantity: 1,
            }],
            mode: 'subscription',
            success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/cancel`,
        });
        
        res.json({ sessionId: session.id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Check subscription status
app.get('/user/:email/subscription', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json({
            subscription: user.subscription,
            gardenProgress: user.gardenProgress
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
