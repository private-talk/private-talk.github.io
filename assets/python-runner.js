// Python Code Runner for Qwen3 WebGPU
(function() {
    'use strict';

    console.log('🐍 Initializing Python code runner...');

    // CSS for Python runner styling
    const pythonRunnerStyles = `
        .run-code-button {
            position: absolute !important;
            top: 8px !important;
            right: 90px !important;
            background: rgba(34, 197, 94, 0.9) !important;
            backdrop-filter: blur(10px) !important;
            -webkit-backdrop-filter: blur(10px) !important;
            border: 1px solid rgba(34, 197, 94, 0.4) !important;
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
            box-shadow: 0 4px 12px rgba(34, 197, 94, 0.2) !important;
            display: flex !important;
            align-items: center !important;
            gap: 4px !important;
            min-width: 70px !important;
            justify-content: center !important;
            white-space: nowrap !important;
        }

        .run-code-button:hover {
            background: rgba(34, 197, 94, 1) !important;
            transform: translateY(-1px) !important;
            box-shadow: 0 6px 20px rgba(34, 197, 94, 0.3) !important;
        }

        .edit-code-button {
            position: absolute !important;
            top: 8px !important;
            right: 170px !important;
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
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2) !important;
            display: flex !important;
            align-items: center !important;
            gap: 4px !important;
            min-width: 70px !important;
            justify-content: center !important;
            white-space: nowrap !important;
        }

        .edit-code-button:hover {
            background: rgba(59, 130, 246, 1) !important;
            transform: translateY(-1px) !important;
            box-shadow: 0 6px 20px rgba(59, 130, 246, 0.3) !important;
        }

        .python-editor-modal {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background: rgba(0, 0, 0, 0.7) !important;
            backdrop-filter: blur(5px) !important;
            z-index: 10000 !important;
            display: none !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 20px !important;
            box-sizing: border-box !important;
        }

        .python-editor-container {
            background: #1e1e1e !important;
            border-radius: 12px !important;
            width: 90% !important;
            max-width: 1000px !important;
            height: 80% !important;
            display: flex !important;
            flex-direction: column !important;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3) !important;
            border: 1px solid #333 !important;
        }

        .python-editor-header {
            background: linear-gradient(135deg, #2563eb, #3b82f6) !important;
            color: white !important;
            padding: 15px 20px !important;
            border-radius: 12px 12px 0 0 !important;
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            font-family: 'Inter', sans-serif !important;
            font-weight: 600 !important;
        }

        .python-editor-body {
            flex: 1 !important;
            display: flex !important;
            flex-direction: column !important;
        }

        .python-code-area {
            flex: 1 !important;
            position: relative !important;
        }

        .python-output-area {
            height: 200px !important;
            background: #0d1117 !important;
            border-top: 1px solid #333 !important;
            padding: 15px !important;
            color: #e6edf3 !important;
            font-family: 'Courier New', monospace !important;
            font-size: 14px !important;
            overflow-y: auto !important;
            white-space: pre-wrap !important;
        }

        .python-toolbar {
            background: #2d2d2d !important;
            padding: 10px 20px !important;
            border-top: 1px solid #333 !important;
            display: flex !important;
            gap: 10px !important;
            border-radius: 0 0 12px 12px !important;
        }

        .python-toolbar button {
            background: rgba(34, 197, 94, 0.9) !important;
            border: none !important;
            border-radius: 6px !important;
            padding: 8px 16px !important;
            color: white !important;
            font-family: 'Inter', sans-serif !important;
            font-size: 13px !important;
            font-weight: 600 !important;
            cursor: pointer !important;
            transition: all 0.2s ease !important;
        }

        .python-toolbar button:hover {
            background: rgba(34, 197, 94, 1) !important;
            transform: translateY(-1px) !important;
        }

        .python-toolbar button.clear-btn {
            background: rgba(239, 68, 68, 0.9) !important;
        }

        .python-toolbar button.clear-btn:hover {
            background: rgba(239, 68, 68, 1) !important;
        }

        .python-toolbar button.close-btn {
            background: rgba(107, 114, 128, 0.9) !important;
        }

        .python-toolbar button.close-btn:hover {
            background: rgba(107, 114, 128, 1) !important;
        }

        .CodeMirror {
            height: 100% !important;
            font-size: 14px !important;
            font-family: 'Courier New', monospace !important;
        }

        .CodeMirror-gutters {
            background: #2d2d2d !important;
            border-right: 1px solid #444 !important;
        }

        .CodeMirror-linenumber {
            color: #666 !important;
        }

        .loading-spinner {
            display: inline-block !important;
            width: 16px !important;
            height: 16px !important;
            border: 2px solid rgba(255, 255, 255, 0.3) !important;
            border-radius: 50% !important;
            border-top-color: white !important;
            animation: spin 1s ease-in-out infinite !important;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        /* Hide test button and only show buttons on code blocks */
        .python-test-button {
            display: none !important;
        }
    `;

    // Inject styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = pythonRunnerStyles;
    document.head.appendChild(styleSheet);

    // Load required libraries
    let pyodideReady = false;
    let codeMirrorReady = false;
    let pyodide = null;

    // Load CodeMirror
    function loadCodeMirror() {
        return new Promise((resolve) => {
            if (window.CodeMirror) {
                codeMirrorReady = true;
                resolve();
                return;
            }

            // Load CSS
            const cssLink = document.createElement('link');
            cssLink.rel = 'stylesheet';
            cssLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/codemirror.min.css';
            document.head.appendChild(cssLink);

            const themeLink = document.createElement('link');
            themeLink.rel = 'stylesheet';
            themeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/theme/monokai.min.css';
            document.head.appendChild(themeLink);

            // Load JS
            const scripts = [
                'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/codemirror.min.js',
                'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/mode/python/python.min.js'
            ];

            let loadedScripts = 0;
            scripts.forEach(src => {
                const script = document.createElement('script');
                script.src = src;
                script.onload = () => {
                    loadedScripts++;
                    if (loadedScripts === scripts.length) {
                        codeMirrorReady = true;
                        resolve();
                    }
                };
                document.head.appendChild(script);
            });
        });
    }

    // Load Pyodide
    function loadPyodide() {
        return new Promise((resolve) => {
            if (window.pyodide) {
                pyodideReady = true;
                pyodide = window.pyodide;
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
            script.onload = async () => {
                try {
                    pyodide = await window.loadPyodide();
                    await pyodide.loadPackage("micropip");
                    pyodideReady = true;
                    console.log('🐍 Pyodide loaded successfully');
                    resolve();
                } catch (error) {
                    console.error('Failed to load Pyodide:', error);
                }
            };
            document.head.appendChild(script);
        });
    }

    // Initialize libraries
    Promise.all([loadCodeMirror(), loadPyodide()]).then(() => {
        console.log('🚀 Python runner ready!');
        initializePythonRunner();
    });

    // Modal HTML
    const modalHTML = `
        <div class="python-editor-modal" id="pythonEditorModal">
            <div class="python-editor-container">
                <div class="python-editor-header">
                    <span>🐍 Python Code Editor & Runner</span>
                    <button class="close-btn" onclick="closePythonEditor()">✕</button>
                </div>
                <div class="python-editor-body">
                    <div class="python-code-area">
                        <textarea id="pythonCodeEditor"></textarea>
                    </div>
                    <div class="python-output-area" id="pythonOutput">
                        הפלט יופיע כאן...
                    </div>
                </div>
                <div class="python-toolbar">
                    <button onclick="runPythonCode()">▶️ הפעל קוד</button>
                    <button onclick="clearPythonOutput()" class="clear-btn">🗑️ נקה פלט</button>
                    <button onclick="closePythonEditor()" class="close-btn">✕ סגור</button>
                </div>
            </div>
        </div>
    `;

    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    let currentEditor = null;

    // Global functions
    window.openPythonEditor = function(code = '') {
        const modal = document.getElementById('pythonEditorModal');
        modal.style.display = 'flex';

        if (!currentEditor) {
            currentEditor = CodeMirror.fromTextArea(document.getElementById('pythonCodeEditor'), {
                mode: 'python',
                theme: 'monokai',
                lineNumbers: true,
                indentUnit: 4,
                tabSize: 4,
                matchBrackets: true,
                autoCloseBrackets: true,
                lineWrapping: true
            });
        }

        if (code) {
            currentEditor.setValue(code);
        }

        setTimeout(() => currentEditor.refresh(), 100);
    };

    window.closePythonEditor = function() {
        const modal = document.getElementById('pythonEditorModal');
        modal.style.display = 'none';
    };

    window.runPythonCode = async function() {
        if (!pyodideReady || !currentEditor) return;

        const code = currentEditor.getValue();
        const outputElement = document.getElementById('pythonOutput');

        outputElement.innerHTML = '<div class="loading-spinner"></div> מריץ קוד...';

        try {
            // Setup output capture
            pyodide.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
sys.stderr = sys.stdout
            `);

            // Run user code
            await pyodide.runPythonAsync(code);

            // Get output
            const output = pyodide.runPython("sys.stdout.getvalue()");
            outputElement.textContent = output || 'הקוד הסתיים בהצלחה ללא פלט.';

        } catch (error) {
            outputElement.textContent = `שגיאה:\n${error.message}`;
            outputElement.style.color = '#ff6b6b';
        }
    };

    window.clearPythonOutput = function() {
        const outputElement = document.getElementById('pythonOutput');
        outputElement.textContent = 'הפלט יופיע כאן...';
        outputElement.style.color = '#e6edf3';
    };

    // Initialize Python runner
    function initializePythonRunner() {
        console.log('🔍 Searching for Python code blocks...');

        // First, let's see what code blocks actually exist in the DOM
        const allPres = document.querySelectorAll('pre');
        const allCodes = document.querySelectorAll('code');
        console.log(`📊 Found ${allPres.length} <pre> elements and ${allCodes.length} <code> elements`);

        // Log some details about existing elements
        allPres.forEach((pre, index) => {
            const code = pre.querySelector('code');
            if (code) {
                console.log(`Pre ${index}: classes="${pre.className}", code classes="${code.className}", text="${code.textContent.substring(0, 50)}..."`);
            }
        });

        // Try multiple strategies to find Python code blocks
        let foundBlocks = [];

        // Strategy 1: Look for elements with Python-related classes
        const classBasedBlocks = document.querySelectorAll(`
            pre code.language-python,
            pre code.lang-python,
            code.language-python,
            code.lang-python,
            pre code[class*="python"],
            code[class*="python"],
            pre[class*="python"],
            .language-python,
            .lang-python,
            [data-language="python"]
        `);
        foundBlocks = [...foundBlocks, ...classBasedBlocks];
        console.log(`📊 Strategy 1 (class-based): Found ${classBasedBlocks.length} blocks`);

        // Strategy 2: Look for code blocks containing Python keywords
        document.querySelectorAll('pre code, code').forEach((block) => {
            const text = block.textContent || '';
            const trimmedText = text.trim();

            // Check if it looks like Python code
            const isPython = (
                trimmedText.includes('print(') ||
                trimmedText.includes('def ') ||
                trimmedText.includes('import ') ||
                trimmedText.includes('from ') ||
                trimmedText.includes('if __name__') ||
                /^\s*(class|def|import|from|print|for|while|if|try|except|with)\s/.test(trimmedText) ||
                /\n\s*(def|class|import|from|print)\s/.test(trimmedText)
            );

            if (isPython && !foundBlocks.includes(block)) {
                foundBlocks.push(block);
                console.log(`🐍 Strategy 2 (content-based): Found Python code: "${trimmedText.substring(0, 50)}..."`);
            }
        });

        // Strategy 3: Look for any pre element that might contain code
        document.querySelectorAll('pre').forEach((pre) => {
            if (!pre.querySelector('.run-code-button') && !pre.querySelector('.edit-code-button')) {
                const text = pre.textContent || '';
                if (text.trim().length > 10) { // Has some content
                    console.log(`📝 Found potential code block: "${text.substring(0, 50)}..."`);
                    // Add buttons to any code block for testing
                    addButtonsToCodeBlock(pre.querySelector('code') || pre);
                }
            }
        });

        console.log(`📊 Total Python blocks found: ${foundBlocks.length}`);

        // Add buttons to all found Python blocks
        foundBlocks.forEach((block, index) => {
            console.log(`🐍 Processing Python code block ${index}`);
            addButtonsToCodeBlock(block);
        });

        // Watch for new code blocks (for dynamic content)
        const observer = new MutationObserver((mutations) => {
            let hasNewNodes = false;
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Element node
                        const newPres = node.querySelectorAll ? node.querySelectorAll('pre') : [];
                        const newCodes = node.querySelectorAll ? node.querySelectorAll('code') : [];
                        if (newPres.length > 0 || newCodes.length > 0 || node.tagName === 'PRE' || node.tagName === 'CODE') {
                            hasNewNodes = true;
                            console.log('🔄 New code elements detected');
                        }
                    }
                });
            });

            if (hasNewNodes) {
                console.log('🔄 DOM changed, re-scanning for code blocks...');
                setTimeout(initializePythonRunner, 100);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function addButtonsToCodeBlock(block) {
        const pre = block.closest('pre') || block.parentElement;

        if (!pre) {
            console.log('❌ No parent element found for code block');
            return;
        }

        // Check if buttons already added
        if (pre.querySelector('.run-code-button') || pre.querySelector('.edit-code-button')) {
            console.log('✅ Buttons already exist for this block');
            return;
        }

        console.log('➕ Adding buttons to code block');

        // Ensure the parent has relative positioning
        if (getComputedStyle(pre).position === 'static') {
            pre.style.position = 'relative';
        }

        // Add run button
        const runButton = document.createElement('button');
        runButton.className = 'run-code-button';
        runButton.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('🚀 Run button clicked');
            window.openPythonEditor(block.textContent);
        };

        // Add edit button
        const editButton = document.createElement('button');
        editButton.className = 'edit-code-button';
        editButton.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('✏️ Edit button clicked');
            window.openPythonEditor(block.textContent);
        };

        pre.appendChild(runButton);
        pre.appendChild(editButton);

        console.log('✅ Buttons added successfully');
    }

    // Close modal when clicking outside
    document.addEventListener('click', (e) => {
        const modal = document.getElementById('pythonEditorModal');
        if (e.target === modal) {
            window.closePythonEditor();
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            if (document.getElementById('pythonEditorModal').style.display === 'flex') {
                window.runPythonCode();
            }
        }
        if (e.key === 'Escape') {
            window.closePythonEditor();
        }
    });

    console.log('🎉 Python code runner initialized successfully!');

    // Try to run immediately and also after a delay for React content
    setTimeout(() => {
        console.log('🔄 Running delayed initialization...');
        initializePythonRunner();
    }, 1000);

    // Also try after React might have loaded
    setTimeout(() => {
        console.log('🔄 Running React-ready initialization...');
        initializePythonRunner();
    }, 3000);
})();
