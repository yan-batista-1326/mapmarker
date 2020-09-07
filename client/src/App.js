import React from 'react';

//Components
import Canvas from './components/canvas/index';
import Sidebar from './components/sidebar/index';

//Style
import './App.css';

function App() {
  return (
    <div className="bodyElements">
      <Sidebar/>
      <Canvas/>
    </div>
  );
}

export default App;
