import { useState } from 'react';

import VillaVisualizer from '../shared/VillaVisualizer';
import LandVisualizer from '../shared/LandVisualizer';
import ApartmentVisualizer from '../shared/ApartmentVisualizer';

const UnitVisualizer = ({ units = [], grouped = {}, stats = {}, property, onUnitClick }) => {
  const category = property?.category?.toLowerCase();

  if (category === 'villa') {
    return <VillaVisualizer property={property} />;
  }

  if (category === 'land') {
    return <LandVisualizer property={property} />;
  }

  return (
    <ApartmentVisualizer
      units={units}
      grouped={grouped}
      stats={stats}
      property={property}
      onUnitClick={onUnitClick}
    />
  );
};

export default UnitVisualizer;
