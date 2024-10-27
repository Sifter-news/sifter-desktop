const postMessage = (message) => {
  try {
    // Convert any non-cloneable parts of the message to strings
    const cloneableMessage = JSON.parse(JSON.stringify(message));
    window.parent.postMessage(cloneableMessage, '*');
  } catch (e) {
    console.warn('Failed to post message:', e);
    // Fallback: send a simplified error message
    window.parent.postMessage({
      type: 'error',
      error: message.toString(),
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
    const errorData = {
      message: error.message,
      error_type: 'runtime',
      stack: error.stack,
      url: typeof request === 'string' ? request : request.url,
      method: typeof request === 'string' ? 'GET' : request.method,
      // Don't include the full request object as it may not be cloneable
      timestamp: new Date().toISOString()
    };
    
    postMessage(errorData);
  } catch (e) {
    console.warn('Error in error reporting:', e);
  }
};

window.addEventListener('error', (event) => {
  const errorData = {
    message: event.message,
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