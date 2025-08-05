// Edit/Run Button Extension for Qwen3 WebGPU Demo
(function() {
    'use strict';

    // Configuration
    const config = {
        buttonClass: 'edit-run-btn',
        debounceDelay: 300
    };

    // Utility functions
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function getCodeContent(element) {
        // Try to get the actual code content from various possible structures
        const codeElement = element.tagName === 'CODE' ? element : element.querySelector('code');
        if (codeElement) {
            return codeElement.textContent || codeElement.innerText;
        }
        return element.textContent || element.innerText;
    }

    function detectLanguage(code) {
        const pythonKeywords = ['def ', 'import ', 'from ', 'print(', 'if __name__'];
        const jsKeywords = ['function ', 'const ', 'let ', 'var ', '=>', 'console.log'];
        const htmlKeywords = ['<html', '<div', '<span', '<!DOCTYPE'];

        const lowerCode = code.toLowerCase();

        if (pythonKeywords.some(keyword => lowerCode.includes(keyword))) {
            return 'python';
        }
        if (jsKeywords.some(keyword => lowerCode.includes(keyword))) {
            return 'javascript';
        }
        if (htmlKeywords.some(keyword => lowerCode.includes(keyword))) {
            return 'html';
        }

        return 'text';
    }

    // Code execution functions
    async function executeCode(code, language) {
        switch (language) {
            case 'python':
                return await executePython(code);
            case 'javascript':
                return executeJavaScript(code);
            case 'html':
                return executeHTML(code);
            default:
                return { success: false, output: 'Language not supported for execution' };
        }
    }

    async function executePython(code) {
        try {
            // If Pyodide is available globally
            if (typeof pyodide !== 'undefined') {
                const result = pyodide.runPython(code);
                return { success: true, output: result?.toString() || 'Code executed successfully' };
            }

            // Fallback: try to use a web service (you'd need to implement this)
            const response = await fetch('/api/execute-python', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code })
            });

            if (response.ok) {
                const result = await response.json();
                return { success: true, output: result.output };
            } else {
                return { success: false, output: 'Python execution service unavailable' };
            }
        } catch (error) {
            return { success: false, output: `Error: ${error.message}` };
        }
    }

    function executeJavaScript(code) {
        try {
            // Create a safe execution context
            const originalConsoleLog = console.log;
            let output = '';

            console.log = (...args) => {
                output += args.join(' ') + '\n';
            };

            const result = eval(code);
            console.log = originalConsoleLog;

            return {
                success: true,
                output: output + (result !== undefined ? `Result: ${result}` : '')
            };
        } catch (error) {
            return { success: false, output: `Error: ${error.message}` };
        }
    }

    function executeHTML(code) {
        try {
            // Create a new window/tab with the HTML content
            const newWindow = window.open('', '_blank');
            newWindow.document.write(code);
            newWindow.document.close();
            return { success: true, output: 'HTML opened in new tab' };
        } catch (error) {
            return { success: false, output: `Error: ${error.message}` };
        }
    }

    // UI Functions
    function createModal() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.style.display = 'none';

        modal.innerHTML = `
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Edit & Run Code</h3>
                    <button class="close-modal text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <div class="flex gap-4 mb-4">
                    <select class="language-select px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                        <option value="python">Python</option>
                        <option value="javascript">JavaScript</option>
                        <option value="html">HTML</option>
                        <option value="text">Text</option>
                    </select>
                    <button class="run-code px-4 py-1 bg-green-500 hover:bg-green-600 text-white rounded transition-colors">
                        Run Code
                    </button>
                    <button class="copy-code px-4 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors">
                        Copy
                    </button>
                </div>

                <div class="flex-1 flex gap-4 min-h-0">
                    <div class="flex-1 flex flex-col">
                        <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Code Editor</label>
                        <textarea class="code-editor flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded font-mono text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white resize-none"
                                  placeholder="Enter your code here..."></textarea>
                    </div>
                    <div class="flex-1 flex flex-col">
                        <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Output</label>
                        <div class="output-area flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-900 font-mono text-sm overflow-auto whitespace-pre-wrap text-gray-900 dark:text-white"></div>
                    </div>
                </div>
            </div>
        `;

        return modal;
    }

    function showEditRunModal(code, language = 'text') {
        let modal = document.querySelector('.edit-run-modal');
        if (!modal) {
            modal = createModal();
            modal.className += ' edit-run-modal';
            document.body.appendChild(modal);

            // Event listeners
            modal.querySelector('.close-modal').addEventListener('click', () => {
                modal.style.display = 'none';
            });

            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });

            const runButton = modal.querySelector('.run-code');
            const copyButton = modal.querySelector('.copy-code');
            const codeEditor = modal.querySelector('.code-editor');
            const languageSelect = modal.querySelector('.language-select');
            const outputArea = modal.querySelector('.output-area');

            runButton.addEventListener('click', async () => {
                const code = codeEditor.value;
                const selectedLang = languageSelect.value;

                if (!code.trim()) {
                    outputArea.textContent = 'Please enter some code to run.';
                    return;
                }

                outputArea.textContent = 'Running...';
                runButton.disabled = true;

                try {
                    const result = await executeCode(code, selectedLang);
                    outputArea.textContent = result.output;
                    outputArea.className = outputArea.className.replace(/text-(red|green)-\d+/, '') +
                                         (result.success ? ' text-green-600 dark:text-green-400' : ' text-red-600 dark:text-red-400');
                } catch (error) {
                    outputArea.textContent = `Error: ${error.message}`;
                    outputArea.className = outputArea.className.replace(/text-(red|green)-\d+/, '') + ' text-red-600 dark:text-red-400';
                } finally {
                    runButton.disabled = false;
                }
            });

            copyButton.addEventListener('click', () => {
                const code = codeEditor.value;
                navigator.clipboard.writeText(code).then(() => {
                    const originalText = copyButton.textContent;
                    copyButton.textContent = 'Copied!';
                    setTimeout(() => {
                        copyButton.textContent = originalText;
                    }, 2000);
                });
            });
        }

        // Set the code and language
        const codeEditor = modal.querySelector('.code-editor');
        const languageSelect = modal.querySelector('.language-select');
        const outputArea = modal.querySelector('.output-area');

        codeEditor.value = code;
        languageSelect.value = language;
        outputArea.textContent = 'Ready to run code...';
        outputArea.className = outputArea.className.replace(/text-(red|green)-\d+/, '');

        modal.style.display = 'flex';
    }

    // Main function to add edit/run buttons
    function addEditRunButtons() {
        // Look for all buttons that might be copy buttons
        const allButtons = document.querySelectorAll('button');

        allButtons.forEach(button => {
            // Skip if this is already our edit/run button
            if (button.classList.contains(config.buttonClass)) {
                return;
            }

            // Check if this looks like a copy button
            const isCopyButton =
                button.title?.toLowerCase().includes('copy') ||
                button.textContent?.toLowerCase().includes('copy') ||
                button.getAttribute('aria-label')?.toLowerCase().includes('copy') ||
                (button.querySelector('svg') && button.closest('pre, code, .bg-gray-800, .bg-gray-900'));

            if (!isCopyButton) return;

            // Find the code container
            const codeContainer = button.closest('pre') ||
                                button.closest('code') ||
                                button.closest('.bg-gray-800') ||
                                button.closest('.bg-gray-900') ||
                                button.parentElement?.querySelector('pre, code');

            if (!codeContainer) return;

            // Check if edit/run button already exists in this container
            if (codeContainer.querySelector(`.${config.buttonClass}`) ||
                button.parentElement?.querySelector(`.${config.buttonClass}`)) {
                return;
            }

            // Get code content
            const code = getCodeContent(codeContainer);
            if (!code || code.length < 5) return;

            const language = detectLanguage(code);
            const editRunButton = createEditRunButton(button);

            editRunButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                showEditRunModal(code, language);
            });

            // Position the button exactly next to the copy button
            if (button.parentElement) {
                // Insert right after the copy button
                button.parentElement.insertBefore(editRunButton, button.nextSibling);
            } else {
                // Fallback: add to the same container as the copy button
                button.parentNode.appendChild(editRunButton);
            }
        });
    }

    // Initialize
    function init() {
        // Add initial buttons
        addEditRunButtons();

        // Watch for new content (for dynamic loading)
        const observer = new MutationObserver(debounce(() => {
            addEditRunButtons();
        }, config.debounceDelay));

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Also check periodically for new content
        setInterval(addEditRunButtons, 1500);
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // Add a small delay to let React render
        setTimeout(init, 1000);
    }

    // Expose to global scope for debugging
    window.editRunExtension = {
        addButtons: addEditRunButtons,
        showModal: showEditRunModal,
        config: config
    };

})();
