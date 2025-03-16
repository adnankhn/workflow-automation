from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import io
import traceback
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/execute', methods=['POST'])
def execute_code():
    data = request.json
    code = data.get('code', '')
    inputs = data.get('inputs', {})
    
    # Create a dictionary for the local execution context
    globals_dict = {}
    locals_dict = {'inputs': inputs}
    
    # Capture stdout and stderr
    old_stdout = sys.stdout
    old_stderr = sys.stderr
    stdout_capture = io.StringIO()
    stderr_capture = io.StringIO()
    sys.stdout = stdout_capture
    sys.stderr = stderr_capture
    
    success = True
    error_message = ''
    
    try:
        # Execute the code
        exec(code, globals_dict, locals_dict)
        
        # Look for a result variable in the locals
        result = None
        if 'result' in locals_dict:
            result = locals_dict['result']
        
    except Exception as e:
        success = False
        error_message = f"Error: {str(e)}\n{traceback.format_exc()}"
    finally:
        # Restore stdout and stderr
        sys.stdout = old_stdout
        sys.stderr = old_stderr
    
    # Get the captured output
    output = stdout_capture.getvalue()
    error = stderr_capture.getvalue() + error_message
    
    return jsonify({
        'output': output,
        'error': error,
        'success': success,
        'result': result
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
