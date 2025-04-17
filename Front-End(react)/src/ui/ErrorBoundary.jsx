import React, { useState } from "react";

function ErrorBoundary({ children }) {
    const [hasError, setHasError] = useState(false);
    const [error, setError] = useState(null);

    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            <ErrorCatcher setHasError={setHasError} setError={setError}>
                {hasError ? (
                    <div>
                        <h2>Something went wrong.</h2>
                        <pre>{error?.message}</pre>
                    </div>
                ) : (
                    children
                )}
            </ErrorCatcher>
        </React.Suspense>
    );
}

class ErrorCatcher extends React.Component {
    componentDidCatch(error, errorInfo) {
        this.props.setHasError(true);
        this.props.setError(error);
        console.error("Error caught by ErrorBoundary:", error, errorInfo);
    }

    render() {
        return this.props.children;
    }
}

export default ErrorBoundary;
