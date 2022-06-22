import React from "react";

interface ProjectionTabProps {

}

export class ProjectionTabComponent extends React.Component<ProjectionTabProps> {
    constructor(props: Readonly<ProjectionTabProps>) {
        super(props);
    }

    render() {
        return (
            <div>
                <h1>Plane Projection Tab</h1>
            </div>
        );
    }
}

