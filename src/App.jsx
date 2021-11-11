import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';

import Header from './Header.jsx';

//Archive a single call record - Sending a boolean unsure as to why the server doesnt accept it
function archive(props) {
  const requestOptions = {
    method: 'POST',
    body_params: {"is_archived": true}
  };

  fetch(`https://aircall-job.herokuapp.com/activities/${props.id}`, requestOptions)
  .then(response => response.json())
  .then((json) => {
    console.log(json)
    return json
  })
  .cath((error) => {
    console.log(error)
  });
}

//Separate component for the displaying call information, allows for easier deign alterations
function CallCell(props) {
  return (
    <div className='cellContainer'>
        <h1 className='primaryInfo' style={{textAlign: 'center'}}> {props.type}, {props.direction} call from {props.from} </h1>
        <h2 className='secondaryInfo' style={{textAlign: 'center'}}> Call attempted from {props.via}</h2>
      
      <div class="buttonContainer">
        <button className="singleArchive">Archive Me!</button>
      </div>
      
      <br>
      </br>
    </div>
  );
}

class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: []
    };
  }


  componentDidMount() {
    fetch("https://aircall-job.herokuapp.com/activities")
      .then(res => res.json())
      .then(
        (json) => {
          this.setState({
            isLoaded: true,
            items: json
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  render() {
    const { error, isLoaded, items } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div style={{left: "50%", top: "50%"}}>
          
        <ul >
          {this.state.items.map(item => (
            <li key={item.id}>
              <CallCell from= {item.from} type = {item.call_type} direction={item.direction} via={item.via} id={item.id}/>
            </li>
          ))}
        </ul>
        <br></br>
        <div className="archiveAllContainer"style={{display: "flex", justifyContent: "center"}}>
          <button className="archiveAll" onClick={() => archive(this.state.items[0])}>Archieve All</button>
        </div>
        
        </div>
      );
    }
  }
}

const App = () => {
  return (
    <div className='container'>
      <Header/>
      <MyComponent/>
      
    </div>
  );
};

ReactDOM.render(<App/>, document.getElementById('app'));

export default App;
