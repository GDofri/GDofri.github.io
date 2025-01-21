// import * as React from "react";
import "./styles/global.css";
import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import Layout from "./Layout.tsx";
const Home = () => <Layout><h2>Home Page</h2></Layout>;
const About = () => <Layout><h2>About Page</h2></Layout>;
const Projects = () => <Layout><h2>Projects</h2></Layout>;
const Contact = () => <Layout><h2>Contact Page</h2></Layout>;

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/contact" element={<Contact />} />
            </Routes>
        </Router>
    );
}

export default App;