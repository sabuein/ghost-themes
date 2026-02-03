"use strict";

const router = {
    routes: [],

    registerRoute(path, handler) {
        const paramNames = [];
        const regexPath = path
            .replace(/\/:([^/]+)/g, (_, key) => {
                paramNames.push(key);
                return "/([^/]+)";
            })
            .replace(/\*/g, '.*'); // wildcard support

        this.routes.push({
            path,
            regex: new RegExp(`^${regexPath}$`),
            handler,
            paramNames,
        });
    },

    handleRoute(path) {
        for (const route of this.routes) {
            const match = path.match(route.regex);
            if (match) {
                const params = {};
                route.paramNames?.forEach((name, index) => {
                    params[name] = decodeURIComponent(match[index + 1]);
                });
                route.handler(params);
                window.scrollTo(0, 0);
                return;
            }
        }

        // 404 fallback
        const fallback = this.routes.find(r => r.path === "*");
        if (fallback) fallback.handler();
    },

    navigateTo(path) {
        history.pushState({}, '', path);
        this.handleRoute(path);
    },

    init() {
        // Handle browser back/forward
        window.addEventListener('popstate', () => {
            this.handleRoute(location.pathname);
        });

        // Link click hijacking
        document.addEventListener('click', (e) => {
            // Ignore default if Ctrl/Cmd/Shift/Alt are pressed
            if (
                e.defaultPrevented ||
                e.button !== 0 ||
                e.metaKey || e.ctrlKey || e.shiftKey || e.altKey
            ) return;

            const anchor = e.target.closest("a");
            if (!anchor || anchor.target === "_blank" || anchor.hasAttribute('download')) return;

            const href = anchor.getAttribute("href");
            if (!href || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("#") || href.contains("#")) return;

            // Use router for internal link
            e.preventDefault();
            this.navigateTo(href);
        });

        // Initial load
        this.handleRoute(location.pathname);
    }
};

const initPageRouter = () => {
    router.registerRoute('/', () => {
        console.log('Home page loaded');
    });

    router.registerRoute('/about/', () => {
        console.log('About page loaded');
    });

    router.registerRoute('/careers/', () => {
        console.log('Careers page loaded');
    });

    router.registerRoute('/ai/', () => {
        console.log('AI page loaded');
    });

    router.registerRoute('/pwa/', () => {
        console.log('PWA page loaded');
    });

    router.registerRoute('/pwa/#benefits', () => {
        console.log('PWA page loaded: Benefits');
    });

    router.registerRoute('/careers/', () => {
        console.log('Careers page loaded');
    });

    router.registerRoute('/products/:id', (params) => {
        console.log(`Product detail page loaded for ID: ${params.id}`);
        document.title = `Product: ${params.id}`;
    });

    router.registerRoute('/testing/', () => {
        console.log('Testing page loaded');
    });

    /*

    router.registerRoute('*', () => {
        console.log('404 - Page not found');
        document.title = 'Page Not Found';
    });

    */

    router.init();
};

export { router, initPageRouter as default };
