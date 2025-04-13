import Link from 'next/link';
import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from '@/components/ui/menubar';
import { MenuItem } from '../nav-data';

interface MenuComponentProps {
  label: string;
  items: MenuItem[];
}

const MenuComponent = ({ label, items }: MenuComponentProps) => {
  return (
    <MenubarMenu>
      <MenubarTrigger>{label}</MenubarTrigger>
      <MenubarContent>
        {items.map((item, index) => (
          <MenubarItem key={index}>
            <Link href={item.href} className="w-full">
              {item.label}
            </Link>
          </MenubarItem>
        ))}
      </MenubarContent>
    </MenubarMenu>
  );
};

export default MenuComponent; 