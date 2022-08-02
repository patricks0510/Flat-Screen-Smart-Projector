import React from 'react';
import './App.scss';


import {ImageTabComponent} from "./ImageTabComponent";
import { ProjectionTabComponent } from './ProjectionTabComponent';
import { InfoTabComponent } from './InfoTabComponent';
import Matrix2x2 from './matrix2x2';


enum TabState {
  image = 0,
  projection = 1,
  info = 2
}

interface AppProps{

}

interface AppState {
  ultra1: number;
  ultra2: number;
  ultra3: number;
  tabState: TabState;
  timer: number;
  logs: string;
  eq: Array<number>;
  lt: Matrix2x2;
}


export class App extends React.Component<AppProps, AppState> {
    
    constructor(props: AppProps){
      super(props);
      this.state = {
        ultra1: 0,
        ultra2: 0,
        ultra3: 0,
        tabState: TabState.image,
        timer: 1000,
        logs: "",
        eq: [0,0,0,0],
        lt: new Matrix2x2(0,0,0,0)
      };
    }

    componentDidMount() {
      this.fetchDistances();
      this.setState({timer: window.setInterval(() => this.fetchDistances(), 5000)});
    }

    componentWillUnmount() {
      clearInterval(this.state.timer);
      this.setState({timer: 0});
    }


    fetchDistances = () => {
    
      console.log("Fetching Distances");
      fetch("http://192.168.4.1/sensors").then((response) => {
        console.log(response);
        if (response.ok) return response.json();
        else
          console.error("Did Not Read Distance");
          
      }).then((json) => {
        console.log(json);
        const Vector2 = require('./vector2.js')
        const Vector3 = require('./vector3.js')
        const Matrix2x2 = require('./matrix2x2.js')
        const Plane = require('./plane.js')
        const CartesianPixel = require('./cartesianPixel.js')
        const BmpImage = require('./BmpImage.js')
        const transformer = require('./applyTransform.js');
        
        var originDistance = new Vector3(0,0,json.J2)
        var iHatDistance = new Vector3(1,0,json.J3)
        var jHatDistance = new Vector3(0,1,json.J4)

        var projPlane = new Plane(originDistance,iHatDistance,jHatDistance)

        projPlane.calcEq()

        var iHat = projPlane.getIHat()
        var jHat = projPlane.getJHat()

        var lT = new Matrix2x2(iHat.x,jHat.x,iHat.y,jHat.y)

        lT.invert()

        this.setState({lt: lT, eq: projPlane.getEq(), ultra1: json.J2, ultra2: json.J3, ultra3: json.J4, logs: this.state.logs + `(info)${new Date().toISOString()}: ${json.J2} ${json.J3} ${json.J4}\n\n`});
      });
    
    }

    render() {
      let main;

      if (this.state.tabState === TabState.image){
        main = <ImageTabComponent ultra1={this.state.ultra1} ultra2={this.state.ultra2} ultra3={this.state.ultra3} lT={this.state.lt}></ImageTabComponent>
      }
      else if (this.state.tabState === TabState.projection){
        main = <ProjectionTabComponent ultra1={this.state.ultra1} ultra2={this.state.ultra2} ultra3={this.state.ultra3} eq={this.state.eq}></ProjectionTabComponent>
      }
      else if (this.state.tabState === TabState.info){
        main = <InfoTabComponent ultra1={this.state.ultra1} ultra2={this.state.ultra2} ultra3={this.state.ultra3} logs={this.state.logs}></InfoTabComponent>
      }

      return (
        <div className='main'>
          <div className='App-header'>
            <h1>Flat Screen Smart Projector</h1>
          </div>

          <div className='tab'>
            <button className="tablinks" onClick={() => this.switchTab('image')}>Image</button>
            <button className="tablinks" onClick={() => this.switchTab('projection')}>Projection</button>
            <button className="tablinks" onClick={() => this.switchTab('info')}>Info</button>
          </div>

          <div className='main'>
          {main}
          </div>
        </div>        
      );
    }

    switchTab = (name: string) => {
        switch(name) {
          case 'image':
            this.setState({tabState: TabState.image});
            break;
          case 'projection':
            this.setState({tabState: TabState.projection});
            break;
          case 'info':
            this.setState({tabState: TabState.info});
            break;
        }
    }

}
