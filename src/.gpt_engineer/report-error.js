const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key, value) => {
    // Don't serialize DOM nodes, React fiber nodes, or Request objects
    if (value instanceof Node || 
        key.startsWith('__react') || 
        value instanceof Request) {
      return undefined;
    }
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return undefined;
      }
      seen.add(value);
    }
    return value;
  };
};

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

const reportHTTPError = (error, requestInfo) => {
  // Ensure requestInfo is serializable
  const safeRequestInfo = {
    url: requestInfo?.url || 'unknown',
    method: requestInfo?.method || 'unknown',
    timestamp: new Date().toISOString()
  };

  const errorData = {
    message: error?.message || String(error) || 'HTTP Error',
    error_type: 'http',
    timestamp: new Date().toISOString(),
    request: safeRequestInfo
  };
  
  postMessage(errorData);
};

// Wrap fetch to catch and report errors
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  try {
    const response = await originalFetch(...args);
    return response;
  } catch (error) {
    // Create a safe serializable version of the request info
    const requestInfo = args[0];
    let safeRequestInfo;
    
    try {
      safeRequestInfo = {
        url: typeof requestInfo === 'string' 
          ? requestInfo 
          : (requestInfo instanceof Request 
              ? requestInfo.url 
              : requestInfo?.url || 'unknown'),
        method: requestInfo instanceof Request 
          ? requestInfo.method 
          : (typeof requestInfo === 'object' 
              ? String(requestInfo?.method || 'GET')
              : 'GET'),
        timestamp: new Date().toISOString()
      };
    } catch (e) {
      safeRequestInfo = {
        url: 'URL not serializable',
        method: 'unknown',
        timestamp: new Date().toISOString()
      };
    }
    
    reportHTTPError(error, safeRequestInfo);
    throw error;
  }
};

// Handle runtime errors
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

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  const errorData = {
    message: event.reason?.message || 'Unhandled Promise Rejection',
    error_type: 'runtime',
    stack: event.reason?.stack,
    timestamp: new Date().toISOString()
  };
  
  postMessage(errorData);
});