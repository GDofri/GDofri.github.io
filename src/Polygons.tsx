import {useRef, useEffect, useState} from "react";
import p5 from "p5"

const maxPoints = 25;
interface PolygonProps {
    numPoints: number;
    depth: number;
    maxOffset: number;
    seed: number;
}

const Polygons: React.FC<PolygonProps> = ({numPoints, depth, maxOffset, seed}) => {
    const sketchRef = useRef<HTMLDivElement | null>(null); // Create
    console.log("seed", seed);
    useEffect(() => {
        if (!sketchRef.current) return;
        const sketch = (p: p5) => {
            p.setup = () => {
                let width = 400;
                let height = 400;
                p.randomSeed(parseInt(String(seed * 1000)));
                p.createCanvas(width, height).parent(sketchRef.current!);
                p.background(200);
                let strokeMax = 100;
                p.strokeWeight(2);
                let radius = 150;
                let arcDelta = 2 * p.PI / numPoints;
                let startAngle = p.PI / 2;
                let points: number[][] = [];
                let nextPoints: number[][] = [];
                let offsets: number[][] = [];
                let strokeDelta = strokeMax / (depth-1);

                for(let i = 0; i < maxPoints; i++) {
                    offsets.push([p.random()*maxOffset-maxOffset/2, p.random()*maxOffset-maxOffset/2]);
                }

                for( let i = 0; i < numPoints; i++)
                {
                    let x = width/2 + p.cos(i * arcDelta + startAngle) * radius;
                    x += offsets[i][0];
                    let y = width/2 + p.sin(i * arcDelta + startAngle) * radius;
                    y += offsets[i][1]
                    points.push([x,y]);
                }
                for (let d = 0; d < depth; d++) {

                    p.fill(strokeMax - strokeDelta * d);
                    p.stroke(strokeMax - strokeDelta * d);

                    for( let i = 0; i < numPoints ; i++)
                    {
                        p.line( points[i][0], points[i][1], points[(i+1)%(numPoints)][0], points[(i+1)%(numPoints)][1] );
                    }
                    for( let i = 0; i < numPoints ; i++)
                    {
                        p.ellipse(points[i][0],points[i][1], 5, 5);
                    }
                    for( let i = 0; i < numPoints ; i++)
                    {
                        let current = points[i];
                        let next = points[(i+1)%(numPoints)]
                        nextPoints.push([(current[0] + next[0]) / 2, (current[1] + next[1]) / 2 ] );
                        // p.ellipse(nextPoints[i][0],nextPoints[i][1], 5, 5);
                    }
                    points = nextPoints
                    nextPoints = [];

                }

            }
        }
        const p5Instance = new p5(sketch);

        return () => {
            p5Instance.remove();
        }
    }, [depth, numPoints, maxOffset, seed]);

    return <div ref={sketchRef} />;
}

const PolygonsContainer: React.FC = () => {

    const [tempDepth, setTempDepth] = useState(3);
    const [tempNumPoints, setTempNumPoints] = useState(5);
    const [tempMaxOffset, setTempMaxOffset] = useState(50);

    const [depth, setDepth] = useState(3);
    const [numPoints, setNumPoints] = useState(5);
    const [maxOffset, setMaxOffset] = useState(50);
    const [randomSeed, setRandomSeed] = useState(Math.random()); // Controls randomness

    const handleDepthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDepth = parseInt(e.target.value) || 1;
        setTempDepth(newDepth);
        setDepth(newDepth);
    }

    const handleNumPointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newNumPoints = parseInt(e.target.value) || 3;
        setTempNumPoints(newNumPoints);
        setNumPoints(newNumPoints);

    }

    const handleMaxOffsetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newMaxOffset = parseInt(e.target.value) || 0;
        setTempMaxOffset(newMaxOffset);
        setMaxOffset(newMaxOffset);
    }

    const handleManualRedraw = () => {
        setRandomSeed(Math.random());
    }

    return  <div>
                <h1>Polygons</h1>
                <div>
                <label> Number of points
                    <input type="number" value={tempNumPoints} min="3" max = {maxPoints} onChange={handleNumPointsChange} />
                </label>
                <label> Depth
                    <input type="number" value={tempDepth} min="1" max = "50" onChange={handleDepthChange} />
                </label>
                </div>
                <Polygons depth={depth} numPoints={numPoints} maxOffset={maxOffset} seed={randomSeed}/>
                <label>Offset
                    <input type="number" value={tempMaxOffset} min="1" max="400" onChange={handleMaxOffsetChange} />
                </label>
                <div>
                    <button onClick={handleManualRedraw}>Redraw</button>
                </div>
            </div>
}

export default PolygonsContainer;