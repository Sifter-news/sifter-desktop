const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key, value) => {
    // Handle Request objects specially
    if (value instanceof Request) {
      return {
        type: 'Request',
        url: value.url,
        method: value.method,
        headers: Array.from(value.headers.entries()),
        cache: value.cache,
        mode: value.mode,
        credentials: value.credentials,
        redirect: value.redirect,
        referrer: value.referrer,
        referrerPolicy: value.referrerPolicy,
      };
    }
    // Don't serialize DOM nodes or React fiber nodes
    if (value instanceof Node || key.startsWith('__react')) {
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

    // Use structured clone algorithm with custom replacer
    const cloneableMessage = JSON.parse(JSON.stringify(serializableMessage, getCircularReplacer()));
    window.parent.postMessage(cloneableMessage, '*');
  } catch (e) {
    console.warn('Failed to post error message:', e);
    // Fallback message that's guaranteed to be cloneable
    window.parent.postMessage({
      type: 'error',
      message: 'Error occurred (details not serializable)',
      error_type: 'runtime',
      timestamp: new Date().toISOString()
    }, '*');
  }
};

const reportHTTPError = (error, requestInfo) => {
  let safeRequestInfo;
  
  try {
    if (requestInfo instanceof Request) {
      safeRequestInfo = {
        type: 'Request',
        url: requestInfo.url,
        method: requestInfo.method,
        headers: Array.from(requestInfo.headers.entries()),
        cache: requestInfo.cache,
        mode: requestInfo.mode,
        credentials: requestInfo.credentials,
        redirect: requestInfo.redirect,
        referrer: requestInfo.referrer,
        referrerPolicy: requestInfo.referrerPolicy,
      };
    } else {
      safeRequestInfo = {
        url: typeof requestInfo === 'string' ? requestInfo : requestInfo?.url || 'unknown',
        method: requestInfo?.method || 'GET',
        timestamp: new Date().toISOString()
      };
    }
  } catch (e) {
    safeRequestInfo = {
      url: 'URL not serializable',
      method: 'unknown',
      timestamp: new Date().toISOString()
    };
  }

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
    reportHTTPError(error, args[0]);
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