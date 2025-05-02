
import { useState } from 'react';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Trash2, Wand2 } from "lucide-react";
import { useGame } from '@/contexts/GameContext';
import { useItems } from '@/contexts/ItemContext';
import { useBattle } from '@/contexts/BattleContext';
import { useUpgrades } from '@/contexts/UpgradeContext';
import { toast } from "sonner";

interface SettingsMenuProps {
  onCheatsUnlocked?: () => void;
}

const SettingsMenu = ({ onCheatsUnlocked }: SettingsMenuProps) => {
  const { resetProgress } = useGame();
  const { setInventory, setEquippedItems, setActiveBuffs } = useItems();
  const { resetSkills } = useBattle();
  const { resetUpgrades } = useUpgrades();
  const [deleteText, setDeleteText] = useState('');
  const [cheatText, setCheatText] = useState('');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [cheatsUnlocked, setCheatsUnlocked] = useState(false);

  const handleReset = () => {
    if (deleteText === 'DELETE') {
      // Reset all game progress
      resetProgress();
      
      // Reset all inventory and equipment
      setInventory([]);
      setEquippedItems([]);
      setActiveBuffs([]);
      
      // Reset all skills
      resetSkills();
      
      // Reset all upgrades
      resetUpgrades();
      
      setDeleteText('');
      setIsSheetOpen(false);
      toast.success("Progress deleted successfully", {
        description: "Your game has been reset to the beginning."
      });
    } else {
      toast.error("Incorrect confirmation", {
        description: "You must type DELETE correctly to reset your progress."
      });
    }
  };

  const handleCheats = () => {
    if (cheatText === 'Cacahuete') {
      setCheatsUnlocked(true);
      if (onCheatsUnlocked) {
        onCheatsUnlocked();
      }
      setCheatText('');
      toast.success("Cheats unlocked!", {
        description: "Power boost buttons are now available on the main screen."
      });
    } else {
      toast.error("Incorrect password", {
        description: "The cheat code was incorrect."
      });
    }
  };

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="absolute top-4 left-4 z-10">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>
            Configure your game settings
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Reset Progress</h3>
            <p className="text-sm text-muted-foreground">
              Deleting your progress will reset all your power levels, skills, 
              items, and upgrades. This action cannot be undone.
            </p>
            
            <div className="space-y-2">
              <Label htmlFor="delete-confirm">
                Type DELETE to confirm reset:
              </Label>
              <Input 
                id="delete-confirm"
                value={deleteText}
                onChange={(e) => setDeleteText(e.target.value)}
                placeholder="DELETE"
              />
              
              <Button 
                variant="destructive" 
                onClick={handleReset}
                className="w-full"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Reset All Progress
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Cheats</h3>
            <p className="text-sm text-muted-foreground">
              Enter the secret password to unlock power boosts.
            </p>
            
            <div className="space-y-2">
              <Label htmlFor="cheat-confirm">
                Enter cheat password:
              </Label>
              <Input 
                id="cheat-confirm"
                value={cheatText}
                onChange={(e) => setCheatText(e.target.value)}
                placeholder="Enter password"
                type="password"
              />
              
              <Button 
                variant="secondary" 
                onClick={handleCheats}
                className="w-full"
              >
                <Wand2 className="mr-2 h-4 w-4" />
                Unlock Cheats
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SettingsMenu;
