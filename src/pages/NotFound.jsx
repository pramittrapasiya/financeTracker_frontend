import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="not-found-container">
            <div className="not-found-content">
                <div className="not-found-icon">404</div>
                <h1>Page Not Found</h1>
                <p>Oops! The page you're looking for doesn't exist.</p>
                <p className="not-found-subtitle">
                    It might have been moved or deleted.
                </p>
                <Link to="/" className="btn-primary">
                    Go to Dashboard
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
