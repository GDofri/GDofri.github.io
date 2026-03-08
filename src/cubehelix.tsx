import {useRef, useEffect, useState} from "react";
import p5 from "p5";
// import './styles/cubehelix.css';

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

    useEffect(() => {
        if (!sketchRef.current) return;
        const width = sketchRef.current.clientWidth;
        // Image bounds in cartesian space
        // Canvas size
        // let width = 2;
        const height = Math.floor(width * 0.2);

        const sketch = (p: p5) => {
            p.setup = () =>
            {
                // Initialization and settings
                p.createCanvas(width, height).parent(sketchRef.current!);
                p.strokeWeight(1);

                // Draw color spectrum
                for( let i = 0; i < width; i++ ) {
                    const rgb = colorCubeHelix(i/width, start, rotations, hue, gamma);
                    p.stroke(rgb[0] * 255, rgb[1] * 255, rgb[2] * 255);
                    p.line(i, 0, i, height);
                }
            }
        }

        const p5Instance = new p5(sketch);
        return () => {
            // Cleanup
            p5Instance.remove();
        }
    }, [start, rotations, hue, gamma]);

    return <div ref={sketchRef} />;
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

const CubeHelixCube: React.FC<CubeHelixProps> = ({ start, rotations, hue, gamma}) => {
    const sketchRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!sketchRef.current) return;
        const width = sketchRef.current.clientWidth * 0.5;
        // Image bounds in cartesian space
        // Canvas size
        // let width = 2;
        const height = width;

        const definition = 100;
        const s = 500;
        const camLocScale = 3;
        const t = 0;// -width/2;
        const thickness = 10;

        let pointColors: p5.Color[] = [];
        let pointLocations: [number,number,number][] = [];

        const sketch = (p: p5) => {
            p.setup = () =>
            {
                // Initialization and settings
                p.createCanvas(width, height, p.WEBGL).parent(sketchRef.current!);
                p.background(125);
                // p.strokeWeight(1);
                // p.debugMode();
                let cam = p.createCamera();
                // console.log(cam.eyeX, cam.eyeY, cam.eyeZ);
                cam.setPosition(s*camLocScale,-s*camLocScale*0.5,s*camLocScale);
                cam.lookAt(s/2,-s/2,s/2);

                // @ts-expect-error: Library accepts 4 inputs at runtime.
                cam.perspective(undefined, undefined, 2, 5000);

                // Precalculate helix information
                for( let i = 0; i <= definition; i++ ) {
                    const rgb = colorCubeHelix(i/definition, start, rotations, hue, gamma);
                    const c = p.color(rgb[0] * 255, rgb[1] * 255, rgb[2] * 255);
                    pointColors.push(c);
                    pointLocations.push([s*rgb[0]-t,
                                         -1*(s*rgb[1]-t),
                                         s*rgb[2]-t]);
                }
            }

            p.draw = () => {

                p.noStroke();
                p.background(125);
                p.orbitControl(1,0,0);

                const cSize = 50;
                const l = 500;
                // Corners
                p.push();
                p.translate(0,0,0);
                p.stroke(255);
                p.fill(255);
                p.sphere(cSize/2);
                p.pop();
                p.push();
                p.translate(l,0,0);
                p.stroke(255,0,0);
                p.fill(255,0,0);
                p.sphere(cSize);
                p.pop();
                p.push();
                p.translate(0,-l,0);
                p.stroke(0,255,0);
                p.fill(0,255,0);
                p.sphere(cSize);
                p.pop();
                p.push();
                p.translate(0,0,l);
                p.stroke(0,0,255);
                p.fill(0,0,255);
                p.sphere(cSize);
                p.pop();

                drawUnitCubeGrid(p, s);
                //
                //
                // // (0,0,0) -> (s,0,0)
                // p.fill(0);
                // p.push();
                // p.rotateZ(Math.PI/2);
                // p.translate(0,-s/2,0);
                // p.cylinder(5, s, 8)
                // p.pop();
                //
                // // (0,0,0) -> (0,0,s)
                // p.fill(0);
                // p.push();
                // p.rotateX(-Math.PI/2);
                // p.translate(0,-s/2,0);
                // p.cylinder(5, s, 8)
                // p.pop();


                for( let i = 0; i <= definition; i++ ) {

                    p.push();
                    p.stroke(pointColors[i]);
                    p.fill(pointColors[i]);
                    let loc = pointLocations[i];

                    p.translate(
                        loc[0],
                        loc[1],
                        loc[2]
                    );
                    p.sphere(thickness);
                    p.pop();
                }
            }
        }

        const p5Instance = new p5(sketch);
        return () => {
            // Cleanup
            p5Instance.remove();
        }
    }, [start, rotations, hue, gamma]);

    return <div ref={sketchRef} />;
}



const CubeHelixContainer: React.FC = () => {

    const [start, setStart] = useState(1.0);
    const [rotations, setRotations] = useState(2.0);
    const [hue, setHue] = useState(2.0);
    const [gamma, setGamma] = useState(0.1);

    const handleSliderChange = (setter: (val: number) => void, defaultValue: number) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const val = parseFloat(e.target.value);
            setter(isNaN(val) ? defaultValue : val);
        };

    return <div>
        <h1>Cube Helix</h1>

        <div className="mb-input">
            <label className="mb-input"> Start
                <input className="mb-slider" type="range" value={start} min="0" max="4" step={0.2}
                       onChange={handleSliderChange(setStart, start)}/>
            </label>
            <span className="output">{start}</span>
        </div>
        <div className="mb-input">
            <label className="mb-input"> Rotations
                <input className="mb-slider" type="range" value={rotations} min="0" max="4" step="0.2"
                       onChange={handleSliderChange(setRotations, rotations)}/>
            </label>
            <span className="output">{rotations}</span>
        </div>
        <div className="mb-input">
            <label className="mb-input"> Hue
                <input className="mb-slider" type="range" value={hue} min="0" max="4" step="0.2"
                       onChange={handleSliderChange(setHue, hue)}/>
            </label>
            <span className="output">{hue}</span>
        </div>
        <div className="mb-input">
            <label className="mb-input"> Gamma
                <input className="mb-slider" type="range" value={gamma} min="0" max="5" step="0.2"
                       onChange={handleSliderChange(setGamma, gamma)}/>
            </label>
            <span className="output">{gamma}</span>
        </div>
        <CubeHelixBar start={start} rotations={rotations} hue={hue} gamma={gamma}/>
        <CubeHelixCube start={start} rotations={rotations} hue={hue} gamma={gamma}/>
    </div>
}

export default CubeHelixContainer;