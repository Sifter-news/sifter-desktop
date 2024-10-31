import { toast } from 'sonner';

// Error boundary wrapper for components
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log to debug panel
    if (window.__DEBUG_PANEL__) {
      window.__DEBUG_PANEL__.addError({
        type: 'react',
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack
      });
    }
    
    toast.error(`Error: ${error.message}`);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 border border-red-500 rounded bg-red-50">
          <h2 className="text-red-700">Something went wrong</h2>
          <pre className="mt-2 text-sm text-red-600">{this.state.error?.message}</pre>
        </div>
      );
    }

    return this.props.children;
  }
}

// Test utility to simulate errors
export const testComponentError = (component, errorType) => {
  switch (errorType) {
    case 'render':
      throw new Error('Test render error');
    case 'async':
      return Promise.reject(new Error('Test async error'));
    case 'event':
      throw new Error('Test event handler error');
    default:
      throw new Error('Unknown test error type');
  }
};