
import { useState } from 'react';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings, Trash2, Wand2, Hash } from "lucide-react";
import { useGame } from '@/contexts/GameContext';
import { useItems } from '@/contexts/ItemContext';
import { useBattle } from '@/contexts/BattleContext';
import { useUpgrades } from '@/contexts/UpgradeContext';
import { useSettings } from '@/hooks/useSettings';
import { toast } from "sonner";

interface SettingsMenuProps {
  onCheatsUnlocked?: () => void;
}

const SettingsMenu = ({ onCheatsUnlocked }: SettingsMenuProps) => {
  const { resetProgress, setPowerLevel, setZeni, powerLevel, zeni } = useGame();
  const { setInventory, setEquippedItems, setActiveBuffs } = useItems();
  const { resetSkills } = useBattle();
  const { resetUpgrades } = useUpgrades();
  const { settings, updateSetting } = useSettings();
  const [deleteText, setDeleteText] = useState('');
  const [cheatText, setCheatText] = useState('');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [cheatsUnlocked, setCheatsUnlocked] = useState(false);
  const [powerLevelInput, setPowerLevelInput] = useState('');
  const [zeniInput, setZeniInput] = useState('');

  const handleReset = () => {
    if (deleteText === 'DELETE') {
      resetProgress();
      setInventory([]);
      setEquippedItems([]);
      setActiveBuffs([]);
      resetSkills();
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
        description: "Power level and zeni setters are now available in the settings menu."
      });
    } else {
      toast.error("Incorrect password", {
        description: "The cheat code was incorrect."
      });
    }
  };

  const handleSetPowerLevel = () => {
    const newPowerLevel = parseInt(powerLevelInput);
    if (isNaN(newPowerLevel) || newPowerLevel < 0) {
      toast.error("Invalid power level", {
        description: "Please enter a valid positive number."
      });
      return;
    }
    
    setPowerLevel(newPowerLevel);
    setPowerLevelInput('');
    toast.success(`Power level set to ${newPowerLevel.toLocaleString('en')}`, {
      description: "Your power level has been updated."
    });
  };

  const handleSetZeni = () => {
    const newZeni = parseInt(zeniInput);
    if (isNaN(newZeni) || newZeni < 0) {
      toast.error("Invalid zeni amount", {
        description: "Please enter a valid positive number."
      });
      return;
    }
    
    setZeni(newZeni);
    setZeniInput('');
    toast.success(`Zeni set to ${newZeni.toLocaleString('en')}`, {
      description: "Your zeni has been updated."
    });
  };

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="absolute top-4 left-4 z-10">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="bg-gray-50">
        <SheetHeader>
          <SheetTitle className="text-sm">Settings</SheetTitle>
          <SheetDescription className="text-xs">
            Configure your game settings
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Display Settings</h3>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Hash className="h-4 w-4" />
                <Label htmlFor="number-abbreviation" className="text-xs">Number Abbreviation</Label>
              </div>
              <Switch
                id="number-abbreviation"
                checked={settings.numberAbbreviation}
                onCheckedChange={(checked) => updateSetting('numberAbbreviation', checked)}
              />
            </div>
            <p className="text-xs text-gray-500">
              Show large numbers as 1K, 1M, 1B instead of full numbers
            </p>
          </div>

          {cheatsUnlocked && (
            <div className="space-y-4 border-2 border-amber-300 p-4 rounded-lg bg-amber-50">
              <h3 className="text-sm font-medium text-amber-700">Cheats Enabled</h3>
              
              <div className="space-y-2">
                <Label htmlFor="power-level-input" className="text-xs">Set Power Level:</Label>
                <div className="flex space-x-2">
                  <Input 
                    id="power-level-input"
                    value={powerLevelInput}
                    onChange={(e) => setPowerLevelInput(e.target.value)}
                    placeholder={powerLevel.toString()}
                    type="number"
                    min="0"
                    className="text-xs"
                  />
                  <Button onClick={handleSetPowerLevel} className="text-xs">Set</Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="zeni-input" className="text-xs">Set Zeni:</Label>
                <div className="flex space-x-2">
                  <Input 
                    id="zeni-input"
                    value={zeniInput}
                    onChange={(e) => setZeniInput(e.target.value)}
                    placeholder={zeni.toString()}
                    type="number"
                    min="0"
                    className="text-xs"
                  />
                  <Button onClick={handleSetZeni} className="text-xs">Set</Button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Reset Progress</h3>
            <p className="text-xs text-muted-foreground">
              Deleting your progress will reset all your power levels, skills, 
              items, and upgrades. This action cannot be undone.
            </p>
            
            <div className="space-y-2">
              <Label htmlFor="delete-confirm" className="text-xs">
                Type DELETE to confirm reset:
              </Label>
              <Input 
                id="delete-confirm"
                value={deleteText}
                onChange={(e) => setDeleteText(e.target.value)}
                placeholder="DELETE"
                className="text-xs"
              />
              
              <Button 
                variant="destructive" 
                onClick={handleReset}
                className="w-full text-xs"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Reset All Progress
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Cheats</h3>
            <p className="text-xs text-muted-foreground">
              Enter the secret password to unlock power boosts.
            </p>
            
            <div className="space-y-2">
              <Label htmlFor="cheat-confirm" className="text-xs">
                Enter cheat password:
              </Label>
              <Input 
                id="cheat-confirm"
                value={cheatText}
                onChange={(e) => setCheatText(e.target.value)}
                placeholder="Enter password"
                type="password"
                className="text-xs"
              />
              
              <Button 
                variant="secondary" 
                onClick={handleCheats}
                className="w-full text-xs"
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
