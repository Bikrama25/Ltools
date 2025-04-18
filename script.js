// DOM Elements
const sections = {
    dashboard: document.getElementById('dashboard'),
    checkin: document.getElementById('checkin'),
    ikigai: document.getElementById('ikigai'),
    journal: document.getElementById('journal'),
    tools: document.getElementById('tools')
};

const navLinks = document.querySelectorAll('.nav-links a');
const currentDateEl = document.getElementById('current-date');
const urgeModal = document.getElementById('urge-modal');
const checkinSteps = document.querySelectorAll('.checkin-step');
const nextButtons = document.querySelectorAll('.next-btn');
const progressSteps = document.querySelectorAll('.step');

// App State
const state = {
    currentUser: 'User',
    streaks: {
        nofap: 7,
        trading: 3,
        health: 0
    },
    checkinData: {
        body: {},
        senses: {},
        mind: {},
        intellect: {},
        soul: {}
    },
    lastUrgeTime: null,
    habits: {
        meditation: false,
        exercise: false,
        reading: false
    }
};

// Initialize App
function initApp() {
    // Set current date
    const now = new Date();
    currentDateEl.textContent = now.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric' 
    });
    
    // Load user data from localStorage
    loadUserData();
    
    // Set up event listeners
    setupNavigation();
    setupCheckinFlow();
    setupHabitTracking();
    setupUrgeManagement();
    
    // Simulate urge after 30 seconds (for demo)
    setTimeout(() => {
        showUrgeModal();
    }, 30000);
}

// Navigation
function setupNavigation() {
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.dataset.section;
            
            // Update active nav link
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            link.classList.add('active');
            
            // Show selected section
            Object.values(sections).forEach(section => {
                section.classList.remove('active');
            });
            sections[sectionId].classList.add('active');
        });
    });
}

// Check-In Flow
function setupCheckinFlow() {
    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            const currentStep = button.closest('.checkin-step');
            const nextStepId = button.dataset.next;
            
            // Save data from current step
            saveCheckinData(currentStep.id.replace('checkin-', ''));
            
            // Update progress steps
            updateProgressSteps(nextStepId);
            
            // Hide current step, show next
            currentStep.classList.remove('active');
            document.getElementById(`checkin-${nextStepId}`).classList.add('active');
        });
    });
}

function saveCheckinData(step) {
    // Save slider values and other inputs
    if (step === 'body') {
        state.checkinData.body = {
            energy: document.getElementById('energy-slider').value,
            comfort: document.getElementById('comfort-slider').value
        };
    }
    // Add other steps here
}

function updateProgressSteps(nextStep) {
    const stepOrder = ['body', 'senses', 'mind', 'intellect', 'soul'];
    const nextIndex = stepOrder.indexOf(nextStep);
    
    progressSteps.forEach((step, index) => {
        if (index <= nextIndex) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

// Habit Tracking
function setupHabitTracking() {
    const habitCheckboxes = document.querySelectorAll('.habit-item input');
    habitCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const habitId = e.target.id.replace('habit-', '');
            state.habits[habitId] = e.target.checked;
            saveUserData();
        });
    });
}

// Urge Management
function setupUrgeManagement() {
    document.getElementById('breathe-btn').addEventListener('click', startBreathingExercise);
    document.getElementById('redirect-btn').addEventListener('click', redirectToPurpose);
    document.getElementById('exercise-btn').addEventListener('click', suggestExercise);
}

function showUrgeModal() {
    state.lastUrgeTime = new Date();
    urgeModal.classList.add('active');
    startUrgeTimer();
}

function hideUrgeModal() {
    urgeModal.classList.remove('active');
}

function startUrgeTimer() {
    const timerEl = document.getElementById('urge-timer');
    let seconds = 0;
    
    const timer = setInterval(() => {
        seconds++;
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        timerEl.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
        
        if (!urgeModal.classList.contains('active')) {
            clearInterval(timer);
        }
    }, 1000);
}

function startBreathingExercise() {
    hideUrgeModal();
    alert('Starting 5-minute breathing exercise...');
    // In a full app, this would open a guided breathing exercise
}

function redirectToPurpose() {
    hideUrgeModal();
    // Show user's IKIGAI purpose statement
    sections.ikigai.classList.add('active');
    sections.dashboard.classList.remove('active');
    document.querySelector('[data-section="ikigai"]').classList.add('active');
    document.querySelector('[data-section="dashboard"]').classList.remove('active');
}

function suggestExercise() {
    hideUrgeModal();
    const exercises = [
        "Do 20 push-ups",
        "Take a 5-minute walk",
        "Stretch for 3 minutes",
        "Do 30 jumping jacks"
    ];
    const randomExercise = exercises[Math.floor(Math.random() * exercises.length)];
    alert(`Suggested exercise: ${randomExercise}`);
}

// Data Management
function loadUserData() {
    const savedData = localStorage.getItem('ikigaiAppData');
    if (savedData) {
        Object.assign(state, JSON.parse(savedData));
    }
    
    // Update UI with loaded data
    document.getElementById('username').textContent = state.currentUser;
    document.getElementById('nofap-stat').textContent = `${state.streaks.nofap} days`;
    document.getElementById('trading-stat').textContent = `${state.streaks.trading}/5 wins`;
    
    // Set habit checkboxes
    Object.keys(state.habits).forEach(habitId => {
        const checkbox = document.getElementById(`habit-${habitId}`);
        if (checkbox) checkbox.checked = state.habits[habitId];
    });
}

function saveUserData() {
    localStorage.setItem('ikigaiAppData', JSON.stringify(state));
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
