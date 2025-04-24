// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { 
        type: String, 
        required: true, 
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    subscription: {
        type: String,
        enum: ['free', 'premium', 'pro', 'lifetime'],
        default: 'free'
    },
    stripeCustomerId: String,
    gardenProgress: {
        plants: [{
            type: { type: String, enum: ['flower', 'tree', 'shrub', 'special'] },
            growthStage: { type: Number, min: 0, max: 100 },
            plantedAt: Date
        }],
        lastWatered: Date,
        nutrients: {
            mindfulness: { type: Number, min: 0, max: 100 },
            productivity: { type: Number, min: 0, max: 100 },
            learning: { type: Number, min: 0, max: 100 }
        }
    },
    achievements: [String],
    lastActive: Date,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

userSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

module.exports = mongoose.model('User', userSchema);
