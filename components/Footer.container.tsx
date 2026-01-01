import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FooterView } from './Footer.view';

const FooterContainer: React.FC = () => {
  const navigate = useNavigate();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubscribed(true);
  };

  return (
    <FooterView 
      email={email}
      setEmail={setEmail}
      isSubscribed={isSubscribed}
      onSubscribe={handleSubscribe}
    />
  );
};

export default FooterContainer;