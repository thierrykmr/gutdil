import React from 'react';
import Auth from './components/Auth';
import './App.css';

function App() {
  return (
    <div className="App">
      <p>hello</p>
      <header>
        <h1>Goodeal v2</h1>
      </header>
      <main>
        {/* 2. On utilise notre composant comme une balise HTML */}
        <Auth />
      </main>
    </div>
  );
}

export default App;