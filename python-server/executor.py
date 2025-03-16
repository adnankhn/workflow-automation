import sys
import traceback

def execute_python_code(code: str) -> str:
    try:
        # Create a local namespace to execute the code
        local_namespace = {}
        exec(code, {}, local_namespace)
        return str(local_namespace)
    except Exception as e:
        # Capture and return the error message
        return f"Error: {str(e)}\n{traceback.format_exc()}"

if __name__ == "__main__":
    # Read code from command line arguments
    if len(sys.argv) > 1:
        code_to_execute = sys.argv[1]
        output = execute_python_code(code_to_execute)
        print(output)
    else:
        print("No code provided to execute.")