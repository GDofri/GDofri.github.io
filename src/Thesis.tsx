
import Layout from "./Layout.tsx";
import './styles/thesis.css';
import thesisPdfUrl from './assets/Vidarsson_Masters_Thesis.pdf'

// let thesisPdfUrlNonNull: string = thesisPdfUrl;

const ThesisContainer: React.FC = () => {

    return <Layout>
        {/*<h1>Master's Thesis</h1>*/}
        <div className={'abstract_container'}>

            {/*<h1>Hyperspectral Color Constancy in Low Dimensions</h1>*/}
            <h2>Hyperspectral Color Constancy in Low Dimensions</h2>

            <h3>Abstract</h3>
            <p>
                Illuminant estimation aims to recover the scene illumination to achieve color constancy,
                i.e., an illuminant-independent representation of surface colors. This problem is inherently
                ill-posed, since many combinations of surface reflectance and illumination can produce
                the same measurements. Hyperspectral imaging reduces this ambiguity by capturing richer
                spectral information, but its high dimensionality makes it difficult to process and motivates
                compact spectral representations.
                In this thesis, we study how low-dimensional projections of hyperspectral data compare to
                RGB for illuminant estimation. Using the KAUST-MIE hyperspectral reflectance image dataset,
                we synthetically relight scenes with CIE standard illuminants and simulate RGB observations
                using camera spectral sensitivities. We evaluate a classical method (Color by Correlation)
                and a deep model (FC4) on RGB and reduced hyperspectral representations. For Color by
                Correlation, PCA-, NNMF-, and LDA-based projections consistently outperform RGB, with
                strong results already at two to three components. In contrast, for FC4, learned three-channel
                projections do not yield consistent gains over RGB, and RGB pretraining provides only small
                and unstable improvements. Overall, low-dimensional hyperspectral projections substantially
                benefit statistical illuminant estimation, while deep models may require different architectures
                or more data to reliably exploit spectral inputs.
            </p>
            <a href={thesisPdfUrl as string} download>Download full thesis PDF</a>
        </div>

    </Layout>
}

export default ThesisContainer;
