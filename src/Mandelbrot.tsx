import {useRef, useEffect, useState} from "react";
import p5 from "p5";
import './styles/mandelbrot.css';

interface MandelbrotProps {
    depth: number;
    bounds: Object;
    setBounds: Function;
}

/**
 * A color map from black to white where the red green and blue
 * values wrap around the diagonal of the RGB cube.
 *
 * Originally proposed by Dave Green. More information here https://people.phy.cam.ac.uk/dag9/CUBEHELIX/
 *
 * This implementation is an almost direct copy of the original FORTRAN implementation.
 *
 * @param depth Used along with maxDepth to determine how far along the cube helix you are.
 * @param maxDepth Used along with Depth to determine how far along the cube helix you are.
 * @param start Angle determining the starting hue.
 * @param rotations How many rotations the helix will do on its way from black to white.
 * @param hue The vibrancy of the colors. Higher value is more vibrant but also more clipping close to black or white.
 * @param gamma Used to shift the distribution of the hue closer or further from black or white.
 */
function colorCubeHelix(depth: number,
                    maxDepth: number,
                    start: number,
                    rotations: number,
                    hue: number,
                    gamma: number
                    ): [number, number, number, number] {

    let fraction = (depth / maxDepth);
    let angle = 2 * Math.PI*(start/3.0+1.0+rotations*fraction);
    fraction = fraction**gamma
    let amplitude = hue*fraction*(1-fraction)/2;
    let red   = fraction+amplitude*(-0.14861*Math.cos(angle)+1.78277*Math.sin(angle));
    let green = fraction+amplitude*(-0.29227*Math.cos(angle)-0.90649*Math.sin(angle))
    let blue  = fraction+amplitude*(+1.97294*Math.cos(angle));
    function clamp(min: number, max: number, x :number): number {
        return Math.max( min, Math.min(max, x) )
    }

    red *= 255;
    green *= 255;
    blue *= 255;
    red = clamp(0,255,red);
    green = clamp(0,255,green);
    blue = clamp(0,255,blue);

    return [red, green, blue, 255];
}

let lastPixels = null;
let lastParams = null;

/**
 * Translates pixel coordinates to the cartesian/complex plane.
 *
 * @param row Row of the pixel location.
 * @param col Column of the pixel location.
 * @param canvasWidth Width of the canvas in pixels.
 * @param canvasHeight Height of the canvas in pixels.
 * @param mandelWidth Width of the view of the mandelbrot in the units of the complex plane.
 * @param mandelHeight Height of the view of the mandelbrot in the units of the complex plane.
 * @param minX Minimum x/real value seen in the view of the mandelbrot.
 * @param minY Minimum y/imaginary value seen in the view of the mandelbrot.
 */
function getCartesian(row: number, col: number,
                      canvasWidth: number, canvasHeight: number,
                      mandelWidth: number, mandelHeight: number,
                      minX: number, minY:number): [number, number] {

    // Move from (0,0) top with +y as down into (minX, maxY) top, -y as down
    let x = mandelWidth*(col/canvasWidth)+minX;
    let y = (mandelHeight*((canvasHeight-row)/canvasHeight)+minY);
    return [x, y];
}

function drawMandelbrot(p: p5, maxDepth: number,
                       canvasWidth: number,
                       canvasHeight: number,
                       bounds: Object,
                       ): void {

    let params = {
        "maxDepth": maxDepth,
        "canvasWidth": canvasWidth,
        "canvasHeight": canvasHeight,
        "mandelBB": bounds
    }

    // If settings are unchanged, use cached picture.
    if( JSON.stringify(params) == JSON.stringify(lastParams) ) {

        p.pixels=lastPixels;
        p.updatePixels();
        return;
    }

    let mandelWidth = bounds['maxX'] - bounds['minX'];
    let mandelHeight = bounds['maxY'] - bounds['minY'];

    // Precalculate the color for each depth level.
    let chStart = 1;
    let chRotations = 2;
    let chHue = 2.;
    let chGamma = 1.0;
    const colorMap = new Map<number, number|[number, number, number, number]>();
    for( let d=0; d <= maxDepth; d++){
        let color = colorCubeHelix(d, maxDepth, chStart, chRotations, chHue, chGamma);
        colorMap.set(d, color);
    }

    // Main mandelbrot loop
    for (let row = 0; row < canvasHeight; row++) {
        for (let col = 0; col < canvasWidth; col++) {
            let [x0, y0] = getCartesian(row, col,
                canvasWidth, canvasHeight,
                mandelWidth, mandelHeight,
                bounds['minX'], bounds['minY']);
            let x = x0;
            let y = y0;
            let d = 0;
            while (d < maxDepth && x * x + y * y < 4) {
                let xtemp = x * x - y * y + x0;
                y = 2 * x * y + y0;
                x = xtemp;
                d++;
            }
            let color = colorMap.get(d);
            if (color) {
                p.set(col, row, color);
            }
        }
    }

    // Display image
    p.updatePixels();

    // Cache pixels
    p.loadPixels();
    lastPixels = p.pixels;
    lastParams = params;

}

const Mandelbrot: React.FC<MandelbrotProps> = ({depth, bounds, setBounds}) => {
    const sketchRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!sketchRef.current) return;
        let width = sketchRef.current.clientWidth;
        // Image bounds in cartesian space
        let mandelWidth = bounds['maxX'] - bounds['minX'];
        let mandelHeight = bounds['maxY'] - bounds['minY'];

        // Canvas size
        // let width = 2;
        let height = width * mandelHeight / mandelWidth;

        const sketch = (p: p5) => {
            p.setup = () =>
            {
                // Initialization and settings
                p.createCanvas(width, height).parent(sketchRef.current!);
                p.noFill();
                p.strokeWeight(2);
                p.frameRate(30);
                p.rectMode(p.CORNERS);
                // Initial draw
                drawMandelbrot(p, depth, width, height, bounds);
            }

            /* Logic for drawing the rectangle for zooming*/
            let isPressed = false;
            let firstX = p.mouseX;
            let firstY = p.mouseY;

            function isMouseInCanvas(){
                return !(p.mouseX < 0 || p.mouseY < 0 || p.mouseX >= width || p.mouseY >= height);
            }

            function getRectWidth(){
                let deltaX = Math.abs(p.mouseX - firstX);
                let deltaY = Math.abs(p.mouseY - firstY);
                return Math.max( deltaX, deltaY );
            }

            function getRectSecondCorner(){
                let rectWidth = getRectWidth();
                let rectHeight = rectWidth * mandelHeight / mandelWidth;

                // First Quadrant
                if(p.mouseY <= firstY && p.mouseX >= firstX){
                    rectHeight = -rectHeight;
                }
                // Second Quadrant
                if(p.mouseY <= firstY && p.mouseX<=firstX){
                    rectHeight = -rectHeight;
                    rectWidth = -rectWidth;
                }
                // Third quadrant
                if(p.mouseY > firstY && p.mouseX<firstX){
                    rectWidth = -rectWidth;
                }
                // Fourth quadrant default.
                return [firstX + rectWidth, firstY + rectHeight];
            }


            p.mousePressed = () => {
                if(!isMouseInCanvas()) return;
                firstX = p.mouseX;
                firstY = p.mouseY;
                isPressed = true;
            }

            // When the mouse button is released, calculate new bounds(zoom) into the drawn rectangle
            p.mouseReleased = () => {
                isPressed = false;

                if(!isMouseInCanvas()) return;
                if(Math.abs(getRectWidth()) >= 20){

                    let [secondX, secondY] = getRectSecondCorner();

                    let [x1, y1] = getCartesian(firstY, firstX, width, height, mandelWidth, mandelHeight, bounds['minX'], bounds['minY']);
                    let [x2, y2] = getCartesian(secondY, secondX, width, height, mandelWidth, mandelHeight, bounds['minX'], bounds['minY']);

                    // Update mandelbrot plot bounds
                    let newBounds = {
                        'minX': Math.min(x1, x2),
                        'minY': Math.min(y1, y2),
                        'maxX': Math.max(x1, x2),
                        'maxY': Math.max(y1, y2),
                    }
                    setBounds(newBounds);

                    // Update the "global" mandelbrot plot width and height
                    mandelWidth = bounds['maxX'] - bounds['minX'];
                    mandelHeight = bounds['maxY'] - bounds['minY'];

                }
            }

            p.draw = () => {
                drawMandelbrot(p, depth, width, height, bounds);
                if(isPressed){
                    let [secondX, secondY] = getRectSecondCorner();

                    if(Math.abs(getRectWidth()) < 20){
                        p.stroke(255,0,0,255);
                    }
                    else{
                        p.stroke(0,0,0,255);
                    }
                    p.rect(firstX, firstY, secondX, secondY);
                }
            }
        }

        const p5Instance = new p5(sketch);
        return () => {
            // Cleanup
            p5Instance.remove();
            lastParams = null;
            lastPixels = null;
        }
    }, [depth, bounds]);

    return <div ref={sketchRef} />;
}



const MandelbrotContainer: React.FC = () => {

    const [depth, setDepth] = useState(30);
    let initialBounds = {
        "minX": -2.0,
        "minY": -1.2,
        "maxX":  0.6,
        "maxY":  1.2,
    }

    const [bounds, setBounds] = useState(initialBounds);

    const handleDepthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDepth = parseInt(e.target.value) || 1;
        setDepth(newDepth);
    }

    const handleManualRedraw = () => {
        setBounds(initialBounds);
    }

    return <div>
        <h1>Mandelbrot</h1>
        <div className="mb-input">
            <label className="mb-input"> Iterations
                <input className="mb-slider" type="range" value={depth} min="1" max = "100" onChange={handleDepthChange} />
            </label>
            <span className="output">{depth}</span>
        </div>
        <Mandelbrot depth={depth} bounds={bounds} setBounds={setBounds} />
        <div>
            <button onClick={handleManualRedraw}>Reset Scale</button>
        </div>
    </div>
}

export default MandelbrotContainer;