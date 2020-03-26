import React from 'react';
import SideBar from './side-bar/side-bar';
import GamePortal from './game-portal/game-portal';
import './App.scss';

function App() {
  return (
    <div className="App">
      <SideBar></SideBar>
      <GamePortal></GamePortal>
    </div>
  );
}

export default App;
