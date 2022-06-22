import React from 'react';
import './App.css';


import {ImageTabComponent} from "./ImageTabComponent";
import { ProjectionTabComponent } from './ProjectionTabComponent';
import { InfoTabComponent } from './InfoTabComponent';


enum TabState {
  image = 0,
  projection = 1,
  info = 2
}

interface AppProps{

}

interface AppState {
  tabState: TabState;
}


export class App extends React.Component<AppProps, AppState> {
    
    constructor(props: AppProps){
      super(props);
      this.state = {
        tabState: TabState.image
      };
    }


    render() {
      let main;

      if (this.state.tabState === TabState.image){
        main = <ImageTabComponent></ImageTabComponent>
      }
      else if (this.state.tabState === TabState.projection){
        main = <ProjectionTabComponent></ProjectionTabComponent>
      }
      else if (this.state.tabState === TabState.info){
        main = <InfoTabComponent></InfoTabComponent>
      }

      return (
        <div>
          <div>
            <h1>Flat Screen Smart Projector</h1>
          </div>

          <div className='tab'>
            <button className="tablinks" onClick={() => this.switchTab('image')}>Image</button>
            <button className="tablinks" onClick={() => this.switchTab('projection')}>Projection</button>
            <button className="tablinks" onClick={() => this.switchTab('info')}>Info</button>
          </div>

          <div>
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
