import React, {Component} from 'react';
import Navigation from './Components/Navigation/Navigation';
import Logo from './Components/Logo/Logo';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import Rank from './Components/Rank/Rank';
import ParticlesComponent from './Components/Particles/Particle';
import  'clarifai';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import './App.css';



class App extends Component {
  constructor(){
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {}
    }
  }

  calculateFaceLocation =(data)=>{
    console.log(data)
    const  clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    console.log(data)

    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return{
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)

    }
  }
  displayFaceBox=(box)=>{
    console.log(box);
    this.setState({box: box})
  }

  onInputChange = (event)=>{
    this.setState({input: event.target.value})
  }

  onButtonSubmit = ()=>{
    this.setState({imageUrl:this.state.input});
    const raw = JSON.stringify({
      user_app_id : {
        user_id: "n5j51d1d9a18",
        app_id: "test",
      },
      inputs:[
      {
        data:{
          image:{
            url:this.state.input
          },
        },
      },              
      ],
    });

    const requestOptions = {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Authorization': 'Key' + 'f6549e19ac4d49f2a4fc4d6c6a0d9881'
    },
    body: raw
};
    fetch('https://api.clarifai.com/v2/models/face-detection/outputs', requestOptions)
    .then((response)=>response.json())
    .then(result=>this.displayFaceBox(this.calculateFaceLocation(result)))
    .catch(console.log)
    .catch(err=>console.log("oops", err));

  }

  render(){
  return (
    <div className="App">
     {/*<ParticleComponet/>*/}
      <Navigation />
      <Logo />
      <Rank/>
      <ImageLinkForm onInputChange = {this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
      <FaceRecognition  box ={this.state.box} imageUrl ={this.state.imageUrl}/>

    </div>
  );
}
}

export default App;