import React from 'react';
import AirtableReader from './components/AirtableReader';
import Header from './components/Header';
import './App.css';

const App = () => {
  return (

    <div>
      <header>
        <Header />
      </header>
      <main>
      <AirtableReader />
      </main>
    </div>

  );
};

export default App;