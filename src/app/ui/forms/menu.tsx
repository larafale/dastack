import { Button } from "@/components/ui/button"
import React from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import Section from "@/components/section"
import { cn } from "@/lib/utils"
import { useQueryState, parseAsArrayOf, parseAsString, parseAsBoolean } from "nuqs"

interface MenuProps {
  items: { key: string }[];
  onFilterChange: (selectedItems: string[]) => void;
  onDebugChange: (enabled: boolean) => void;
  debug: boolean;
  className?: string;
}

const Menu = ({ items = [], onFilterChange, onDebugChange, debug, className }: MenuProps) => {
  const [selected, setSelected] = useQueryState('selected', parseAsArrayOf(parseAsString).withDefault([]));
  const [showAll, setShowAll] = useQueryState('showAll', parseAsBoolean.withDefault(true));

  const handleToggle = (key: string) => {
    if (selected.includes(key) && selected.length === 1) {
      setShowAll(true);
      setSelected([]);
      onFilterChange([]);
    } else {
      setShowAll(false);
      setSelected([key]);
      onFilterChange([key]);
    }
  };

  const handleAllToggle = () => {
    setShowAll(!showAll);
    if (!showAll) {
      setSelected([]);
      onFilterChange([]);
    } else {
      setSelected(items.map(item => item.key));
      onFilterChange(items.map(item => item.key));
    }
  };

  return (
    <Section className={cn("flex overflow-x-scroll", className)}>
      <div className="flex gap-2 w-full">
        <Button
          variant={showAll ? "default" : "outline"}
          onClick={handleAllToggle}
          className="capitalize w-full"
        >
          All
        </Button>
        {items.map((item) => (
          <Button
            key={item.key}
            variant={selected.includes(item.key) ? "default" : "outline"}
            onClick={() => handleToggle(item.key)}
            className="capitalize w-full"
          >
            {item.key}
          </Button>
        ))}
      </div>
      <div className="flex hidden md:flex items-center space-x-2 mt-4">
        <Switch
          id="debug-mode"
          checked={debug}
          onCheckedChange={onDebugChange}
        />
        <Label htmlFor="debug-mode">debug</Label>
      </div>
    </Section>
  );
};

export default Menu;
