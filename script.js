document.addEventListener('DOMContentLoaded', function() {
    // Set current date
    const now = new Date();
    document.getElementById('current-date').textContent = now.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric' 
    });

    // Navigation System
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('.section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and sections
            navLinks.forEach(item => item.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show corresponding section
            const targetId = this.getAttribute('data-section');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // Dashboard Interactions
    const quickCheckin = document.getElementById('quick-checkin');
    const quickJournal = document.getElementById('quick-journal');
    
    quickCheckin.addEventListener('click', function() {
        // Switch to check-in section
        navLinks.forEach(item => item.classList.remove('active'));
        sections.forEach(section => section.classList.remove('active'));
        
        document.querySelector('[data-section="checkin"]').classList.add('active');
        document.getElementById('checkin').classList.add('active');
    });
    
    quickJournal.addEventListener('click', function() {
        // Switch to journal section
        navLinks.forEach(item => item.classList.remove('active'));
        sections.forEach(section => section.classList.remove('active'));
        
        document.querySelector('[data-section="journal"]').classList.add('active');
        document.getElementById('journal').classList.add('active');
    });

    // Habit Tracker
    const habitCheckboxes = document.querySelectorAll('.habit-item input');
    habitCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // Save habit state to localStorage
            const habits = {
                meditation: document.getElementById('habit-meditation').checked,
                exercise: document.getElementById('habit-exercise').checked,
                reading: document.getElementById('habit-reading').checked
            };
            localStorage.setItem('habits', JSON.stringify(habits));
        });
    });

    // Load saved habits
    const savedHabits = localStorage.getItem('habits');
    if (savedHabits) {
        const habits = JSON.parse(savedHabits);
        document.getElementById('habit-meditation').checked = habits.meditation;
        document.getElementById('habit-exercise').checked = habits.exercise;
        document.getElementById('habit-reading').checked = habits.reading;
    }

    // IKIGAI Section
    const ikigaiTextareas = document.querySelectorAll('.quadrant textarea');
    const saveIkigaiBtn = document.getElementById('save-ikigai');
    
    // Load saved IKIGAI
    const savedIkigai = localStorage.getItem('ikigai');
    if (savedIkigai) {
        const ikigaiData = JSON.parse(savedIkigai);
        ikigaiTextareas.forEach(textarea => {
            const quadrantId = textarea.closest('.quadrant').id;
            textarea.value = ikigaiData[quadrantId] || '';
        });
    }
    
    saveIkigaiBtn.addEventListener('click', function() {
        const ikigaiData = {
            love: document.querySelector('#love textarea').value,
            good: document.querySelector('#good textarea').value,
            need: document.querySelector('#need textarea').value,
            paid: document.querySelector('#paid textarea').value
        };
        localStorage.setItem('ikigai', JSON.stringify(ikigaiData));
        alert('IKIGAI saved successfully!');
    });

    // Journal Section
    const journalTabs = document.querySelectorAll('.journal-tabs .tab-btn');
    const journalText = document.getElementById('journal-text');
    const saveJournalBtn = document.getElementById('save-journal');
    const entriesList = document.getElementById('entries-list');
    
    journalTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            journalTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            // In a full app, you would load different journal types here
        });
    });
    
    // Load saved journal entries
    const savedEntries = localStorage.getItem('journalEntries');
    if (savedEntries) {
        const entries = JSON.parse(savedEntries);
        entries.forEach(entry => {
            const entryElement = document.createElement('div');
            entryElement.className = 'entry-item';
            entryElement.innerHTML = `
                <small>${new Date(entry.date).toLocaleString()}</small>
                <p>${entry.text.substring(0, 100)}...</p>
            `;
            entriesList.appendChild(entryElement);
        });
    }
    
    saveJournalBtn.addEventListener('click', function() {
        const entryText = journalText.value.trim();
        if (!entryText) return;
        
        const entry = {
            date: new Date().toISOString(),
            text: entryText,
            type: document.querySelector('.journal-tabs .active').getAttribute('data-tab')
        };
        
        // Get existing entries or create new array
        const existingEntries = JSON.parse(localStorage.getItem('journalEntries') || []);
        existingEntries.unshift(entry); // Add new entry at beginning
        
        // Save to localStorage
        localStorage.setItem('journalEntries', JSON.stringify(existingEntries));
        
        // Add to UI
        const entryElement = document.createElement('div');
        entryElement.className = 'entry-item';
        entryElement.innerHTML = `
            <small>${new Date(entry.date).toLocaleString()}</small>
            <p>${entry.text.substring(0, 100)}...</p>
        `;
        entriesList.prepend(entryElement);
        
        // Clear textarea
        journalText.value = '';
        alert('Journal entry saved!');
    });

    // Tools Section
    const breathingTool = document.getElementById('breathing-tool');
    const redirectTool = document.getElementById('redirect-tool');
    
    breathingTool.querySelector('.start-btn').addEventListener('click', function() {
        alert('Starting 5-minute breathing exercise...');
        // In a full app, this would start a timer with animations
    });
    
    redirectTool.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.getAttribute('data-redirect');
            switch(action) {
                case 'exercise':
                    alert('Redirecting to quick exercise...');
                    break;
                case 'purpose':
                    // Switch to IKIGAI section
                    navLinks.forEach(item => item.classList.remove('active'));
                    sections.forEach(section => section.classList.remove('active'));
                    document.querySelector('[data-section="ikigai"]').classList.add('active');
                    document.getElementById('ikigai').classList.add('active');
                    break;
                case 'meditation':
                    alert('Starting meditation...');
                    break;
            }
        });
    });
});
