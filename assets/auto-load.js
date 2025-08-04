// Auto-load Model Feature for Qwen3 WebGPU
(function() {
    'use strict';

    // Configuration
    const AUTO_LOAD_DELAY = 800; // ms to wait before auto-loading
    const STORAGE_KEY = 'qwen3-auto-load-enabled';

    // Check if auto-load is enabled (default: true)
    let autoLoadEnabled = localStorage.getItem(STORAGE_KEY) !== 'false';

    function initAutoLoad() {
        // Only auto-load if it's enabled and this is a fresh page load
        if (!autoLoadEnabled || sessionStorage.getItem('model-load-attempted')) {
            return;
        }

        // Mark that we've attempted to load
        sessionStorage.setItem('model-load-attempted', 'true');

        // Wait for the component to be ready, then auto-load
        setTimeout(() => {
            attemptAutoLoad();
        }, AUTO_LOAD_DELAY);
    }

    function attemptAutoLoad() {
        // Look for the load button
        const loadButton = findLoadButton();

        if (loadButton && !loadButton.disabled && loadButton.textContent.includes('Load model')) {
            console.log('🚀 Auto-loading Qwen3 model...');

            // Show loading indicator
            showAutoLoadNotification();

            // Click the load button
            loadButton.click();

            // Track successful auto-load
            console.log('✅ Model auto-load initiated');
        }
    }

    function findLoadButton() {
        // Multiple selectors to find the load button
        const selectors = [
            'button:contains("Load model")',
            'button[class*="bg-blue"]:contains("Load")',
            '.btn-primary:contains("Load")',
            'button:not(:disabled)'
        ];

        for (const selector of selectors) {
            const buttons = document.querySelectorAll('button');
            for (const button of buttons) {
                if (button.textContent.includes('Load model') && !button.disabled) {
                    return button;
                }
            }
        }

        return null;
    }

    function showAutoLoadNotification() {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'auto-load-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">🚀</div>
                <div class="notification-text">
                    <strong>Auto-loading model...</strong>
                    <small>Qwen3-0.6B is being loaded automatically for you</small>
                </div>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        // Add styles
        const styles = `
            .auto-load-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(37, 99, 235, 0.2);
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
                z-index: 1000;
                animation: slideInRight 0.4s ease-out;
                max-width: 350px;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            }

            .notification-content {
                display: flex;
                align-items: center;
                padding: 16px;
                gap: 12px;
            }

            .notification-icon {
                font-size: 24px;
                flex-shrink: 0;
            }

            .notification-text {
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: 4px;
            }

            .notification-text strong {
                color: #2563eb;
                font-weight: 600;
                font-size: 14px;
            }

            .notification-text small {
                color: #6b7280;
                font-size: 12px;
                line-height: 1.4;
            }

            .notification-close {
                background: none;
                border: none;
                font-size: 18px;
                color: #9ca3af;
                cursor: pointer;
                padding: 4px;
                border-radius: 4px;
                flex-shrink: 0;
                transition: all 0.2s ease;
            }

            .notification-close:hover {
                background: #f3f4f6;
                color: #374151;
            }

            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }

            .auto-load-notification.closing {
                animation: slideOutRight 0.3s ease-in forwards;
            }

            @media (prefers-color-scheme: dark) {
                .auto-load-notification {
                    background: rgba(31, 41, 55, 0.95);
                    border-color: rgba(37, 99, 235, 0.3);
                }

                .notification-text small {
                    color: #9ca3af;
                }

                .notification-close:hover {
                    background: #374151;
                    color: #e5e7eb;
                }
            }
        `;

        // Add styles to document if not already added
        if (!document.getElementById('auto-load-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'auto-load-styles';
            styleSheet.textContent = styles;
            document.head.appendChild(styleSheet);
        }

        // Add to page
        document.body.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.classList.add('closing');
                setTimeout(() => {
                    if (notification.parentElement) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 5000);
    }

    // Initialize when DOM is ready
    function initialize() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initAutoLoad);
        } else {
            initAutoLoad();
        }
    }

    // Start the auto-load process
    initialize();

    // Export for debugging
    window.QwenAutoLoad = {
        enable: () => {
            autoLoadEnabled = true;
            localStorage.setItem(STORAGE_KEY, 'true');
        },
        disable: () => {
            autoLoadEnabled = false;
            localStorage.setItem(STORAGE_KEY, 'false');
        },
        isEnabled: () => autoLoadEnabled,
        manualTrigger: attemptAutoLoad
    };

})();
