import React from "react";
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
        return (
            <div>
                <h1>Plane Projection Tab</h1>
                <Frame className="projection-frame">
                    <p className="projection-center">Coming Soon</p>
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

