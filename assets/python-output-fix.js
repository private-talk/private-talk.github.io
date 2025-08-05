// Python Output Fix - Override the executePython function to show real output
(function() {
    'use strict';

    console.log('🐍 Loading Python output fix...');

    // Wait for the main code-copy.js to load, then override the executePython function
    function overridePythonExecution() {
        // Check if we're in the right context (where the modal functions exist)
        if (typeof window.openEditRunModal !== 'undefined' || document.querySelector('.edit-run-modal')) {
            return; // Already handled by the modal
        }

        // Override the global executePython function if it exists
        if (typeof window.executePython === 'function') {
            console.log('⚡ Overriding executePython function...');

            window.executePython = async function(code) {
                try {
                    // Wait for Pyodide to be ready
                    if (typeof pyodide === 'undefined' || !pyodide) {
                        let attempts = 0;
                        while ((typeof pyodide === 'undefined' || !pyodide) && attempts < 10) {
                            await new Promise(resolve => setTimeout(resolve, 500));
                            attempts++;
                        }

                        if (typeof pyodide === 'undefined' || !pyodide) {
                            return {
                                success: false,
                                output: 'Python execution not ready yet.\nPyodide is still loading...\n\nPlease wait a few seconds and try again.'
                            };
                        }
                    }

                    // Capture print output using a different approach
                    let capturedOutput = '';

                    // Method 1: Try to capture using sys.stdout redirection
                    try {
                        pyodide.runPython(`
                            import sys
                            from io import StringIO

                            # Store original stdout
                            original_stdout = sys.stdout

                            # Redirect stdout to capture prints
                            captured_stdout = StringIO()
                            sys.stdout = captured_stdout
                        `);

                        // Run the user code
                        const result = pyodide.runPython(code);

                        // Get the captured output
                        capturedOutput = pyodide.runPython(`
                            output = captured_stdout.getvalue()
                            sys.stdout = original_stdout
                            output
                        `);

                        // Format the final output
                        let finalOutput = '';
                        if (capturedOutput && capturedOutput.trim()) {
                            finalOutput += capturedOutput.trim();
                        }
                        if (result !== undefined && result !== null && result !== '') {
                            if (finalOutput) finalOutput += '\n';
                            finalOutput += `Return value: ${result}`;
                        }

                        return {
                            success: true,
                            output: finalOutput || 'Code executed (no output)'
                        };

                    } catch (error) {
                        // Restore stdout in case of error
                        try {
                            pyodide.runPython('sys.stdout = original_stdout');
                        } catch (e) {}

                        return {
                            success: false,
                            output: `Python Error: ${error.message}`
                        };
                    }

                } catch (error) {
                    return {
                        success: false,
                        output: `Python Error: ${error.message}`
                    };
                }
            };

            console.log('✅ Python output fix applied!');
        }
    }

    // Try to override immediately and also set up observers
    setTimeout(overridePythonExecution, 1000);
    setTimeout(overridePythonExecution, 3000);
    setTimeout(overridePythonExecution, 5000);

    // Also override when DOM changes (for dynamic content)
    const observer = new MutationObserver(() => {
        overridePythonExecution();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
