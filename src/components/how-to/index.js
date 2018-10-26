import React, { Component } from 'react';
import Image1 from '../../assets/images/how-to-1.png';
import Image2 from '../../assets/images/how-to-2.png';
import Title from '../title';
import './styles.css';

const howToList = [
  {
    description: 'He has been listed as one of Fast Company’s “Most Innovative Business People,” one of Forbes’s',
    id: 'how-to-1',
    image: Image1,
    name: 'CHOOSE THE BEST TIME AND LOCATION',
  },
  {
    description: 'He has been listed as one of Fast Company’s “Most Innovative Business People,” one of Forbes’s',
    id: 'how-to-2',
    image: Image2,
    name: 'FIND THE BEST MENTOR FOR YOU',
  },
  {
    description: 'He has been listed as one of Fast Company’s “Most Innovative Business People,” one of Forbes’s',
    id: 'how-to-3',
    image: Image2,
    name: 'LEARN AND SUCCCED FASTER',
  },
];

const HowToItem = ({ description, image, name }) => (
  <div className="how-item">
    <img src={image} className="how-item-avatar" alt={name} />
    <h3 className="how-item-title">{name}</h3>
    <p className="how-item-description">{description}</p>
  </div>
);

class HowTo extends Component {
  render() {
    const howTo = howToList.map(({ description, id, image, name}) =>(
      <HowToItem
        description={description}
        image={image}
        key={id}
        name={name}
      />
    ));
    return (
      <div className="how-to">
        <div className="box">
          <Title
            head="Our mentors know (almost) everything"
            description="Whether it’s Entrepreneurship, Rrowth, App development, Design, Marketing or even Cooking, you’ll find a mentor who can help."
          />
          <div className="how-to-content">
            {howTo}
          </div>
        </div>
      </div>
    );
  }
}

export default HowTo;
