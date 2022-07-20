import React from "react";
import Sketch from "react-p5";
import p5Types from "p5";
import { Frame } from "./Frame";
import './ProjectionTabComponent.scss';

interface ProjectionTabProps {
    ultra1: number;
    ultra2: number;
    ultra3: number;
}


export class ProjectionTabComponent extends React.Component<ProjectionTabProps> {
    constructor(props: Readonly<ProjectionTabProps>) {
        super(props);
    }


    render() {

        //See annotations in JS for more information
	    const setup = (p5: p5Types, canvasParentRef: Element) => {
            p5.createCanvas(p5.windowWidth * 0.3, p5.windowHeight * 0.5, "webgl").parent(canvasParentRef);
            p5.normalMaterial();
	    };

	    const draw = (p5: p5Types) => {
		    p5.background(200);
            p5.orbitControl();
            p5.rotateY(0.5);
		    p5.box(30, 50);
	    };

        const windowResized = (p5: p5Types) => {
            p5.resizeCanvas(p5.windowWidth * 0.3, p5.windowHeight * 0.5);
        }

        return (
            <div>
                <h1>Plane Projection Tab</h1>
                <Frame className="projection-frame">
                    <Sketch setup={setup} draw={draw} windowResized={windowResized}/>
                </Frame>
                <Frame className="sensor-frame">
                    <h2>Sensors</h2>
                    <h4 className="green">Status: Active</h4>
                    <h4>Ultrasonic Sensor 1: {this.props.ultra1}</h4>
                    <h4>Ultrasonic Sensor 2: {this.props.ultra2}</h4>
                    <h4>Ultrasonic Sensor 3: {this.props.ultra3}</h4>
                </Frame>
            </div>
        );
    }
}

