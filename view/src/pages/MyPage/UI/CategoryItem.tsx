import React from 'react';

interface CategoryItemProps {
  category: string;
  isSelected: boolean;
  onClick: () => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  isSelected,
  onClick,
}) => (
  <li
    className={`hover:cursor-pointer mb-3 ${isSelected ? 'font-bold' : ''}`}
    onClick={onClick}
  >
    {category}
  </li>
);

export default CategoryItem;
