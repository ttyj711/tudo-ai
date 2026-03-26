import type { Category } from '../types';

interface CategoryBadgeProps {
  category: Category;
  onClick?: () => void;
  active?: boolean;
}

export default function CategoryBadge({ category, onClick, active }: CategoryBadgeProps) {
  return (
    <span
      onClick={onClick}
      className={`
        text-xs px-2 py-0.5 rounded-full font-medium
        transition-all duration-200
        ${onClick ? 'cursor-pointer hover:scale-105' : ''}
        ${active ? 'ring-2 ring-offset-1' : ''}
      `}
      style={{
        backgroundColor: `${category.color}20`,
        color: category.color,
        borderColor: category.color,
      }}
    >
      {category.name}
    </span>
  );
}
