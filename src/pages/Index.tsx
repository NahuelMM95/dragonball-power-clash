import { useState } from "react";
import { GameProvider, GameContextWrapper, useGame } from "@/contexts/GameContext";
import { useItems } from "@/contexts/ItemContext";
import { useBattle } from "@/contexts/BattleContext";
import { useUpgrades } from "@/contexts/UpgradeContext";
import DragonBall from "@/components/DragonBall";
import PowerLevel from "@/components/PowerLevel";
import TrainingUpgrades from "@/components/TrainingUpgrades";
import BattleZone from "@/components/BattleZone";
import Inventory from "@/components/Inventory";
import SettingsMenu from "@/components/SettingsMenu";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import CheatButtons from "@/components/CheatButtons";

const ActiveBuffsIndicator = () => {
  const { inventory, activeBuffs } = useItems();
  
  if (!activeBuffs || activeBuffs.length === 0) return null;
  
  // Get current timestamp
  const now = Date.now();
  
  // Filter active buffs
  const currentBuffs = activeBuffs.filter(buff => buff.endTime > now);
  
  if (currentBuffs.length === 0) return null;
  
  return (
    <div className="mt-4">
      <div className="flex items-center gap-2">
        {currentBuffs.map(buff => {
          const item = inventory.find(i => i.id === buff.id);
          const timeLeft = Math.ceil((buff.endTime - now) / 1000); // seconds
          
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
  
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 md:py-12">
      <SettingsMenu />
      
      <header className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-dragonOrange drop-shadow-md">
          DRAGON BALL POWER CLASH
        </h1>
        <p className="text-lg mt-2">Click to power up and become the strongest warrior!</p>
      </header>
      
      <div className="max-w-6xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-8 mx-auto max-w-md">
            <TabsTrigger value="main" className="text-lg">Main</TabsTrigger>
            <TabsTrigger value="training" className="text-lg">Shop</TabsTrigger>
            <TabsTrigger value="battle" className="text-lg">Battle Zone</TabsTrigger>
            <TabsTrigger value="inventory" className="text-lg">Inventory</TabsTrigger>
          </TabsList>
          
          <TabsContent value="main" className="mt-6">
            <div className="flex flex-col items-center">
              <DragonBall />
              <ActiveBuffsIndicator />
              <div className="mt-6 w-full max-w-md mx-auto">
                <PowerLevel />
                <CheatButtons />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="training" className="mt-6">
            <div className="max-w-md mx-auto">
              <TrainingUpgrades />
            </div>
          </TabsContent>
          
          <TabsContent value="battle" className="mt-6">
            <div className="max-w-md mx-auto">
              <BattleZone />
            </div>
          </TabsContent>
          
          <TabsContent value="inventory" className="mt-6">
            <div className="max-w-md mx-auto">
              <Inventory />
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <footer className="text-center mt-12 text-sm text-gray-600">
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
