import React from "react";
import "./Frame.scss";

interface FrameProps {
    className: string;
    padding?: number;
    children?: React.ReactNode;
}

export class Frame extends React.Component<FrameProps> {

    static defaultProps = {
        closable: false
    };

    render() {
        return (
                <div className={"standard-frame " + this.props.className}>
                    <div className="frame-lt"/>
                    <div className="frame-lb"/>
                    <div className="frame-rt"/>
                    <div className="frame-rb"/>
                    <div className={"frame-content"} style={this.props.padding ? {padding: this.props.padding} : {}}>
                        {this.props.children}
                    </div>
                </div>);
    }
}