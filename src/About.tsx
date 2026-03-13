
import Layout from "./Layout.tsx";

const About: React.FC = () => {
    return <Layout>
        <h2>Welcome to my website!</h2>
        <p>
            I am a Software Developer with a MSc Degree in Computer Science from EPFL. Currently located in Lausanne Switzerland.
            My interests include software engineering, computer vision and computational photography.
            I have a strong passion for problem solving and enjoy working in a team to find solutions to difficult problems.
        </p>
        <p>
            My professional experience includes working on the development of a language learning website written with a Java backend
            and a JS+HTML frontend as well as an air traffic simulation product used for training air traffic controllers written primarily in modern C++ with a QT5 frontend.
            Both products are currently in use.
        </p>
        {/*<p>*/}
        {/*    In my free time I enjoy spending time outside, dancing lindy hop and chatting with friends.*/}
        {/*</p>*/}
        </Layout>
}

export default About;
