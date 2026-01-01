
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroView } from './Hero.view';

const HeroContainer: React.FC = () => {
  const navigate = useNavigate();
  return (
    <HeroView 
      onExplore={() => navigate('/archives')}
      onFullCollection={() => navigate('/shop')}
    />
  );
};

export default HeroContainer;
