import React from "react";

interface InfoTabProps {

}

export class InfoTabComponent extends React.Component<InfoTabProps> {
    constructor(props: Readonly<InfoTabProps>) {
        super(props);
    }

    render() {
        return (
            <div>
                <h1>Info Tab</h1>
            </div>
        );
    }
}