(() => {
    const trigger = document.getElementById('scroll-to-projects');
    const projects = document.getElementById('projects');

    if (!trigger || !projects) {
        return;
    }

    const scrollToProjects = () => {
        projects.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    trigger.addEventListener('click', scrollToProjects);

    trigger.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            scrollToProjects();
        }
    });
})();
