import React from 'react';
import {
  Apple,
  Croissant,
  UtensilsCrossed,
  Fish,
  Egg,
  Wheat,
  Soup,
  Coffee,
  Cookie,
  Wine,
  Snowflake,
  Sparkles,
  HeartHandshake,
  PawPrint,
  ShoppingBag,
} from 'lucide-react';

interface DepartmentIconProps {
  name: string;
  className?: string;
}

export const DepartmentIcon: React.FC<DepartmentIconProps> = ({ name, className = 'w-5 h-5' }) => {
  switch (name) {
    case 'Apple':
      return <Apple className={className} />;
    case 'Croissant':
      return <Croissant className={className} />;
    case 'UtensilsCrossed':
      return <UtensilsCrossed className={className} />;
    case 'Fish':
      return <Fish className={className} />;
    case 'Egg':
      return <Egg className={className} />;
    case 'Wheat':
      return <Wheat className={className} />;
    case 'Soup':
      return <Soup className={className} />;
    case 'Coffee':
      return <Coffee className={className} />;
    case 'Cookie':
      return <Cookie className={className} />;
    case 'Wine':
      return <Wine className={className} />;
    case 'Snowflake':
      return <Snowflake className={className} />;
    case 'Sparkles':
      return <Sparkles className={className} />;
    case 'HeartHandshake':
      return <HeartHandshake className={className} />;
    case 'PawPrint':
      return <PawPrint className={className} />;
    default:
      return <ShoppingBag className={className} />;
  }
};
