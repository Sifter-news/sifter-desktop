const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key, value) => {
    if (value instanceof Request) {
      return {
        url: value.url,
        method: value.method,
        credentials: value.credentials,
        mode: value.mode,
        type: 'Request'
      };
    }
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
    const serializableMessage = JSON.parse(JSON.stringify(message, getCircularReplacer()));
    window.parent.postMessage(serializableMessage, '*');
  } catch (e) {
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
  let safeRequestInfo;
  
  try {
    if (requestInfo instanceof Request) {
      safeRequestInfo = {
        url: requestInfo.url,
        method: requestInfo.method,
        credentials: requestInfo.credentials,
        mode: requestInfo.mode,
        type: 'Request'
      };
    } else {
      safeRequestInfo = {
        url: typeof requestInfo === 'string' ? requestInfo : requestInfo?.url || 'unknown',
        method: typeof requestInfo === 'object' ? requestInfo?.method || 'GET' : 'GET',
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