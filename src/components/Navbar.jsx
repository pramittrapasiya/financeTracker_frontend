import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Navbar = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }

        // Listen for storage changes (when user logs in)
        const handleStorageChange = () => {
            const updatedUser = localStorage.getItem('user');
            if (updatedUser) {
                setUser(JSON.parse(updatedUser));
            } else {
                setUser(null);
            }
        };

        window.addEventListener('storage', handleStorageChange);

        // Also listen for custom event when user logs in on same tab
        window.addEventListener('userLoggedIn', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('userLoggedIn', handleStorageChange);
        };
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsMobileMenuOpen(false);
        navigate('/login');
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    if (!user) return null;

    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/dashboard" className="nav-logo">Finance Tracker</Link>

                {/* Hamburger Icon */}
                <button
                    className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                {/* Mobile Menu Overlay */}
                {isMobileMenuOpen && (
                    <div
                        className="mobile-menu-overlay"
                        onClick={closeMobileMenu}
                    ></div>
                )}

                {/* Navigation Menu */}
                <div className={`nav-menu ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
                    <Link to="/dashboard" className="nav-link" onClick={closeMobileMenu}>Dashboard</Link>
                    <Link to="/transactions" className="nav-link" onClick={closeMobileMenu}>Transactions</Link>
                    <Link to="/add-transaction" className="nav-link" onClick={closeMobileMenu}>Add Transaction</Link>
                    <Link to="/profile" className="nav-link" onClick={closeMobileMenu}>Profile</Link>

                    <div className="nav-user">
                        <span className="user-name">{user.name}</span>
                        <button onClick={handleLogout} className="btn-logout">Logout</button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
