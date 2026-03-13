import {useRef, useEffect, useState} from "react";
import p5 from "p5";
import './styles/cubehelix.css';

interface CubeHelixProps {
    start: number,
    rotations: number,
    hue: number,
    gamma: number
}


/**
 * A color map from black to white where the red green and blue
 * values wrap around the diagonal of the RGB cube.
 *
 * Originally proposed by Dave Green. More information here https://people.phy.cam.ac.uk/dag9/CUBEHELIX/
 *
 * This implementation is an almost direct copy of the original FORTRAN implementation.
 *
 * @param fraction The dependant variable of the hue.
 * @param start Angle determining the starting hue.
 * @param rotations How many rotations the helix will do on its way from black to white.
 * @param hue The vibrancy of the colors. Higher value is more vibrant but also more clipping close to black or white.
 * @param gamma Used to shift the distribution of the hue closer or further from black or white.
 */
function colorCubeHelix(fraction: number,
                        start: number,
                        rotations: number,
                        hue: number,
                        gamma: number
): [number, number, number] {

    const angle = 2 * Math.PI*(start/3.0+1.0+rotations*fraction);
    fraction = fraction**gamma
    const amplitude = hue*fraction*(1-fraction)/2;
    let red   = fraction+amplitude*(-0.14861*Math.cos(angle)+1.78277*Math.sin(angle));
    let green = fraction+amplitude*(-0.29227*Math.cos(angle)-0.90649*Math.sin(angle))
    let blue  = fraction+amplitude*(+1.97294*Math.cos(angle));

    function clamp(min: number, max: number, x :number): number {
        return Math.max( min, Math.min(max, x) )
    }

    red = clamp(0,1,red);
    green = clamp(0,1,green);
    blue = clamp(0,1,blue);

    return [red, green, blue];
}


const CubeHelixBar: React.FC<CubeHelixProps> = ({ start, rotations, hue, gamma}) => {
    const sketchRef = useRef<HTMLDivElement | null>(null);
    const [canvasSize, setCanvasSize] = useState({width: 0, height: 0});

    useEffect(() => {
        if (!sketchRef.current) return;
        const resizeObserver = new ResizeObserver((entries) => {
            for( const entry of entries) {
                const width = Math.floor(Math.max(entry.contentRect.width * 0.7, 400));
                const height = Math.floor(width*0.2);
                setCanvasSize({width:width, height:height});
            }
        })
        resizeObserver.observe(sketchRef.current);
        return () => {resizeObserver.disconnect();}
    }, []);

    useEffect(() => {
        if (canvasSize.width === 0 || !sketchRef.current) return;

        const sketch = (p: p5) => {
            p.setup = () =>
            {
                // Initialization and settings
                p.createCanvas(canvasSize.width, canvasSize.height).parent(sketchRef.current!);
                p.strokeWeight(1);

                // Draw color spectrum
                for( let i = 0; i < canvasSize.width; i++ ) {
                    const rgb = colorCubeHelix(i/canvasSize.width, start, rotations, hue, gamma);
                    p.stroke(rgb[0] * 255, rgb[1] * 255, rgb[2] * 255);
                    p.line(i, 0, i, canvasSize.height);
                }
            }
        }

        const p5Instance = new p5(sketch);
        return () => {
            // Cleanup
            p5Instance.remove();
        }
    }, [start, rotations, hue, gamma, canvasSize]);

    return <div  className="ch-widget" ref={sketchRef} />;
}

function drawUnitCubeGrid(p:p5, s:number): void {

    let drawCylinder = () => {
        p.cylinder(3, s, 4);
    };
    // All Vertical lines
    // (0,0,0) -> (0,s,0)
    p.fill(0);
    p.push();
    p.translate(0,-s/2,0);
    drawCylinder()
    p.pop();

    // (s,0,0) -> (s,s,0)
    p.fill(0);
    p.push();
    p.translate(s,-s/2,0);
    drawCylinder()
    p.pop();

    // (0,0,s) -> (0,s,s)
    p.fill(0);
    p.push();
    p.translate(0,-s/2,s);
    drawCylinder()
    p.pop();

    // (s,0,s) -> (s,s,s)
    p.fill(0);
    p.push();
    p.translate(s,-s/2,s);
    drawCylinder()
    p.pop();

    // Horizontal lines parallel to x-y plane
    // (0,0,0) -> (s,0,0)
    p.fill(0);
    p.push();
    p.translate(s/2,0,0);
    p.rotateZ(Math.PI/2);
    drawCylinder()
    p.pop();
    // (0,0,0) -> (s,0,0)
    p.fill(0);
    p.push();
    p.translate(s/2,-s,0);
    p.rotateZ(Math.PI/2);
    drawCylinder()
    p.pop();
    // (0,0,s) -> (s,0,s)
    p.fill(0);
    p.push();
    p.translate(s/2,0,s);
    p.rotateZ(Math.PI/2);
    drawCylinder()
    p.pop();
    // (0,0,0) -> (s,0,0)
    p.fill(0);
    p.push();
    p.translate(s/2,-s,s);
    p.rotateZ(Math.PI/2);
    drawCylinder()
    p.pop();

    // Horizontal lines parallel to x-z plane

    // (0,0,0) -> (0,0,s)
    p.fill(0);
    p.push();
    p.translate(0,0,s/2);
    p.rotateX(-Math.PI/2);
    drawCylinder()
    p.pop();
    // (0,s,0) -> (0,s,s)
    p.fill(0);
    p.push();
    p.translate(0,-s,s/2);
    p.rotateX(-Math.PI/2);
    drawCylinder()
    p.pop();
    // (s,0,0) -> (s,0,s)
    p.fill(0);
    p.push();
    p.translate(s,0,s/2);
    p.rotateX(-Math.PI/2);
    drawCylinder()
    p.pop();

    // (s,s,0) -> (s,s,s)
    p.fill(0);
    p.push();
    p.translate(s,-s,s/2);
    p.rotateX(-Math.PI/2);
    drawCylinder()
    p.pop();
}

const CubeHelixCube: React.FC<CubeHelixProps> = (props) => {
    const sketchRef = useRef<HTMLDivElement | null>(null);
    const propsRef = useRef(props);
    const [canvasSize, setCanvasSize] = useState({width: 0, height: 0});


    useEffect(() => {
        propsRef.current = props;
    }, [props]);

    useEffect(() => {
        if (!sketchRef.current) return;
        const resizeObserver = new ResizeObserver((entries) => {
            for( const entry of entries) {
                const sideLength = Math.max(entry.contentRect.width * 0.7, 400);
                setCanvasSize({width:sideLength, height:sideLength});
            }
        })
        resizeObserver.observe(sketchRef.current);
        return () => {resizeObserver.disconnect();}
    }, []);

    useEffect(() => {
        if (canvasSize.width === 0 || !sketchRef.current) return;

        const curveDefinition = 1000;
        const drawScale = 500;
        // Calibrated magic numbers to make sure the cube is good size at different widths.
        const camDistanceScale = 2.6 * 180/canvasSize.width;

        // Curve Thickness
        const curveThickness = 10;

        const sketch = (p: p5) => {
            p.setup = () =>
            {
                // Initialization and settings
                p.createCanvas(canvasSize.width, canvasSize.height, p.WEBGL).parent(sketchRef.current!);
                p.background(125);
                let cam = p.createCamera();
                const initialCameraAngle = 1.4;
                cam.setPosition(
                    drawScale*camDistanceScale*(4*Math.cos(initialCameraAngle)),
                    -drawScale*camDistanceScale*1.5,
                    drawScale*camDistanceScale*(4*Math.sin(initialCameraAngle))
                );
                cam.lookAt(drawScale/2,-drawScale/2,drawScale/2);

                // @ts-expect-error: Library accepts 4 inputs at runtime.
                // cam.perspective(undefined, undefined, 2, 5000);

            }

            p.draw = () => {

                p.noStroke();
                p.background(125);
                p.orbitControl(1,0,0);

                drawUnitCubeGrid(p, drawScale);

                const { start, rotations, hue, gamma } = propsRef.current;

                for (let i = 0; i <= curveDefinition; i++) {
                    const fraction = i / curveDefinition;
                    const rgb = colorCubeHelix(fraction, start, rotations, hue, gamma);

                    p.push();
                    p.strokeWeight(curveThickness);
                    p.stroke(rgb[0] * 255, rgb[1] * 255, rgb[2] * 255);

                    p.point(drawScale * rgb[0],
                        -1 * (drawScale * rgb[1]),
                        drawScale * rgb[2]);

                    // Additionally draw the last 10 points as spheres as p.point() has a strange
                    // effect when drawn on the same area as p.cylinder()
                    if(i > curveDefinition - 10){
                        p.translate(drawScale * rgb[0],
                            -1 * (drawScale * rgb[1]),
                            drawScale * rgb[2])
                        p.sphere(curveThickness/6)
                    }
                    p.pop();
                }
            }
        }

        const p5Instance = new p5(sketch);
        return () => {
            // Cleanup
            p5Instance.remove();
        }
    }, [canvasSize]);

    return <div className="ch-widget" ref={sketchRef} />;
}



const CubeHelixContainer: React.FC = () => {

    const [start, setStart] = useState(1.0);
    const [rotations, setRotations] = useState(2.0);
    const [hue, setHue] = useState(1.0);
    const [gamma, setGamma] = useState(1.0);

    const handleSliderChange = (setter: (val: number) => void, defaultValue: number) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const val = parseFloat(e.target.value);
            setter(isNaN(val) ? defaultValue : val);
        };

    return <div>
        <h1>CubeHelix</h1>
        <p>
            CubeHelix is a colormap scheme created by Dave Green. He needed a color scheme to represent intensity
            with a large gamut to visualize astronomical images. CubeHelix colormaps go from black to white while curving around
            the achromatic diagonal of the RGB cube. I got interested in this colormap when using the
            <a href="https://seaborn.pydata.org/"> Seaborn</a> plotting library as a part of my Master's Thesis work.
            They use a CubeHelix colormap for some of their default for plotting.
            Examples in the Seaborn docs <a href="https://seaborn.pydata.org/generated/seaborn.cubehelix_palette.html">here</a>.
            Each CubeHelix colormap is parameterized by four variables.
        </p>
        <ul>
            <li>
                <i>Start:</i> The initial angle in radians. Picks the starting hue.
            </li>
            <li>
                <i>Rotations:</i> The number of rotations the helix makes around the RGB cube diagonal.
            </li>
            <li>
                <i>Hue:</i> The saturation of the colors (this should imo be called <i>saturation</i> but I will use the original terminology).
            </li>
            <li>
                <i>Gamma:</i> Controls the distribution of light vs dark colors along the curve.
            </li>
        </ul>
        <p>
            After reading about the CubeHelix concept on Dave Green's <a href="https://people.phy.cam.ac.uk/dag9/CUBEHELIX/"> website</a>,
            I wanted to create a tool to visualize the different curves that could be generated in 3D space. So that is what I have done.
            Here below is a small widget to change the CubeHelix parameters and see the different colormaps generated along with the
            curve in RGB space.
        </p>

        <p>
            Some interesting special cases for the parameters:
            <ul>
               <li>
                   Setting <i>hue</i> to 0 gives you a grayscale colormap and renders the
                   <i>start</i> and <i>rotations</i> parameters useless.
               </li>
                <li>
                    High values of <i>hue</i> quickly start fully saturating the colors, making the curve clip to the edges
                    of the RGB cube.
                </li>
                <li>
                    Setting <i>rotations</i> to 0 gives you a colormap that only
                    uses a single hue (approximately).
                </li>
            </ul>

        </p>
        <div className="ch-widget-container">
            <CubeHelixBar start={start} rotations={rotations} hue={hue} gamma={gamma}/>
            <CubeHelixCube start={start} rotations={rotations} hue={hue} gamma={gamma}/>
        </div>

        <div className="ch-control-container-l1">
            <div className="ch-control-container-l2">
                <div className="ch-input">
                    <label className="ch-label"> Start </label> <br></br>
                    <input className="ch-slider" type="range" value={start} min="0" max="3.1415" step="0.1"
                           onChange={handleSliderChange(setStart, start)}/>
                    <span className="output">{start.toFixed(1)}</span>
                </div>
                <div className="ch-input">
                    <label className="ch-label"> Rotations </label>
                    <input className="ch-slider" type="range" value={rotations} min="0" max="4" step="0.1"
                           onChange={handleSliderChange(setRotations, rotations)}/>
                    <span className="output">{rotations.toFixed(1)}</span>
                </div>
                <div className="ch-input">
                    <label className="ch-label"> Hue </label>
                    <input className="ch-slider" type="range" value={hue} min="0" max="4" step="0.1"
                           onChange={handleSliderChange(setHue, hue)}/>
                    <span className="output">{hue.toFixed(1)}</span>
                </div>
                <div className="ch-input">
                    <label className="ch-label"> Gamma </label>
                    <input className="ch-slider" type="range" value={gamma} min="0.1" max="5" step="0.1"
                           onChange={handleSliderChange(setGamma, gamma)}/>
                    <span className="output">{gamma.toFixed(1)}</span>
                </div>
            </div>
        </div>
    </div>
}

export default CubeHelixContainer;