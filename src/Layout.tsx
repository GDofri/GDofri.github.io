import * as React from "react";
import { NavLink, NavLinkRenderProps} from "react-router-dom";
import "./styles/layout.css";

const navLinkStyles = (props: NavLinkRenderProps) : React.CSSProperties  => ({
    textDecoration: props.isActive ? 'underline':'none'
});

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="layout">
            <header className="header">
                <div className="name">
                    <h1>G. Dofri Viðarsson</h1>
                </div>
                <nav className="nav">
                    <NavLink to="/" style={navLinkStyles}>About Me</NavLink>
                    <NavLink to="/mandelbrot" style={navLinkStyles}>Mandelbrot</NavLink>
                    <NavLink to="/cubehelix" style={navLinkStyles}>CubeHelix</NavLink>
                    <NavLink to="/thesis" style={navLinkStyles}>MSc. Thesis</NavLink>
                </nav>
            </header>

            <div className="main-content">

                <main className="main-section">{children}</main>
            </div>

            <footer className="footer">
                <p>&copy; {new Date().getFullYear()} Gunnar Dofri Viðarsson. All Rights Reserved.</p>
            </footer>
        </div>
    );
};

export default Layout;
