// Add current date to footer
document.getElementById('current-date').textContent = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
});

// Add click functionality to regions
document.querySelectorAll('.region').forEach(region => {
    region.addEventListener('click', () => {
        const regionName = region.querySelector('h3').textContent;
        const lawyersCount = region.getAttribute('data-lawyers');
        alert(`${regionName} has ${lawyersCount} lawyers per 100,000 people.`);
    });
});