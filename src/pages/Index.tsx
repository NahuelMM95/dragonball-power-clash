
import { useState } from "react";
import { GameProvider, GameContextWrapper, useGame } from "@/contexts/GameContext";
import { useItems } from "@/contexts/ItemContext";
import { useBattle } from "@/contexts/BattleContext";
import { useUpgrades } from "@/contexts/UpgradeContext";
import { useSettings } from "@/hooks/useSettings";
import { abbreviateNumber } from "@/utils/numberAbbreviation";
import DragonBall from "@/components/DragonBall";
import PowerLevel from "@/components/PowerLevel";
import TrainingUpgrades from "@/components/TrainingUpgrades";
import FightMenu from "@/components/FightMenu";
import SettingsMenu from "@/components/SettingsMenu";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import CheatButtons from "@/components/CheatButtons";

const ActiveBuffsIndicator = () => {
  const { inventory, activeBuffs } = useItems();
  const { settings } = useSettings();
  
  if (!activeBuffs || activeBuffs.length === 0) return null;
  
  const now = Date.now();
  const currentBuffs = activeBuffs.filter(buff => buff.endTime > now);
  
  if (currentBuffs.length === 0) return null;
  
  return (
    <div className="mt-4">
      <div className="flex items-center gap-2">
        {currentBuffs.map(buff => {
          const item = inventory.find(i => i.id === buff.id);
          const timeLeft = Math.ceil((buff.endTime - now) / 1000);
          
          if (!item) return null;
          
          return (
            <TooltipProvider key={buff.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="h-8 w-8 bg-red-500 rounded-full flex items-center justify-center cursor-help">
                    <span className="text-white text-xs font-bold">{timeLeft}s</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p><strong>{item.name}</strong></p>
                  <p>{item.description}</p>
                  <p>Time remaining: {timeLeft}s</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>
    </div>
  );
};

const GameContent = () => {
  const [activeTab, setActiveTab] = useState("main");
  const [cheatsVisible, setCheatsVisible] = useState(false);
  
  return (
    <div className="min-h-screen py-4 px-4 sm:px-6 bg-gradient-to-b from-orange-100 to-yellow-100">
      <SettingsMenu onCheatsUnlocked={() => setCheatsVisible(true)} />
      
      <header className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-dragonOrange drop-shadow-md">
          DRAGON BALL POWER CLASH
        </h1>
        <p className="text-xs mt-2 text-gray-700">Click to power up and become the strongest warrior!</p>
      </header>
      
      <div className="max-w-4xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6 mx-auto max-w-md bg-white/80">
            <TabsTrigger value="main" className="text-xs font-bold">Main</TabsTrigger>
            <TabsTrigger value="training" className="text-xs font-bold">Shop</TabsTrigger>
            <TabsTrigger value="fight" className="text-xs font-bold">Fight</TabsTrigger>
          </TabsList>
          
          <TabsContent value="main" className="mt-4">
            <div className="flex flex-col items-center space-y-4">
              <DragonBall />
              <ActiveBuffsIndicator />
              <div className="w-full max-w-md mx-auto">
                <PowerLevel />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="training" className="mt-4">
            <div className="max-w-md mx-auto">
              <TrainingUpgrades />
            </div>
          </TabsContent>
          
          <TabsContent value="fight" className="mt-4">
            <div className="max-w-md mx-auto">
              <FightMenu />
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <footer className="text-center mt-8 text-xs text-gray-600">
        <p>Click the Dumbbell to increase your power level!</p>
      </footer>
    </div>
  );
};

const Index = () => {
  return (
    <GameProvider>
      <GameContextWrapper>
        <GameContent />
      </GameContextWrapper>
    </GameProvider>
  );
};

export default Index;
