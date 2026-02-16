// Service Worker Registration Helper
// This file handles the registration and lifecycle of the service worker

export function register() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            const swUrl = `${import.meta.env.BASE_URL}service-worker.js`;

            navigator.serviceWorker
                .register(swUrl)
                .then((registration) => {
                    console.log('✅ Service Worker registered:', registration);

                    // Check for updates periodically
                    setInterval(() => {
                        registration.update();
                    }, 60000); // Check every minute

                    registration.onupdatefound = () => {
                        const installingWorker = registration.installing;
                        if (installingWorker == null) {
                            return;
                        }

                        installingWorker.onstatechange = () => {
                            if (installingWorker.state === 'installed') {
                                if (navigator.serviceWorker.controller) {
                                    // New update available
                                    console.log('🔄 New content is available; please refresh.');

                                    // Notify user about update
                                    if (window.confirm('New version available! Reload to update?')) {
                                        window.location.reload();
                                    }
                                } else {
                                    // Content is cached for offline use
                                    console.log('✅ Content is cached for offline use.');
                                }
                            }
                        };
                    };
                })
                .catch((error) => {
                    console.error('❌ Service Worker registration failed:', error);
                });
        });
    }
}

export function unregister() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready
            .then((registration) => {
                registration.unregister();
            })
            .catch((error) => {
                console.error(error.message);
            });
    }
}
