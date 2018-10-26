import React, { Component } from 'react';
import MentorCollectionLogo from '../../assets/images/Mentor Connection.svg';
import './styles.css';

class Footer extends Component {
  render() {
    return (
      <footer className="footer">
        <div className="box">
          <div className="footer-container">
            <a href="/" className="footer-logo">
              <img src={MentorCollectionLogo} alt="Mentor Collection" />
            </a>
            <p className="copyright">@2018 MentorConnection, All Rights Reserved.</p>
            <a
              href = "http://www.thaisouza.com"
              alt = "www.thaisouza.com"
              target = "_blank"
              rel = "noopener noreferrer"
            >
              www.thaisouza.com
            </a>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;
