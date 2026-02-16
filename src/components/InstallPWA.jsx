import { useState, useEffect } from 'react';

const InstallPWA = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showInstallBanner, setShowInstallBanner] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
            return;
        }

        // Listen for beforeinstallprompt event
        const handleBeforeInstallPrompt = (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later
            setDeferredPrompt(e);
            // Show install banner after 3 seconds
            setTimeout(() => {
                setShowInstallBanner(true);
            }, 3000);
        };

        // Listen for app installed event
        const handleAppInstalled = () => {
            console.log('✅ PWA was installed');
            setIsInstalled(true);
            setShowInstallBanner(false);
            setDeferredPrompt(null);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) {
            return;
        }

        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to install prompt: ${outcome}`);

        // Clear the deferredPrompt
        setDeferredPrompt(null);
        setShowInstallBanner(false);
    };

    const handleDismiss = () => {
        setShowInstallBanner(false);
        // Don't show again for this session
        sessionStorage.setItem('pwa-install-dismissed', 'true');
    };

    // Don't show if already installed or dismissed
    if (isInstalled || !showInstallBanner || sessionStorage.getItem('pwa-install-dismissed')) {
        return null;
    }

    return (
        <div className="pwa-install-banner">
            <div className="pwa-install-content">
                <div className="pwa-install-icon">📱</div>
                <div className="pwa-install-text">
                    <h3>Install Finance Tracker</h3>
                    <p>Add to your home screen for quick access and offline use!</p>
                </div>
                <div className="pwa-install-actions">
                    <button onClick={handleInstallClick} className="btn-primary btn-sm">
                        Install
                    </button>
                    <button onClick={handleDismiss} className="btn-text">
                        ✕
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InstallPWA;
