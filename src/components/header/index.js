import React, { Component } from 'react';
import MentorCollectionLogo from '../../assets/images/Mentor Connection.svg';
import './styles.css';

class Header extends Component {
  render() {
    return (
      <header className="header">
        <a href="/" className="header-logo">
          <img src={MentorCollectionLogo} alt="Mentor Collection" />
        </a>
        <nav className="header-nav">
          <ul>
            <li>
              <a href="/" className="active">Find a Mentor</a>
            </li>
            <li>
              <a href="/">Become a Mentor</a>
            </li>
            <li>
              <a href="/">Community</a>
            </li>
            <li>
              <a href="/">Sign up</a>
            </li>
            <li>
              <a href="/">Log in</a>
            </li>
          </ul>
        </nav>
      </header>
    );
  }
}

export default Header;
