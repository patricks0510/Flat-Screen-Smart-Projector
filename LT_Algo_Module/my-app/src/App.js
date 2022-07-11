import React from 'react'
import SmartTextInput from './SmartTextInput'
const { ipcRenderer } = window.require('electron')

// const App = () => (
//   <div>
//     <h1>Hello React</h1>
//   </div>
// )

export default class App extends React.Component{
  constructor (props) {
    super(props)
    this.state = {ready: false}
  }
  componentDidMount () {
    ipcRenderer.on('fetchData',(event,arg) => {
      this.setState({ready: arg.ready, originDistance: arg.originDistance, iHatDistance: arg.iHatDistance, jHatDistance: arg.jHatDistance})
    })
    this.intervalId = setInterval(() => { ipcRenderer.send('requestData') }, 50)
  }

  componentWillUnmount () {
    ipcRenderer.removeAllListeners('fetchData')
    clearInterval(this.intervalId)
  }

  render() { return <div>
    <h1>Origin Distance: {this.state.ready ? this.state.originDistance.z: ""}</h1>
    {this.state.ready ? <SmartTextInput default = {10} channel = 'oDist'/>: ""}
    <h1>i-Hat Distance: {this.state.ready ? this.state.iHatDistance.z: ""}</h1>
    {this.state.ready ? <SmartTextInput default = {10} channel = 'iDist'/>: ""}
    <h1>j-Hat Distance: {this.state.ready ? this.state.jHatDistance.z: ""}</h1>
    {this.state.ready ? <SmartTextInput default = {10} channel = 'jDist'/>: ""}
  </div>}
}

