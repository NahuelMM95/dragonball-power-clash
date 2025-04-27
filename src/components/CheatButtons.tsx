
import { Button } from "@/components/ui/button";
import { useGame } from '@/contexts/GameContext';

const CheatButtons = () => {
  const { powerLevel, setPowerLevel } = useGame();

  const addPower = (amount: number) => {
    setPowerLevel(powerLevel + amount);
  };

  return (
    <div className="flex flex-wrap gap-2 justify-center mt-4 max-w-md mx-auto">
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => addPower(1)}
        className="bg-dbBlue/10 hover:bg-dbBlue/20"
      >
        +1 Power
      </Button>
      <Button 
        variant="outline"
        size="sm"
        onClick={() => addPower(10)}
        className="bg-dbBlue/10 hover:bg-dbBlue/20"
      >
        +10 Power
      </Button>
      <Button 
        variant="outline"
        size="sm"
        onClick={() => addPower(100)}
        className="bg-dbBlue/10 hover:bg-dbBlue/20"
      >
        +100 Power
      </Button>
      <Button 
        variant="outline"
        size="sm"
        onClick={() => addPower(1000)}
        className="bg-dbBlue/10 hover:bg-dbBlue/20"
      >
        +1000 Power
      </Button>
    </div>
  );
};

export default CheatButtons;
