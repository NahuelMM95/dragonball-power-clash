
import { useGame } from '@/contexts/GameContext';
import { useItems } from '@/contexts/ItemContext';
import { Sword } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

const Inventory = () => {
  const { inventory, equippedItems, equipItem, useItem } = useItems();

  const renderEquipmentSlot = (slotType: string, item: any | null) => {
    return (
      <div className="flex flex-col items-center gap-1">
        <p className="text-xs text-muted-foreground">{slotType}</p>
        <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center bg-gray-100">
          {item ? (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="w-full h-full p-0 m-0">
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-xl mb-1">
                      {item.type === 'weapon' ? '🗡️' : '🏋️'}
                    </div>
                    <span className="text-xs">{item.name}</span>
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <div className="space-y-2">
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm">{item.description}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => equipItem(null, slotType)}
                    className="w-full"
                  >
                    Remove
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <span className="text-gray-400">Empty</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white/90 p-4 rounded-lg shadow-md backdrop-blur-sm border-2 border-forestGreen">
      <h2 className="text-xl font-bold text-forestGreen mb-4">Inventory</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <Card>
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
        
        <Card>
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
                      <Button variant="ghost" className="h-16 w-16 p-0 relative">
                        <div className="flex flex-col items-center justify-center">
                          <div className="text-xl mb-1">
                            {item.type === 'weapon' ? '🗡️' : 
                             item.type === 'weight' ? '🏋️' : 
                             item.type === 'consumable' ? '🍖' : '❓'}
                          </div>
                          <span className="text-xs">{item.name}</span>
                          
                          {/* Quantity Badge */}
                          {item.quantity > 1 && (
                            <Badge variant="secondary" className="absolute top-1 right-1">
                              {item.quantity}
                            </Badge>
                          )}
                        </div>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">{item.name}</h4>
                          {item.quantity > 1 && (
                            <Badge variant="outline">x{item.quantity}</Badge>
                          )}
                        </div>
                        <p className="text-sm">{item.description}</p>
                        {item.type === 'consumable' ? (
                          <Button 
                            variant="default" 
                            size="sm" 
                            onClick={() => useItem(item.id)}
                            className="w-full"
                          >
                            Use
                          </Button>
                        ) : (
                          <Button 
                            variant="default" 
                            size="sm" 
                            onClick={() => equipItem(item.id, item.slot)}
                            className="w-full"
                          >
                            Equip
                          </Button>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                ))
              ) : (
                <div className="col-span-3 text-center py-4 text-gray-500">
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
