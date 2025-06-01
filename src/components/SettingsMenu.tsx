
import { useState } from 'react';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings, Trash2, Wand2, Moon, Sun, Hash } from "lucide-react";
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
      <SheetContent side="left" className="dark:bg-gray-900">
        <SheetHeader>
          <SheetTitle className="dark:text-gray-100">Settings</SheetTitle>
          <SheetDescription className="dark:text-gray-300">
            Configure your game settings
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          {/* Game Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium dark:text-gray-100">Appearance & Display</h3>
            
            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {settings.darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                <Label htmlFor="dark-mode" className="dark:text-gray-200">Dark Mode</Label>
              </div>
              <Switch
                id="dark-mode"
                checked={settings.darkMode}
                onCheckedChange={(checked) => updateSetting('darkMode', checked)}
              />
            </div>
            
            {/* Number Abbreviation Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Hash className="h-4 w-4" />
                <Label htmlFor="number-abbreviation" className="dark:text-gray-200">Number Abbreviation</Label>
              </div>
              <Switch
                id="number-abbreviation"
                checked={settings.numberAbbreviation}
                onCheckedChange={(checked) => updateSetting('numberAbbreviation', checked)}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Show large numbers as 1K, 1M, 1B instead of full numbers
            </p>
          </div>

          {cheatsUnlocked && (
            <div className="space-y-4 border-2 border-amber-300 dark:border-amber-600 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20">
              <h3 className="text-lg font-medium text-amber-700 dark:text-amber-300">Cheats Enabled</h3>
              
              <div className="space-y-2">
                <Label htmlFor="power-level-input" className="dark:text-gray-200">Set Power Level:</Label>
                <div className="flex space-x-2">
                  <Input 
                    id="power-level-input"
                    value={powerLevelInput}
                    onChange={(e) => setPowerLevelInput(e.target.value)}
                    placeholder={powerLevel.toString()}
                    type="number"
                    min="0"
                    className="dark:bg-gray-800 dark:text-gray-100"
                  />
                  <Button onClick={handleSetPowerLevel}>Set</Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="zeni-input" className="dark:text-gray-200">Set Zeni:</Label>
                <div className="flex space-x-2">
                  <Input 
                    id="zeni-input"
                    value={zeniInput}
                    onChange={(e) => setZeniInput(e.target.value)}
                    placeholder={zeni.toString()}
                    type="number"
                    min="0"
                    className="dark:bg-gray-800 dark:text-gray-100"
                  />
                  <Button onClick={handleSetZeni}>Set</Button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-lg font-medium dark:text-gray-100">Reset Progress</h3>
            <p className="text-sm text-muted-foreground dark:text-gray-400">
              Deleting your progress will reset all your power levels, skills, 
              items, and upgrades. This action cannot be undone.
            </p>
            
            <div className="space-y-2">
              <Label htmlFor="delete-confirm" className="dark:text-gray-200">
                Type DELETE to confirm reset:
              </Label>
              <Input 
                id="delete-confirm"
                value={deleteText}
                onChange={(e) => setDeleteText(e.target.value)}
                placeholder="DELETE"
                className="dark:bg-gray-800 dark:text-gray-100"
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
            <h3 className="text-lg font-medium dark:text-gray-100">Cheats</h3>
            <p className="text-sm text-muted-foreground dark:text-gray-400">
              Enter the secret password to unlock power boosts.
            </p>
            
            <div className="space-y-2">
              <Label htmlFor="cheat-confirm" className="dark:text-gray-200">
                Enter cheat password:
              </Label>
              <Input 
                id="cheat-confirm"
                value={cheatText}
                onChange={(e) => setCheatText(e.target.value)}
                placeholder="Enter password"
                type="password"
                className="dark:bg-gray-800 dark:text-gray-100"
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
