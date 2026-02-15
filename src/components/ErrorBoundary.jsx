import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // Log error to console
        console.error('Error caught by boundary:', error, errorInfo);
    }

    handleReset = () => {
        // Clear error state and redirect to home
        this.setState({ hasError: false, error: null });
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary-container">
                    <div className="error-boundary-content">
                        <div className="error-icon">⚠️</div>
                        <h1>Oops! Something went wrong</h1>
                        <p>We're sorry for the inconvenience. The application encountered an error.</p>
                        <div className="error-details">
                            <p className="error-message">
                                {this.state.error?.message || 'Unknown error occurred'}
                            </p>
                        </div>
                        <div className="error-actions">
                            <button onClick={this.handleReset} className="btn-primary">
                                Return to Dashboard
                            </button>
                            <button
                                onClick={() => window.location.reload()}
                                className="btn-secondary"
                            >
                                Reload Page
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
