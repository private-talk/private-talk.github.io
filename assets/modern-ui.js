// Modern UI Enhancements for Qwen3 WebGPU
(function() {
    'use strict';

    // Auto-load model on page load
    let autoLoadEnabled = true;
    let modelLoadTimeout;

    // Enhanced UI interactions
    function initializeModernUI() {
        // Add smooth animations to elements as they appear
        observeElements();

        // Add keyboard shortcuts
        setupKeyboardShortcuts();

        // Add theme detection
        setupThemeHandling();

        // Auto-load model after a short delay
        if (autoLoadEnabled) {
            modelLoadTimeout = setTimeout(() => {
                autoLoadModel();
            }, 1000);
        }
    }

    // Auto-load model function
    function autoLoadModel() {
        const loadButton = document.querySelector('button:contains("Load model")');
        if (loadButton && !loadButton.disabled) {
            console.log('Auto-loading model...');
            loadButton.click();

            // Show auto-load notice
            showAutoLoadNotice();
        }
    }

    // Show auto-load notice
    function showAutoLoadNotice() {
        const notice = document.createElement('div');
        notice.className = 'auto-load-notice animate-fade-in';
        notice.innerHTML = '🚀 Auto-loading model for you...';

        // Find the best place to insert the notice
        const container = document.querySelector('.hero-section') || document.body;
        container.appendChild(notice);

        // Remove notice after 3 seconds
        setTimeout(() => {
            notice.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => notice.remove(), 300);
        }, 3000);
    }

    // Observe elements for animations
    function observeElements() {
        if (!window.IntersectionObserver) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });

        // Observe elements that should animate in
        document.querySelectorAll('.message-group, .example-prompt, .progress-item').forEach(el => {
            observer.observe(el);
        });
    }

    // Setup keyboard shortcuts
    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Enter to send message
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                const sendButton = document.querySelector('.send-button:not(:disabled)');
                if (sendButton) {
                    e.preventDefault();
                    sendButton.click();
                }
            }

            // Escape to clear input
            if (e.key === 'Escape') {
                const input = document.querySelector('.message-input');
                if (input && input.value) {
                    input.value = '';
                    input.style.height = 'auto';
                    e.preventDefault();
                }
            }

            // Ctrl/Cmd + R to reset (when not loading)
            if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
                const resetButton = document.querySelector('span[contains(text(), "Reset")]');
                if (resetButton) {
                    e.preventDefault();
                    resetButton.click();
                }
            }
        });
    }

    // Theme handling
    function setupThemeHandling() {
        // Detect system theme preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

        function updateTheme(e) {
            document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
        }

        updateTheme(prefersDark);
        prefersDark.addEventListener('change', updateTheme);
    }

    // Enhanced textarea auto-resize
    function enhanceTextareaResize() {
        document.addEventListener('input', (e) => {
            if (e.target.matches('.message-input')) {
                const textarea = e.target;
                textarea.style.height = 'auto';
                const maxHeight = 150;
                const newHeight = Math.min(textarea.scrollHeight, maxHeight);
                textarea.style.height = newHeight + 'px';

                // Add visual feedback
                const wrapper = textarea.closest('.input-wrapper');
                if (wrapper) {
                    wrapper.style.borderColor = textarea.value ? 'var(--primary-blue)' : 'var(--glass-border)';
                }
            }
        });
    }

    // Enhanced button interactions
    function enhanceButtons() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('.btn-primary, .send-button, .example-prompt')) {
                // Add ripple effect
                createRippleEffect(e.target, e);
            }
        });
    }

    // Create ripple effect
    function createRippleEffect(element, event) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            background-color: rgba(255, 255, 255, 0.3);
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
            pointer-events: none;
        `;

        const rippleContainer = element.querySelector('.ripple-container') || element;
        rippleContainer.style.position = 'relative';
        rippleContainer.style.overflow = 'hidden';
        rippleContainer.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    }

    // Enhanced progress bars
    function enhanceProgressBars() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }

            @keyframes fadeOut {
                from { opacity: 1; transform: translateY(0); }
                to { opacity: 0; transform: translateY(-10px); }
            }
        `;
        document.head.appendChild(style);
    }

    // Enhanced loading states
    function enhanceLoadingStates() {
        // Observe for loading elements
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        // Add enhanced animations to new progress bars
                        const progressBars = node.querySelectorAll?.('.progress-fill') ||
                                           (node.classList?.contains('progress-fill') ? [node] : []);

                        progressBars.forEach(bar => {
                            bar.style.animation = 'none';
                            setTimeout(() => {
                                bar.style.animation = '';
                            }, 10);
                        });

                        // Add fade-in animation to new messages
                        if (node.classList?.contains('message-group')) {
                            node.classList.add('animate-slide-up');
                        }
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Smooth scrolling for chat
    function enhanceChatScrolling() {
        let isScrolling = false;

        document.addEventListener('scroll', () => {
            if (!isScrolling) {
                requestAnimationFrame(() => {
                    // Add scroll shadow effects
                    const scrollables = document.querySelectorAll('.messages-area');
                    scrollables.forEach(area => {
                        const isAtTop = area.scrollTop <= 10;
                        const isAtBottom = area.scrollTop >= area.scrollHeight - area.clientHeight - 10;

                        area.style.setProperty('--scroll-shadow-top', isAtTop ? '0' : '1');
                        area.style.setProperty('--scroll-shadow-bottom', isAtBottom ? '0' : '1');
                    });

                    isScrolling = false;
                });
                isScrolling = true;
            }
        }, { passive: true });
    }

    // Performance optimizations
    function optimizePerformance() {
        // Debounce resize events
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // Recalculate layouts if needed
                document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
            }, 100);
        });

        // Optimize scroll performance
        const scrollables = document.querySelectorAll('.messages-area');
        scrollables.forEach(area => {
            area.style.willChange = 'scroll-position';
        });
    }

    // Accessibility enhancements
    function enhanceAccessibility() {
        // Add focus management
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });

        // Enhanced focus styles for keyboard navigation
        const style = document.createElement('style');
        style.textContent = `
            .keyboard-navigation *:focus {
                outline: 2px solid var(--primary-blue) !important;
                outline-offset: 2px !important;
            }

            .messages-area {
                --scroll-shadow-top: 0;
                --scroll-shadow-bottom: 0;
            }

            .messages-area::before {
                content: '';
                position: sticky;
                top: 0;
                height: 10px;
                background: linear-gradient(to bottom, rgba(0,0,0,0.1), transparent);
                opacity: var(--scroll-shadow-top);
                transition: opacity 0.3s ease;
                z-index: 1;
            }

            .messages-area::after {
                content: '';
                position: sticky;
                bottom: 0;
                height: 10px;
                background: linear-gradient(to top, rgba(0,0,0,0.1), transparent);
                opacity: var(--scroll-shadow-bottom);
                transition: opacity 0.3s ease;
                z-index: 1;
            }
        `;
        document.head.appendChild(style);
    }

    // Error handling and user feedback
    function enhanceErrorHandling() {
        window.addEventListener('error', (e) => {
            console.error('UI Error:', e.error);
            // Could show user-friendly error messages here
        });

        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
        });
    }

    // Initialize everything when DOM is ready
    function initialize() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeModernUI);
        } else {
            initializeModernUI();
        }

        // Initialize all enhancements
        enhanceTextareaResize();
        enhanceButtons();
        enhanceProgressBars();
        enhanceLoadingStates();
        enhanceChatScrolling();
        optimizePerformance();
        enhanceAccessibility();
        enhanceErrorHandling();
    }

    // Utility function to check if element contains text
    HTMLElement.prototype.contains = HTMLElement.prototype.contains || function(text) {
        return this.textContent.includes(text);
    };

    // Start initialization
    initialize();

    // Export functions for external access if needed
    window.QwenUIEnhancements = {
        autoLoadModel,
        createRippleEffect,
        observeElements
    };

})();
