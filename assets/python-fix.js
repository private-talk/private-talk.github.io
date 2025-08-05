    async function executePython(code) {
        try {
            // Wait for Pyodide to be ready
            if (typeof pyodide === 'undefined' || !pyodide) {
                // Wait a bit more for Pyodide to load
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

            // Capture stdout for print statements
            pyodide.runPython(`
                import sys
                from io import StringIO

                # Redirect stdout to capture print statements
                old_stdout = sys.stdout
                sys.stdout = StringIO()
            `);

            // Run the user code
            let result;
            try {
                result = pyodide.runPython(code);
            } catch (pythonError) {
                // Get any captured output before the error
                const capturedOutput = pyodide.runPython('sys.stdout.getvalue()');
                pyodide.runPython('sys.stdout = old_stdout');

                return {
                    success: false,
                    output: `${capturedOutput ? capturedOutput + '\n' : ''}Python Error: ${pythonError.message}`
                };
            }

            // Get captured output (print statements)
            const capturedOutput = pyodide.runPython('sys.stdout.getvalue()');
            pyodide.runPython('sys.stdout = old_stdout');

            // Format final output
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
                output: finalOutput || 'Code executed successfully (no output)'
            };

        } catch (error) {
            return { success: false, output: `Python Error: ${error.message}` };
        }
    }
