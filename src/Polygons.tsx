import {useRef, useEffect} from "react";
import p5 from "p5"

const Polygons: React.FC  = () => {
    const sketchRef = useRef<HTMLDivElement | null>(null); // Create
    useEffect(() => {
        if (!sketchRef.current) return;
        const sketch = (p: p5) => {
            p.setup = () => {
                let width = 400;
                let height = 400;

                p.createCanvas(width, height).parent(sketchRef.current!);
                p.background(200);
                let stroke = 0;
                let strokeMax = 100;
                p.strokeWeight(2);
                let numPoints = 6;
                let delta = 50;
                let radius = 150;
                let arcDelta = 2 * p.PI / numPoints;
                let startAngle = p.PI / 2;
                let points: number[][] = [];
                let nextPoints: number[][] = [];
                let depth = 10;
                let strokeDelta = strokeMax / (depth-1);

                for( let i = 0; i < numPoints; i++)
                {
                    let x = width/2 + p.cos(i * arcDelta + startAngle) * radius;
                    x += p.random(delta)-delta/2;
                    let y = width/2 + p.sin(i * arcDelta + startAngle) * radius;
                    y += p.random(delta)-delta/2;
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
                    let identity = (x) => x;
                    points = nextPoints
                    nextPoints = [];

                }



                // p.draw = () => {
                //     p.fill(255, 0, 0);
                //     p.ellipse(p.mouseX, p.mouseY, 10, 10);
                // };
                // p.mouseClicked( () => {
                //
                // })
                // p.keyPressed()
            }
        }
        const p5Instance = new p5(sketch);

        return () => {
            p5Instance.remove();
        }
    });

    return <div ref={sketchRef} />;
}

const PolygonsContainer: React.FC = () => {
    return  <div>
                <h1>Polygons</h1>
                <Polygons />
            </div>
}

export default PolygonsContainer;