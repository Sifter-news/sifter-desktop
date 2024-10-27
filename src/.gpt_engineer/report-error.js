const postMessage = (message) => {
  try {
    // Create a simplified version of the message that's guaranteed to be cloneable
    const serializableMessage = {
      type: message.type || 'error',
      message: typeof message === 'string' ? message : message.message || 'Unknown error',
      error_type: message.error_type || 'runtime',
      timestamp: new Date().toISOString(),
      // Only include stack if it exists and is a string
      ...(message.stack && typeof message.stack === 'string' && { stack: message.stack })
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
    // Create a safe serializable version of the request info
    const requestInfo = args[0];
    const safeRequestInfo = {
      url: typeof requestInfo === 'string' ? requestInfo : String(requestInfo?.url || ''),
      method: typeof requestInfo === 'string' ? 'GET' : String(requestInfo?.method || 'GET'),
      timestamp: new Date().toISOString()
    };
    
    reportHTTPError(error, safeRequestInfo);
    throw error;
  }
};

const reportHTTPError = (error, requestInfo) => {
  const errorData = {
    message: error?.message || String(error) || 'HTTP Error',
    error_type: 'http',
    timestamp: new Date().toISOString(),
    request: requestInfo
  };
  
  postMessage(errorData);
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