import React, { Component } from 'react';
import Footer from '../footer';
import Header from '../header';
import HowTo from '../how-to';
import TopMentors from '../top-mentors';
import Search from '../search';
import './styles.css';

class App extends Component {
  render() {
    return (
      <div className="app">
        <Header />
        <Search />
        <HowTo />
        <TopMentors />
        <Footer />
      </div>
    );
  }
}

export default App;
