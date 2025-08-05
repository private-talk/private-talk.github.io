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

        .copy-button, .edit-run-button {
            position: absolute !important;
            top: 8px !important;
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

        .copy-button {
            right: 8px !important;
        }

        .edit-run-button {
            right: 88px !important;
            background: rgba(34, 197, 94, 0.9) !important;
            border-color: rgba(34, 197, 94, 0.4) !important;
        }

        .copy-button:hover, .edit-run-button:hover {
            transform: translateY(-1px) !important;
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4) !important;
        }

        .copy-button:hover {
            background: rgba(59, 130, 246, 1) !important;
        }

        .edit-run-button:hover {
            background: rgba(34, 197, 94, 1) !important;
            box-shadow: 0 4px 12px rgba(34, 197, 94, 0.4) !important;
        }

        .copy-button:active, .edit-run-button:active {
            transform: translateY(0) !important;
        }

        .copy-button.success {
            background: rgba(16, 185, 129, 0.9) !important;
            border-color: rgba(16, 185, 129, 0.4) !important;
        }

        .copy-button.success:hover {
            background: rgba(16, 185, 129, 1) !important;
        }

        .copy-icon, .edit-run-icon {
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

        html body div#root .edit-run-button {
            position: absolute !important;
            top: 8px !important;
            right: 88px !important;
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

    // Edit/Run icon SVG
    const editRunIconSVG = `
        <svg class="edit-run-icon" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM5.5 4.5a.5.5 0 0 0-1 0v5.793L2.146 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L5.5 10.293V4.5z"/>
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

    // Create edit/run button
    function createEditRunButton(codeElement, isInline = false) {
        const button = document.createElement('button');
        button.className = 'edit-run-button';
        button.innerHTML = editRunIconSVG + '<span>Edit / Run</span>';
        button.title = 'Edit and run code';

        // Force positioning
        button.style.position = 'absolute';
        button.style.top = '8px';
        button.style.right = '88px';
        button.style.zIndex = '1000';
        button.style.opacity = '1';

        button.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();

            // Get the code content
            const codeContent = codeElement.textContent || codeElement.innerText;

            // Call the edit/run functionality
            openEditRunModal(codeContent, codeElement);
        });

        return button;
    }

    // Function to open edit/run modal
    function openEditRunModal(codeContent, sourceElement) {
        // Check if modal already exists, if so remove it
        const existingModal = document.querySelector('.edit-run-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Create modal
        const modal = document.createElement('div');
        modal.className = 'edit-run-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            backdrop-filter: blur(5px);
        `;

        // Detect language
        const detectedLanguage = detectLanguage(codeContent);

        modal.innerHTML = `
            <div style="
                background: linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.95) 100%);
                border: 1px solid rgba(59, 130, 246, 0.3);
                border-radius: 12px;
                padding: 24px;
                max-width: 90vw;
                max-height: 90vh;
                width: 1000px;
                display: flex;
                flex-direction: column;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
            ">
                <div style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    color: #e2e8f0;
                ">
                    <h3 style="
                        margin: 0;
                        font-size: 18px;
                        font-weight: 600;
                        color: #93c5fd;
                    ">Edit & Run Code</h3>
                    <button class="close-modal" style="
                        background: transparent;
                        border: none;
                        color: #94a3b8;
                        cursor: pointer;
                        padding: 8px;
                        border-radius: 6px;
                        transition: all 0.2s ease;
                    " onmouseover="this.style.background='rgba(239, 68, 68, 0.2)'; this.style.color='#f87171';"
                       onmouseout="this.style.background='transparent'; this.style.color='#94a3b8';">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <div style="
                    display: flex;
                    gap: 12px;
                    margin-bottom: 20px;
                    align-items: center;
                ">
                    <select class="language-select" style="
                        background: rgba(15, 23, 42, 0.8);
                        border: 1px solid rgba(59, 130, 246, 0.3);
                        border-radius: 6px;
                        padding: 8px 12px;
                        color: #e2e8f0;
                        font-size: 14px;
                        cursor: pointer;
                    ">
                        <option value="python" ${detectedLanguage === 'python' ? 'selected' : ''}>Python</option>
                        <option value="javascript" ${detectedLanguage === 'javascript' ? 'selected' : ''}>JavaScript</option>
                        <option value="html" ${detectedLanguage === 'html' ? 'selected' : ''}>HTML</option>
                        <option value="text" ${detectedLanguage === 'text' ? 'selected' : ''}>Text</option>
                    </select>
                    <button class="run-code" style="
                        background: rgba(34, 197, 94, 0.9);
                        border: 1px solid rgba(34, 197, 94, 0.4);
                        border-radius: 6px;
                        padding: 8px 16px;
                        color: white;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.2s ease;
                    " onmouseover="this.style.background='rgba(34, 197, 94, 1)';"
                       onmouseout="this.style.background='rgba(34, 197, 94, 0.9)';">
                        ▶ Run
                    </button>
                    <button class="copy-code" style="
                        background: rgba(59, 130, 246, 0.9);
                        border: 1px solid rgba(59, 130, 246, 0.4);
                        border-radius: 6px;
                        padding: 8px 16px;
                        color: white;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.2s ease;
                    " onmouseover="this.style.background='rgba(59, 130, 246, 1)';"
                       onmouseout="this.style.background='rgba(59, 130, 246, 0.9)';">
                        📋 Copy
                    </button>
                </div>

                <div style="
                    display: flex;
                    gap: 20px;
                    flex: 1;
                    min-height: 400px;
                ">
                    <div style="
                        flex: 1;
                        display: flex;
                        flex-direction: column;
                    ">
                        <label style="
                            color: #94a3b8;
                            font-size: 14px;
                            font-weight: 600;
                            margin-bottom: 8px;
                        ">Code Editor</label>
                        <textarea class="code-editor" style="
                            flex: 1;
                            background: rgba(15, 23, 42, 0.8);
                            border: 1px solid rgba(59, 130, 246, 0.3);
                            border-radius: 8px;
                            padding: 16px;
                            color: #e2e8f0;
                            font-family: 'JetBrains Mono', 'Fira Code', Consolas, Monaco, 'Courier New', monospace;
                            font-size: 13px;
                            line-height: 1.5;
                            resize: none;
                            outline: none;
                        " placeholder="Enter your code here...">${codeContent}</textarea>
                    </div>
                    <div style="
                        flex: 1;
                        display: flex;
                        flex-direction: column;
                    ">
                        <label style="
                            color: #94a3b8;
                            font-size: 14px;
                            font-weight: 600;
                            margin-bottom: 8px;
                        ">Output</label>
                        <div class="output-area" style="
                            flex: 1;
                            background: rgba(15, 23, 42, 0.8);
                            border: 1px solid rgba(59, 130, 246, 0.3);
                            border-radius: 8px;
                            padding: 16px;
                            color: #e2e8f0;
                            font-family: 'JetBrains Mono', 'Fira Code', Consolas, Monaco, 'Courier New', monospace;
                            font-size: 13px;
                            line-height: 1.5;
                            overflow-y: auto;
                            white-space: pre-wrap;
                        ">Click 'Run' to execute the code...</div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Add event listeners
        const closeBtn = modal.querySelector('.close-modal');
        const runBtn = modal.querySelector('.run-code');
        const copyBtn = modal.querySelector('.copy-code');
        const codeEditor = modal.querySelector('.code-editor');
        const outputArea = modal.querySelector('.output-area');
        const languageSelect = modal.querySelector('.language-select');

        closeBtn.addEventListener('click', () => {
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        copyBtn.addEventListener('click', async () => {
            const code = codeEditor.value;
            const success = await copyToClipboard(code);
            copyBtn.textContent = success ? '✓ Copied!' : '✗ Failed';
            setTimeout(() => {
                copyBtn.innerHTML = '📋 Copy';
            }, 2000);
        });

        runBtn.addEventListener('click', async () => {
            const code = codeEditor.value;
            const language = languageSelect.value;

            runBtn.textContent = '⏳ Running...';
            runBtn.disabled = true;
            outputArea.textContent = 'Executing code...';

            try {
                const result = await executeCode(code, language);
                outputArea.textContent = result.output || 'Code executed successfully';
                outputArea.style.color = result.success ? '#10b981' : '#f87171';
            } catch (error) {
                outputArea.textContent = `Error: ${error.message}`;
                outputArea.style.color = '#f87171';
            }

            runBtn.innerHTML = '▶ Run';
            runBtn.disabled = false;
        });

        console.log('✅ Edit/Run modal opened');
    }

    // Language detection function
    function detectLanguage(code) {
        const pythonKeywords = ['def ', 'import ', 'from ', 'print(', 'if __name__', 'class '];
        const jsKeywords = ['function ', 'const ', 'let ', 'var ', '=>', 'console.log', 'document.'];
        const htmlKeywords = ['<html', '<div', '<span', '<!DOCTYPE', '<body', '<head'];

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

    // Code execution function
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
            // Check if Pyodide is available
            if (typeof pyodide !== 'undefined') {
                // Capture stdout for print statements
                pyodide.runPython(`
                    import sys
                    from io import StringIO
                    old_stdout = sys.stdout
                    sys.stdout = mystdout = StringIO()
                `);

                let result;
                try {
                    result = pyodide.runPython(code);
                } catch (pythonError) {
                    const capturedOutput = pyodide.runPython('mystdout.getvalue()');
                    pyodide.runPython('sys.stdout = old_stdout');
                    return {
                        success: false,
                        output: `${capturedOutput ? capturedOutput + '\n' : ''}Python Error: ${pythonError.message}`
                    };
                }

                const capturedOutput = pyodide.runPython('mystdout.getvalue()');
                pyodide.runPython('sys.stdout = old_stdout');

                let finalOutput = '';
                if (capturedOutput && capturedOutput.trim()) {
                    finalOutput += capturedOutput.trim();
                }
                if (result !== undefined && result !== null && result !== '') {
                    if (finalOutput) finalOutput += '\n';
                    finalOutput += `Return value: ${result}`;
                }

                return { success: true, output: finalOutput || 'Code executed (no output)' };
            } else {
                return {
                    success: false,
                    output: 'Python execution not available.\nPyodide is not loaded in this environment.\n\nTo enable Python execution, you would need to:\n1. Load Pyodide library\n2. Set up a Python execution service\n\nCode syntax appears to be: ' + (code.length > 100 ? code.substring(0, 100) + '...' : code)
                };
            }
        } catch (error) {
            return { success: false, output: `Python Error: ${error.message}` };
        }
    }

    function executeJavaScript(code) {
        try {
            // Create a safe execution context
            const originalConsoleLog = console.log;
            let output = '';

            // Override console.log to capture output
            console.log = (...args) => {
                output += args.map(arg =>
                    typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
                ).join(' ') + '\n';
            };

            let result;
            try {
                result = eval(code);
            } finally {
                console.log = originalConsoleLog; // Always restore console.log
            }

            let finalOutput = output;
            if (result !== undefined) {
                finalOutput += `\nReturn value: ${typeof result === 'object' ? JSON.stringify(result, null, 2) : result}`;
            }

            return {
                success: true,
                output: finalOutput || 'Code executed successfully (no output)'
            };
        } catch (error) {
            return { success: false, output: `JavaScript Error: ${error.message}` };
        }
    }

    function executeHTML(code) {
        try {
            // Create a new window with the HTML content
            const newWindow = window.open('', '_blank', 'width=800,height=600');
            if (newWindow) {
                newWindow.document.write(code);
                newWindow.document.close();
                return { success: true, output: 'HTML opened in new window' };
            } else {
                return { success: false, output: 'Failed to open new window. Please allow popups for this site.' };
            }
        } catch (error) {
            return { success: false, output: `HTML Error: ${error.message}` };
        }
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
        const editRunButton = createEditRunButton(element);
        container.appendChild(copyButton);
        container.appendChild(editRunButton);

        console.log('✅ Enhanced code element with copy and edit/run buttons');
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

        console.log('✅ Code copy and edit/run feature initialized');
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeCodeCopyFeature);
    } else {
        initializeCodeCopyFeature();
    }

    // Also initialize after a short delay to catch any late-loading content
    setTimeout(initializeCodeCopyFeature, 1000);

})();
