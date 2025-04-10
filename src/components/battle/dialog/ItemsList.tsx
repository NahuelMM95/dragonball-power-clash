
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pill } from "lucide-react";
import { Item } from "@/types/game";

type ItemsListProps = {
  items: Item[];
  onBack: () => void;
  onSelectItem: (itemId: string) => void;
};

const ItemsList = ({ items, onBack, onSelectItem }: ItemsListProps) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="font-bold">Items</h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onBack}
        >
          Back
        </Button>
      </div>
      
      {items.map((item) => (
        <Button 
          key={item.id}
          variant="default"
          className="w-full justify-between bg-green-600 hover:bg-green-700"
          onClick={() => onSelectItem(item.id)}
        >
          <div className="flex items-center">
            <Pill className="mr-2 h-4 w-4" />
            <span>{item.name}</span>
          </div>
          <div className="flex items-center">
            {item.quantity > 1 && (
              <Badge variant="outline" className="mr-2">
                x{item.quantity}
              </Badge>
            )}
            <span className="text-xs bg-green-500 px-2 py-0.5 rounded-full">Use</span>
          </div>
        </Button>
      ))}
    </div>
  );
};

export default ItemsList;
