import {
  Car,
  Home,
  Shirt,
  Newspaper,
  MonitorSmartphone,
  Gamepad2,
  Users,
  Gift,
  Trees,
  Palette,
  Armchair,
  Wrench,
  Building2,
  Music,
  Printer,
  PawPrint,
  Bike,
  Puzzle,
  MessagesSquare,
} from 'lucide-react';

export function CategoryIcon({
  name,
  className = 'w-5 h-5',
}: {
  name: string;
  className?: string;
}) {
  switch (name) {
    case 'Vehicles':
      return <Car className={className} />;
    case 'Property Rentals':
      return <Building2 className={className} />;
    case 'Apparel':
      return <Shirt className={className} />;
    case 'Classifieds':
      return <Newspaper className={className} />;
    case 'Electronics':
      return <MonitorSmartphone className={className} />;
    case 'Entertainment':
      return <Gamepad2 className={className} />;
    case 'Family':
      return <Users className={className} />;
    case 'Free Stuff':
      return <Gift className={className} />;
    case 'Garden & Outdoor':
      return <Trees className={className} />;
    case 'Hobbies':
      return <Palette className={className} />;
    case 'Home Goods':
      return <Armchair className={className} />;
    case 'Home Improvement':
      return <Wrench className={className} />;
    case 'Home Sales':
      return <Home className={className} />;
    case 'Musical Instruments':
      return <Music className={className} />;
    case 'Office Supplies':
      return <Printer className={className} />;
    case 'Pet Supplies':
      return <PawPrint className={className} />;
    case 'Sporting Goods':
      return <Bike className={className} />;
    case 'Toys & Games':
      return <Puzzle className={className} />;
    case 'Buy and sell groups':
      return <MessagesSquare className={className} />;
    default:
      return <MonitorSmartphone className={className} />;
  }
}
