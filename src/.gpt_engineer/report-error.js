const postMessage = (message) => {
  try {
    // Create a simplified version of the message that's guaranteed to be cloneable
    const serializableMessage = {
      type: message.type || 'error',
      message: message.message || String(message),
      error_type: message.error_type || 'runtime',
      timestamp: new Date().toISOString(),
      // Only include stack if it exists and is a string
      ...(message.stack && typeof message.stack === 'string' && { stack: message.stack }),
      // For HTTP errors, include simplified request info
      ...(message.url && { url: String(message.url) }),
      ...(message.method && { method: String(message.method) })
    };

    window.parent.postMessage(serializableMessage, '*');
  } catch (e) {
    // Fallback with minimal error info if serialization fails
    console.warn('Failed to post error message:', e);
    window.parent.postMessage({
      type: 'error',
      message: 'Error occurred (details not serializable)',
      error_type: 'runtime',
      timestamp: new Date().toISOString()
    }, '*');
  }
};

const originalFetch = window.fetch;

window.fetch = async (...args) => {
  try {
    const response = await originalFetch(...args);
    return response;
  } catch (error) {
    reportHTTPError(error, args[0]);
    throw error;
  }
};

const reportHTTPError = (error, request) => {
  try {
    // Create a simplified version of the request info that's guaranteed to be cloneable
    const errorData = {
      message: error.message || String(error),
      error_type: 'runtime',
      stack: error.stack,
      // Only include basic request info that can be serialized
      url: typeof request === 'string' ? request : String(request.url),
      method: typeof request === 'string' ? 'GET' : String(request.method),
      timestamp: new Date().toISOString()
    };
    
    postMessage(errorData);
  } catch (e) {
    console.warn('Error in error reporting:', e);
    postMessage({
      message: 'Error occurred (details not serializable)',
      error_type: 'runtime',
      timestamp: new Date().toISOString()
    });
  }
};

window.addEventListener('error', (event) => {
  const errorData = {
    message: event.message || 'Unknown error',
    error_type: 'runtime',
    stack: event.error?.stack,
    source: event.filename,
    line: event.lineno,
    column: event.colno,
    timestamp: new Date().toISOString()
  };
  
  postMessage(errorData);
});

window.addEventListener('unhandledrejection', (event) => {
  const errorData = {
    message: event.reason?.message || 'Unhandled Promise Rejection',
    error_type: 'runtime',
    stack: event.reason?.stack,
    timestamp: new Date().toISOString()
  };
  
  postMessage(errorData);
});