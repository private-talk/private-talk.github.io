// HellerMind AI - UI Enhancements
(function() {
    'use strict';

    console.log('🎨 Initializing HellerMind AI UI enhancements...');

    // Wait for React to load
    setTimeout(function() {
        initializeUI();

        // Continue monitoring for changes
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    enhanceInterface();
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }, 2000);

    function initializeUI() {
        enhanceInterface();
        updateTitle();
        fixButtonPositioning();
        enhanceChatInterface();
    }

    function updateTitle() {
        // Update the main title to HellerMind - AI
        const titleElements = document.querySelectorAll('.text-4xl, h1');
        titleElements.forEach(function(title) {
            if (title.textContent.includes('Qwen3') || title.textContent.includes('WebGPU')) {
                title.textContent = 'HellerMind - AI';
                title.classList.add('hellermind-title');
            }
        });

        // Update subtitle
        const subtitleElements = document.querySelectorAll('.text-2xl, h2');
        subtitleElements.forEach(function(subtitle) {
            if (subtitle.textContent.includes('hybrid reasoning')) {
                subtitle.textContent = 'Advanced AI Assistant with Local Processing';
            }
        });
    }

    function fixButtonPositioning() {
        // Find button containers and fix their layout
        const buttonContainers = document.querySelectorAll('.space-y-4, .space-x-4');

        buttonContainers.forEach(function(container) {
            // Check if it contains buttons
            const buttons = container.querySelectorAll('button');
            if (buttons.length > 0) {
                container.classList.add('button-group');

                // Style buttons properly
                buttons.forEach(function(button, index) {
                    if (button.textContent.toLowerCase().includes('think')) {
                        button.classList.add('think-button');
                    }

                    if (button.textContent.toLowerCase().includes('send')) {
                        button.classList.add('send-button-main');
                    }
                });
            }
        });
    }

    function enhanceChatInterface() {
        // Find textarea and enhance it for chat
        const textareas = document.querySelectorAll('textarea');
        textareas.forEach(function(textarea) {
            if (!textarea.classList.contains('enhanced')) {
                // Create chat input container
                const container = document.createElement('div');
                container.className = 'input-container';

                // Wrap textarea
                textarea.parentNode.insertBefore(container, textarea);
                container.appendChild(textarea);

                // Add chat-input class
                textarea.classList.add('chat-input', 'enhanced');
                textarea.placeholder = 'Type your message to HellerMind AI...';

                // Create send button
                const sendButton = document.createElement('button');
                sendButton.className = 'send-button';
                sendButton.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 11L12 6L17 11M12 18V7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                `;

                container.appendChild(sendButton);

                // Add send functionality
                sendButton.addEventListener('click', function() {
                    // Find and click the main send button if it exists
                    const mainSendButton = document.querySelector('button:not(.send-button)');
                    if (mainSendButton && mainSendButton.textContent.toLowerCase().includes('send')) {
                        mainSendButton.click();
                    }
                });

                // Add Enter key support
                textarea.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendButton.click();
                    }
                });
            }
        });
    }

    function enhanceInterface() {
        // Add professional classes to containers
        const containers = document.querySelectorAll('[class*="max-w-"], [class*="w-["]');
        containers.forEach(function(container) {
            if (!container.classList.contains('enhanced-container')) {
                container.classList.add('enhanced-container', 'chat-container');
            }
        });

        // Enhance buttons
        const buttons = document.querySelectorAll('button:not(.enhanced)');
        buttons.forEach(function(button) {
            button.classList.add('enhanced');

            // Add hover effects
            button.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-1px)';
            });

            button.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });

        // Enhance inputs
        const inputs = document.querySelectorAll('input:not(.enhanced), textarea:not(.enhanced)');
        inputs.forEach(function(input) {
            if (!input.classList.contains('enhanced')) {
                input.classList.add('enhanced');

                // Add focus effects
                input.addEventListener('focus', function() {
                    this.parentNode.classList.add('focused');
                });

                input.addEventListener('blur', function() {
                    this.parentNode.classList.remove('focused');
                });
            }
        });
    }

    // Update page content
    function updateContent() {
        // Update description text
        const paragraphs = document.querySelectorAll('p');
        paragraphs.forEach(function(p) {
            if (p.textContent.includes('Qwen3-0.6B')) {
                p.innerHTML = p.innerHTML.replace(
                    'Qwen3-0.6B',
                    '<strong>HellerMind AI</strong>'
                );
            }

            if (p.textContent.includes('🤗 Transformers.js')) {
                p.innerHTML = p.innerHTML.replace(
                    '🤗 Transformers.js',
                    '🧠 Advanced AI Technology'
                );
            }
        });
    }

    // Add loading states
    function addLoadingStates() {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(function(button) {
            button.addEventListener('click', function() {
                if (!this.classList.contains('loading')) {
                    this.classList.add('loading');
                    const originalText = this.textContent;

                    // Add loading spinner
                    this.innerHTML = `
                        <div class="loading-spinner"></div>
                        <span>Processing...</span>
                    `;

                    // Remove loading state after 3 seconds
                    setTimeout(() => {
                        this.classList.remove('loading');
                        this.textContent = originalText;
                    }, 3000);
                }
            });
        });
    }

    // Initialize everything
    setTimeout(function() {
        updateContent();
        addLoadingStates();
    }, 3000);

    console.log('✨ HellerMind AI UI enhancements loaded!');
})();

