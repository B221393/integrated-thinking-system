document.addEventListener('DOMContentLoaded', () => {
    console.log('System initialized.');
    
    const cards = document.querySelectorAll('.glass-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            console.log('Interacting with system module...');
        });
    });
});
