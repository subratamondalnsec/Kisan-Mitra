import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { promptInstall, isAppInstalled } from '../registerSW';
import { useTranslation } from '../hooks/useTranslation';

const InstallPWA = () => {
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    // Check if app is already installed
    setIsInstalled(isAppInstalled());

    // Listen for beforeinstallprompt event
    const handleBeforeInstall = () => {
      if (!isAppInstalled()) {
        setShowInstallPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    const installed = await promptInstall();
    if (installed) {
      setShowInstallPrompt(false);
      setIsInstalled(true);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // Store dismissal in localStorage to not show again for a while
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  // Don't show if already installed or dismissed recently
  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed);
      const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) {
        setShowInstallPrompt(false);
      }
    }
  }, []);

  if (isInstalled || !showInstallPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-xs animate-slide-up">
      <div className="backdrop-blur-md border border-gray-600 bg-[#010101] rounded-lg shadow-2xl p-3">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gradient-to-br from-brand-teal to-brand-golden rounded flex items-center justify-center">
              <img src="/logo.png" alt="" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-400 text-sm">
                {t('installApp')}
              </h3>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="bg-gray-600 text-gray-400 hover:text-gray-300 transition-colors rounded-full p-1 ml-1"
            aria-label="Dismiss"
          >
            <X className="w-2 h-2" />
          </button>
        </div>
        
        <div className="space-y-1 mb-3">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="w-1 h-1 bg-brand-teal rounded-full"></span>
            <span>{t('worksOffline')}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="w-1 h-1 bg-brand-teal rounded-full"></span>
            <span>{t('fasterLoading')}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="w-1 h-1 bg-brand-teal rounded-full"></span>
            <span>{t('homeScreenAccess')}</span>
          </div>
        </div>

        <button
          onClick={handleInstallClick}
          className="w-full bg-brand-teal/20 backdrop-blur-md border border-brand-teal/40 hover:bg-brand-teal/30 text-gray-300 font-medium py-2 px-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm"
        >
          <Download className="w-3 h-3" />
          {t('installApp')}
        </button>
      </div>
    </div>
  );
};

export default InstallPWA;
