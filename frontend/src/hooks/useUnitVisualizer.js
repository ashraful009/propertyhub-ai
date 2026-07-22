import { useState } from 'react';

export const useUnitVisualizer = () => {
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [activeFilter, setActiveFilter] = useState('ALL');

  const selectUnit = (unit) => setSelectedUnit(unit);
  const clearSelectedUnit = () => setSelectedUnit(null);

  return {
    selectedUnit,
    selectUnit,
    clearSelectedUnit,
    activeFilter,
    setActiveFilter,
  };
};
