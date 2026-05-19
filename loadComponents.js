async function loadComponents() {
    try {
        const components = [
            { id: 'navbar-placeholder', file: 'components/navbar.html' },
            { id: 'hero-placeholder', file: 'components/hero.html' },
            { id: 'about-placeholder', file: 'components/about.html' },
            { id: 'footer-placeholder', file: 'components/footer.html' }
        ];

        for (let comp of components) {
            const el = document.getElementById(comp.id);
            if (el) {
                const response = await fetch(comp.file);
                if (response.ok) {
                    const html = await response.text();
                    el.outerHTML = html;
                } else {
                    console.error('Failed to load', comp.file);
                }
            }
        }

        // Initialize scripts after components are loaded
        const scriptsToLoad = ['main.js'];
        if (window.location.pathname.includes('blog.html')) {
            scriptsToLoad.push('blog.js');
        }
        if (window.location.pathname.includes('projects.html')) {
            scriptsToLoad.push('projects.js');
        }

        for (let scriptSrc of scriptsToLoad) {
            const script = document.createElement('script');
            script.src = scriptSrc;
            document.body.appendChild(script);
        }
    } catch (error) {
        console.error('Error loading components. Make sure you are running a local web server (like VSCode Live Server) so that fetch() works properly.', error);
        alert("Components failed to load. Please ensure you are viewing this site through a local web server (e.g., Live Server) rather than a direct file:// URL to avoid CORS restrictions.");
    }
}

document.addEventListener('DOMContentLoaded', loadComponents);
