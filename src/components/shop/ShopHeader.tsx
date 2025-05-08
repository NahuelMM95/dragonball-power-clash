
import { useGame } from "@/contexts/GameContext";
import { Badge } from "@/components/ui/badge";

const ShopHeader = () => {
  const { zeni } = useGame();
  
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold text-dbBlue">Shop</h2>
      <Badge variant="outline" className="text-amber-600 border-amber-600">
        <span className="text-yellow-500 font-bold">₽</span> {zeni.toLocaleString('en')} Zeni
      </Badge>
    </div>
  );
};

export default ShopHeader;
