import React from "react";
import Sketch from "react-p5";
import p5Types from "p5";
import { Frame } from "./Frame";
import './ProjectionTabComponent.scss';
import Vector3 from "./vector3";
import { dot, norm, acos, cross} from "mathjs";

interface ProjectionTabProps {
    ultra1: number;
    ultra2: number;
    ultra3: number;
    eq: Array<number>;
}

interface ProjectionTabState {
    curr_eq: Array<number>
}

export class ProjectionTabComponent extends React.Component<ProjectionTabProps, ProjectionTabState> {
    constructor(props: Readonly<ProjectionTabProps>) {
        super(props);
    }


    calculateAxisAndAngle = (a: Array<number>, b: Array<number>): [Array<number>, number] => {
        let a_dot_b = dot(a,b) as number;
        let a_norm = norm(a,3) as number;
        let b_norm = norm(b,3) as number;
        let angle = acos(a_dot_b / (a_norm * b_norm));
        let a_cross_b = cross(a,b) as Array<number>;
        let a_cross_b_norm = norm(a_cross_b,3) as number;
        let axis = [];
        for (let i: number = 0; i < 3; i++){
            axis.push(a_cross_b[i] as number / a_cross_b_norm);
        }
        return [axis, angle];
    }

    updateEquation = () => {
        this.setState({curr_eq: this.props.eq});
    }

    render() {

        let x_rotation: number;
        let y_rotation: number;
        let z_rotation: number;


        //See annotations in JS for more information
	    const setup = (p5: p5Types, canvasParentRef: Element) => {
            p5.createCanvas(p5.windowWidth * 0.3, p5.windowHeight * 0.5, "webgl").parent(canvasParentRef);
            p5.normalMaterial();
            p5.camera(-100,-100,200);
            

            /*let plane_coeff = this.props.eq;
            let a = [plane_coeff[0],plane_coeff[1],plane_coeff[2]];
            let b = [0,0,1];
            */
            let a = [1,1,1];
            let b = [0,1,0];
            let [axis, angle] = this.calculateAxisAndAngle(a,b);
            x_rotation = axis[0] * angle;
            y_rotation = axis[1] * angle;
            z_rotation = axis[2] * angle;

            console.log(axis);
            console.log(angle);

	    };

	    const draw = (p5: p5Types) => {
		    p5.background(200);
            p5.orbitControl();

            p5.rotateX(-x_rotation);
            p5.rotateY(y_rotation);
            p5.rotateZ(-z_rotation);

            let c = p5.color(65);
            let dim = 100
            p5.fill(c);
            p5.translate(-dim/2,-dim/2);
		    p5.rect(0, 0, dim, dim);
            p5.translate(dim/2,dim/2);
            
            p5.rotateX(x_rotation);
            p5.rotateY(-y_rotation);
            p5.rotateZ(z_rotation);

            c = p5.color(0,255,0);
            p5.fill(c);
            p5.cylinder(1,p5.windowHeight);

            c = p5.color(255,0,0);
            p5.fill(c);
            p5.rotateZ(Math.PI/2);
            p5.cylinder(1,p5.windowHeight);

            c = p5.color(0,0,255);
            p5.fill(c);
            p5.rotateZ(-Math.PI/2);
            p5.rotateX(Math.PI/2);
            p5.cylinder(1,p5.windowHeight);

            p5.rotateX(-Math.PI/2);

            c = p5.color(255,0,255);
            p5.fill(c);
            p5.translate(-5,-50);
            p5.sphere(5);
	    };

        const windowResized = (p5: p5Types) => {
            p5.resizeCanvas(p5.windowWidth * 0.3, p5.windowHeight * 0.5);
        }

        return (
            <div>
                <h1>Plane Projection</h1>
                <Frame className="projection-frame">
                    <Sketch setup={setup} draw={draw} windowResized={windowResized}/>
                    <button onClick={this.updateEquation}></button>
                </Frame>
                <button className='image-project-button' onClick={() => this.updateEquation()}>Update Projection</button>
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

