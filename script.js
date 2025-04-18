// Set today's date
document.getElementById('date').textContent = new Date().toDateString();

// Check-In Button
document.getElementById('checkin-btn').addEventListener('click', () => {
    alert('Daily check-in flow would go here!\n(Body → Senses → Mind → Soul)');
});

// IKIGAI Quadrants
const quadrants = document.querySelectorAll('.quadrant');
quadrants.forEach(quad => {
    quad.addEventListener('click', () => {
        quad.style.backgroundColor = '#FF9800';
        alert(`Editing: ${quad.id}`);
    });
});

// Journal Save
document.getElementById('save-journal').addEventListener('click', () => {
    const entry = document.getElementById('journal-entry').value;
    localStorage.setItem('journal', entry);
    alert('Journal saved!');
});

// Urge Redirection (Example: Trigger after 5 seconds)
setTimeout(() => {
    document.getElementById('urge-alert').classList.remove('hidden');
}, 5000);

document.getElementById('redirect-btn').addEventListener('click', () => {
    window.open('https://www.youtube.com/watch?v=inpok4MKVLM', '_blank'); // Meditation link
});
