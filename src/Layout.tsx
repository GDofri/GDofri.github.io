import * as React from "react";
import { Link } from "react-router-dom";
import "./styles/layout.css"; // Ensure this file is imported

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="layout">
            {/* Header */}
            <header className="header">
                <div className="name">
                    <h1>G. Dofri Viðarsson</h1>
                </div>
                <nav className="nav">
                    {/*<Link to="/">Home</Link>*/}
                    {/*<Link to="/about">About</Link>*/}
                    {/*<Link to="/projects">Projects</Link>*/}
                    {/*<Link to="/polygons">Polygons</Link>*/}
                    <Link to="/mandelbrot">Mandelbrot</Link>
                    <Link to="/thesis">Thesis</Link>
                    {/*<Link to="/contact">Contact</Link>*/}
                </nav>
            </header>

            {/* Main Content */}
            <div className="main-content">
                {/* Page Content */}
                <main className="main-section">{children}</main>
            </div>

            {/* Footer */}
            <footer className="footer">
                <p>&copy; {new Date().getFullYear()} Gunnar Dofri Viðarsson. All Rights Reserved.</p>
            </footer>
        </div>
    );
};

export default Layout;
