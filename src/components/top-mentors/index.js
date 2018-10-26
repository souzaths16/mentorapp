import React, { Component } from 'react';
import Xavier from '../../assets/images/xavier.jpg';
import Dumbledore from '../../assets/images/dumbledore.jpg';
import Miyagi from '../../assets/images/miyagi.jpg';
import Title from '../title';
import Yoda from '../../assets/images/yoda.jpg';
import './styles.css';

const topMentors = [
  {
    description: 'Professor Charles Francis Xavier is a fictional character appearing in American comic books published by Marvel Comics and is the founder and leader of the X - Men.',
    id: 'xavier',
    image: Xavier,
    name: 'Professor Charles Xavier',
  },
  {
    description: 'Professor Dumbledore is a fictional character in J.K.Rowling\'s Harry Potter series. For most of the series, he is the headmaster of the wizarding school Hogwarts.',
    id: 'dumbledore',
    image: Dumbledore,
    name: 'Professor Dumbledore',
  },
  {
    description: 'Mr. Miyagi is a fictional karate master played by Japanese-American actor Pat Morita in The Karate Kid films. Mr. Miyagi mentors Daniel LaRusso.',
    id: 'miyagi',
    image: Miyagi,
    name: 'Mr. Miyagi',
  },
  {
    description: 'Yoda was a legendary Jedi Master and stronger than most in his connection with the Force. Small in size but wise and powerful, he trained Jedi for over 800 years.',
    id: 'yoda',
    image: Yoda,
    name: 'Yoda',
  },
];

const Mentor = ({ description, image, name }) => (
  <div className="mentors-item">
    <img src={image} className="mentors-item-avatar" alt={name} />
    <h3 className="mentors-item-title">{name}</h3>
    <p className="mentors-item-description">{description}</p>
  </div>
);

class TopMentors extends Component {
  render() {
    const mentorsList = topMentors.map(({ description, id, image, name}) =>(
      <Mentor
        description={description}
        image={image}
        key={id}
        name={name}
      />
    ));
    return (
      <div className="top-mentors">
        <div className="box">
          <Title head="Our TOP Mentors" />
          <div className="top-mentors-content">
            {mentorsList}
          </div>
        </div>
      </div>
    );
  }
}

export default TopMentors;
