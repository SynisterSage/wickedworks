
import React from 'react';
import { MegaMenuView } from './MegaMenu.view';
import { NavItem } from '../types';
import { useArchives } from '../hooks/useArchives';

interface MegaMenuContainerProps {
  item: NavItem;
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onNavigate: (handle?: string) => void;
}

const MegaMenuContainer: React.FC<MegaMenuContainerProps> = (props) => {
  const isArchives = props.item.label.toLowerCase() === 'archives';
  const { upcoming, vaulted, loading } = useArchives();

  return (
    <MegaMenuView 
      {...props} 
      archiveData={isArchives ? { upcoming, vaulted, loading } : undefined}
    />
  );
};

export default MegaMenuContainer;
