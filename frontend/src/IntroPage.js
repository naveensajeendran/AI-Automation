import React from 'react';
import './IntroPage.css';

const logo = process.env.PUBLIC_URL + '/gemra-logo.png';

const IntroPage = () => {
  return (
    <div className="intro-container">
      <div className="intro-header">
        <img src={logo} alt="Gemra Ventures Logo" className="intro-logo" />
        <h1 className="intro-title">Gemra Ventures</h1>
      </div>
      <div className="intro-content">
        <h2>Welcome to Gemra Ventures</h2>
        <p>
          Empowering businesses with innovative AI solutions. Discover our services and get in touch to start your journey.
        </p>
      </div>
    </div>
  );
};

export default IntroPage;
