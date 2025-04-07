
import { useState } from "react";
import { GameProvider } from "@/contexts/GameContext";
import DragonBall from "@/components/DragonBall";
import PowerLevel from "@/components/PowerLevel";
import TrainingUpgrades from "@/components/TrainingUpgrades";
import BattleZone from "@/components/BattleZone";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const Index = () => {
  const [activeTab, setActiveTab] = useState("main");

  return (
    <GameProvider>
      <div className="min-h-screen py-8 px-4 sm:px-6 md:py-12">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-dragonOrange drop-shadow-md">
            DRAGON BALL POWER CLASH
          </h1>
          <p className="text-lg mt-2">Click to power up and become the strongest warrior!</p>
        </header>
        
        <div className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-8 mx-auto max-w-md">
              <TabsTrigger value="main" className="text-lg">Main</TabsTrigger>
              <TabsTrigger value="training" className="text-lg">Training Room</TabsTrigger>
              <TabsTrigger value="battle" className="text-lg">Battle Zone</TabsTrigger>
            </TabsList>
            
            <TabsContent value="main" className="mt-6">
              <div className="flex flex-col items-center">
                <DragonBall />
                <div className="mt-6 w-full max-w-md mx-auto">
                  <PowerLevel />
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
          </Tabs>
        </div>
        
        <footer className="text-center mt-12 text-sm text-gray-600">
          <p>Click the Dragon Ball to increase your power level!</p>
        </footer>
      </div>
    </GameProvider>
  );
};

export default Index;
