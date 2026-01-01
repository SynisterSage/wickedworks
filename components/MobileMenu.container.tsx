import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileMenuView } from './MobileMenu.view';
import { NAV_ITEMS } from '../constants';
import { useArchives } from '../hooks/useArchives';

interface MobileMenuContainerProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenuContainer: React.FC<MobileMenuContainerProps> = (props) => {
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const { upcoming, vaulted, loading } = useArchives();

  useEffect(() => {
    if (props.isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [props.isOpen]);

  const handleToggleSection = (label: string) => {
    setExpandedSection(expandedSection === label ? null : label);
  };

  return (
    <MobileMenuView 
      isOpen={props.isOpen}
      onClose={props.onClose}
      navItems={NAV_ITEMS}
      expandedSection={expandedSection}
      onToggleSection={handleToggleSection}
      archiveData={{ upcoming, vaulted, loading }}
    />
  );
};

export default MobileMenuContainer;