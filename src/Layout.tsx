import * as React from "react";
import { Link } from "react-router-dom";
import "./styles/layout.css"; // Ensure this file is imported

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="layout">
            {/* Header */}
            <header className="header">
                <div className="name">
                    <h1>My Website</h1>
                </div>
                <nav className="nav">
                    <Link to="/">Home</Link>
                    <Link to="/about">About</Link>
                    <Link to="/projects">Projects</Link>
                    <Link to="/contact">Contact</Link>
                </nav>
            </header>

            {/* Main Content */}
            <div className="main-content">
                {/* Sidebar (Optional) */}
                <aside className="sidebar">
                    <p>Sidebar Content</p>
                    <ul>
                        <li><Link to="/category1">Category 1</Link></li>
                        <li><Link to="/category2">Category 2</Link></li>
                    </ul>
                </aside>

                {/* Page Content */}
                <main className="main-section">{children}</main>
            </div>

            {/* Footer */}
            <footer className="footer">
                <p>&copy; {new Date().getFullYear()} My Website. All Rights Reserved.</p>
            </footer>
        </div>
    );
};

export default Layout;
