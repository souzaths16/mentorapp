import React from 'react';
import Checkbox from '../checkbox';

const skills = [
  'Entrepreneurship',
  'Project Management',
  'Marketing',
  'Web Development',
  'App Development',
  'Software Engineering',
  'Design',
  'User Experience',
  'Leadership',
  'Public Speaking',
  'Fitness',
  'Nutrition',
  'Meditation',
];

const Skills = () => {
  const skillsList = skills.map(skill => (
    <li key={skill} className="checkbox-list">
      <Checkbox checked={true} label={skill} />
    </li>
  ));
  return (
    <ul>
      {skillsList}
    </ul>
  );
}

export default Skills;
