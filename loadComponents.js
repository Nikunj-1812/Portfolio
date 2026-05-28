// Keep the page anchored to the top on refresh; hash scrolling is handled manually below.
history.scrollRestoration = 'manual';
const navigationType = performance.getEntriesByType('navigation')?.[0]?.type || '';
const isReload = navigationType === 'reload';

if (isReload || !window.location.hash) {
    window.scrollTo(0, 0);
}

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
        const scriptsToLoad = ['firebase-init.mjs', 'main.js'];
        if (window.location.pathname.includes('blog.html') || window.location.pathname.includes('blog2.html') || window.location.pathname.includes('blog3.html')) {
            scriptsToLoad.push('blog.js');
        }
        if (window.location.pathname.includes('projects.html')) {
            scriptsToLoad.push('projects.js');
        }

        for (let scriptSrc of scriptsToLoad) {
            const script = document.createElement('script');
            script.src = scriptSrc;
            if (scriptSrc.endsWith('.mjs')) {
                script.type = 'module';
            }
            document.body.appendChild(script);
        }

        // After components are injected, scroll to hash if present
        // (sections like #about and #contact are dynamically loaded,
        //  so the browser's native hash scroll fires before they exist)
        const hash = window.location.hash;
        const scrollToHome = () => {
            const home = document.querySelector('#home');
            if (home) {
                window.scrollTo({ top: 0, behavior: 'instant' });
                return true;
            }
            return false;
        };

        if (isReload || !hash) {
            scrollToHome();
        } else if (hash) {
            // Kill CSS smooth scroll so there's zero animation drift
            document.documentElement.style.scrollBehavior = 'auto';
            document.body.style.scrollBehavior = 'auto';

            const scrollToHash = () => {
                const target = document.querySelector(hash);
                if (target) {
                    const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 72;
                    const top = target.getBoundingClientRect().top + window.scrollY - navbarHeight - 16;
                    window.scrollTo({ top, behavior: 'instant' });
                    // Restore smooth scroll after the instant jump is painted
                    requestAnimationFrame(() => requestAnimationFrame(() => {
                        document.documentElement.style.scrollBehavior = '';
                        document.body.style.scrollBehavior = '';
                    }));
                    return true;
                }
                return false;
            };

            if (!scrollToHash()) {
                setTimeout(scrollToHash, 80);
            }
        }


    } catch (error) {
        console.error('Error loading components. Make sure you are running a local web server (like VSCode Live Server) so that fetch() works properly.', error);
        alert("Components failed to load. Please ensure you are viewing this site through a local web server (e.g., Live Server) rather than a direct file:// URL to avoid CORS restrictions.");
    }
}

document.addEventListener('DOMContentLoaded', loadComponents);
