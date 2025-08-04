// Code Copy Button Enhancement for Qwen3 WebGPU
(function() {
    'use strict';

    console.log('🔄 Initializing code copy functionality...');

    // CSS for copy button styling
    const copyButtonStyles = `
        .code-block-container {
            position: relative !important;
            display: block !important;
        }

        .copy-button {
            position: absolute !important;
            top: 8px !important;
            right: 8px !important;
            background: rgba(59, 130, 246, 0.9) !important;
            backdrop-filter: blur(10px) !important;
            -webkit-backdrop-filter: blur(10px) !important;
            border: 1px solid rgba(59, 130, 246, 0.4) !important;
            border-radius: 6px !important;
            padding: 6px 12px !important;
            color: #ffffff !important;
            font-family: 'Inter', sans-serif !important;
            font-size: 12px !important;
            font-weight: 600 !important;
            cursor: pointer !important;
            transition: all 0.2s ease !important;
            opacity: 1 !important;
            transform: translateY(0) !important;
            z-index: 1000 !important;
            display: flex !important;
            align-items: center !important;
            gap: 4px !important;
            min-width: 70px !important;
            justify-content: center !important;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3) !important;
            white-space: nowrap !important;
        }

        .copy-button:hover {
            background: rgba(59, 130, 246, 1) !important;
            transform: translateY(-1px) !important;
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4) !important;
        }

        .copy-button:active {
            transform: translateY(0) !important;
        }

        .copy-button.success {
            background: rgba(16, 185, 129, 0.9) !important;
            border-color: rgba(16, 185, 129, 0.4) !important;
        }

        .copy-button.success:hover {
            background: rgba(16, 185, 129, 1) !important;
        }

        .copy-icon {
            width: 14px !important;
            height: 14px !important;
            fill: currentColor !important;
            flex-shrink: 0 !important;
        }

        /* Enhanced code block styling with proper positioning */
        .enhanced-code-block,
        .enhanced-pre-block {
            background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%) !important;
            border: 1px solid rgba(59, 130, 246, 0.3) !important;
            border-radius: 8px !important;
            padding: 16px !important;
            padding-top: 45px !important;
            margin: 8px 0 !important;
            font-family: 'JetBrains Mono', 'Fira Code', Consolas, Monaco, 'Courier New', monospace !important;
            font-size: 13px !important;
            line-height: 1.5 !important;
            color: #e2e8f0 !important;
            overflow-x: auto !important;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2) !important;
            position: relative !important;
        }

        .enhanced-pre-block {
            padding: 20px !important;
            padding-top: 50px !important;
            margin: 12px 0 !important;
            line-height: 1.6 !important;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3) !important;
        }

        .enhanced-inline-code {
            background: rgba(15, 23, 42, 0.8) !important;
            color: #93c5fd !important;
            border: 1px solid rgba(59, 130, 246, 0.3) !important;
            border-radius: 4px !important;
            padding: 2px 6px !important;
            font-family: 'JetBrains Mono', 'Fira Code', Consolas, Monaco, 'Courier New', monospace !important;
            font-size: 12px !important;
        }

        /* Force positioning for markdown code blocks */
        .markdown pre,
        .markdown code {
            position: relative !important;
        }

        /* Override any conflicting styles */
        html body div#root .code-block-container {
            position: relative !important;
            display: block !important;
        }

        html body div#root .copy-button {
            position: absolute !important;
            top: 8px !important;
            right: 8px !important;
            z-index: 1000 !important;
            opacity: 1 !important;
        }
    `;

    // Add styles to document
    function addStyles() {
        if (!document.getElementById('copy-button-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'copy-button-styles';
            styleSheet.textContent = copyButtonStyles;
            document.head.appendChild(styleSheet);
        }
    }

    // Copy icon SVG
    const copyIconSVG = `
        <svg class="copy-icon" viewBox="0 0 16 16" fill="currentColor">
            <path d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V2Zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H6ZM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1H2Z"/>
        </svg>
    `;

    // Success icon SVG
    const successIconSVG = `
        <svg class="copy-icon" viewBox="0 0 16 16" fill="currentColor">
            <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
        </svg>
    `;

    // Copy text to clipboard
    async function copyToClipboard(text) {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
                return true;
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();

                const result = document.execCommand('copy');
                document.body.removeChild(textArea);
                return result;
            }
        } catch (err) {
            console.error('Failed to copy text: ', err);
            return false;
        }
    }

    // Create copy button
    function createCopyButton(codeElement, isInline = false) {
        const button = document.createElement('button');
        button.className = 'copy-button';
        button.innerHTML = copyIconSVG + '<span>Copy</span>';
        button.title = 'Copy code to clipboard';

        // Force positioning
        button.style.position = 'absolute';
        button.style.top = '8px';
        button.style.right = '8px';
        button.style.zIndex = '1000';
        button.style.opacity = '1';

        button.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();

            const textToCopy = codeElement.textContent || codeElement.innerText;
            const success = await copyToClipboard(textToCopy);

            if (success) {
                button.innerHTML = successIconSVG + '<span>Copied!</span>';
                button.classList.add('success');

                setTimeout(() => {
                    button.innerHTML = copyIconSVG + '<span>Copy</span>';
                    button.classList.remove('success');
                }, 2000);
            } else {
                button.innerHTML = copyIconSVG + '<span>Failed</span>';
                setTimeout(() => {
                    button.innerHTML = copyIconSVG + '<span>Copy</span>';
                }, 2000);
            }
        });

        return button;
    }

    // Enhance code elements
    function enhanceCodeElement(element) {
        if (element.closest('.code-block-container')) {
            return; // Already enhanced
        }

        const isInlineCode = element.tagName.toLowerCase() === 'code' &&
                            !element.closest('pre');

        if (isInlineCode && element.textContent.length <= 10) {
            // Skip short inline code
            element.classList.add('enhanced-inline-code');
            return;
        }

        // Handle code blocks and longer inline code
        if (element.tagName.toLowerCase() === 'pre') {
            element.classList.add('enhanced-pre-block');
        } else {
            element.classList.add('enhanced-code-block');
        }

        const container = document.createElement('div');
        container.className = 'code-block-container';
        container.style.position = 'relative';
        container.style.display = 'block';

        element.parentNode.insertBefore(container, element);
        container.appendChild(element);

        const copyButton = createCopyButton(element);
        container.appendChild(copyButton);

        console.log('✅ Enhanced code element with copy button');
    }

    // Find and enhance all code elements
    function enhanceAllCodeElements() {
        // Target code elements within the React app
        const codeElements = document.querySelectorAll('#root code, #root pre');

        codeElements.forEach(element => {
            enhanceCodeElement(element);
        });
    }

    // Observer for dynamically added content
    function setupMutationObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        // Check if the node itself is a code element
                        if (node.tagName && (node.tagName.toLowerCase() === 'code' || node.tagName.toLowerCase() === 'pre')) {
                            enhanceCodeElement(node);
                        }

                        // Check for code elements within the node
                        const codeElements = node.querySelectorAll && node.querySelectorAll('code, pre');
                        if (codeElements) {
                            codeElements.forEach(element => {
                                enhanceCodeElement(element);
                            });
                        }
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        return observer;
    }

    // Initialize the enhancement
    function initializeCodeCopyFeature() {
        addStyles();
        enhanceAllCodeElements();
        setupMutationObserver();

        // Re-enhance periodically to catch any missed elements
        setInterval(() => {
            enhanceAllCodeElements();
        }, 2000);

        console.log('✅ Code copy functionality initialized successfully');
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeCodeCopyFeature);
    } else {
        initializeCodeCopyFeature();
    }

    // Also start after a short delay to ensure React has rendered
    setTimeout(initializeCodeCopyFeature, 1000);

    // Export for debugging
    window.CodeCopyEnhancement = {
        enhanceAllCodeElements,
        createCopyButton,
        copyToClipboard
    };

})();
