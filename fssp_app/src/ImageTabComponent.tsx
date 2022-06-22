import React from "react";

interface ImageTabProps {

}

export class ImageTabComponent extends React.Component<ImageTabProps> {
    constructor(props: Readonly<ImageTabProps>) {
        super(props);
    }

    uploadImage = () => {
    
    }

    render() {
        return (
            <div>
                <h1>Image</h1>
                <button onClick={() => this.uploadImage}>Upload Image</button>
            </div>
        );
    }
}

