export const executePython = async (code: string): Promise<string> => {
  try {
    const response = await fetch('http://127.0.0.1:5000/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.success) {
      return data.output + "\nResult: " + JSON.stringify(data.result);
    } else {
      return data.error;
    }
  } catch (error: any) {
    console.error('error:', error);
    return error.message;
  }
};
