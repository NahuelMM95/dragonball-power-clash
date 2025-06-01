
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sword } from "lucide-react";

const StoryModeMenu = () => {
  return (
    <div className="text-center">
      <h3 className="text-lg font-semibold mb-4">Story Mode</h3>
      <p className="text-gray-600 mb-6">
        Defeat enemies in the order they appeared in the anime!
      </p>
      
      <Link to="/story">
        <Button className="gap-2 bg-orange-500 hover:bg-orange-600 text-white">
          <Sword className="h-4 w-4" />
          Enter Story Mode
        </Button>
      </Link>
    </div>
  );
};

export default StoryModeMenu;
