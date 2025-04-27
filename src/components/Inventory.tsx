
import { useGame } from '@/contexts/GameContext';
import { useItems } from '@/contexts/ItemContext';
import { Sword, Weight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

const Inventory = () => {
  const { inventory, equippedItems, equipItem, useItem } = useItems();

  const renderEquipmentSlot = (slotType: string, item: any | null) => {
    return (
      <div className="flex flex-col items-center gap-1">
        <p className="text-xs text-muted-foreground uppercase tracking-wider">{slotType}</p>
        <div className="w-16 h-16 border-2 border-forestGreen/30 rounded-lg flex items-center justify-center bg-background/50 hover:bg-accent/20 transition-colors">
          {item ? (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="w-full h-full p-0 m-0 group">
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">
                      {item.type === 'weapon' ? '🗡️' : '🏋️'}
                    </div>
                    <span className="text-xs text-foreground/80 group-hover:text-foreground transition-colors">
                      {item.name}
                    </span>
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <div className="space-y-2">
                  <h4 className="font-semibold text-lg">{item.name}</h4>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => equipItem(null, slotType)}
                    className="w-full mt-2"
                  >
                    Remove
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <span className="text-muted-foreground text-sm">Empty</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-background/90 p-4 rounded-lg shadow-md border-2 border-forestGreen/30 backdrop-blur-sm">
      <h2 className="text-2xl font-bold text-forestGreen mb-4 tracking-tight">Inventory</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-forestGreen/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Equipment</CardTitle>
            <CardDescription>Equip items to increase your power</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex flex-col gap-4">
              {renderEquipmentSlot('weapon', equippedItems.find(item => item.slot === 'weapon'))}
              {renderEquipmentSlot('weight', equippedItems.find(item => item.slot === 'weight'))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-forestGreen/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Items</CardTitle>
            <CardDescription>Use or equip collected items</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-3 gap-2">
              {inventory.length > 0 ? (
                inventory.map((item, index) => (
                  <Popover key={index}>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="h-16 w-16 p-0 relative group hover:bg-accent/20 transition-colors"
                      >
                        <div className="flex flex-col items-center justify-center">
                          <div className="text-xl mb-1 group-hover:scale-110 transition-transform">
                            {item.type === 'weapon' ? '🗡️' : 
                             item.type === 'weight' ? '🏋️' : 
                             item.type === 'consumable' ? '🍖' : '❓'}
                          </div>
                          <span className="text-xs text-foreground/80 group-hover:text-foreground transition-colors">
                            {item.name}
                          </span>
                          
                          {/* Quantity Badge */}
                          {item.quantity > 1 && (
                            <Badge 
                              variant="secondary" 
                              className="absolute top-1 right-1 bg-forestGreen/20 text-forestGreen"
                            >
                              {item.quantity}
                            </Badge>
                          )}
                        </div>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold text-lg">{item.name}</h4>
                          {item.quantity > 1 && (
                            <Badge variant="outline">x{item.quantity}</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                        {item.type === 'consumable' ? (
                          <Button 
                            variant="default" 
                            size="sm" 
                            onClick={() => useItem(item.id)}
                            className="w-full mt-2"
                          >
                            Use
                          </Button>
                        ) : (
                          <Button 
                            variant="default" 
                            size="sm" 
                            onClick={() => equipItem(item.id, item.slot)}
                            className="w-full mt-2"
                          >
                            Equip
                          </Button>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                ))
              ) : (
                <div className="col-span-3 text-center py-4 text-muted-foreground">
                  No items in inventory
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Inventory;
