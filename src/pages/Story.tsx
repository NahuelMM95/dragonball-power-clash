
import { useState } from "react";
import { GameProvider, GameContextWrapper, useGame } from "@/contexts/GameContext";
import { useBattle } from "@/contexts/BattleContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DragonBallZStory from "@/components/story/DragonBallZStory";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const StoryContent = () => {
  const [activeSaga, setActiveSaga] = useState("dbz");
  const { powerLevel } = useGame();
  
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 md:py-12">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-dragonOrange drop-shadow-md">
          DRAGON BALL STORY MODE
        </h1>
        <p className="text-lg mt-2">Defeat enemies in the order they appeared in the anime!</p>
      </header>
      
      <div className="max-w-6xl mx-auto">
        <Tabs value={activeSaga} onValueChange={setActiveSaga} className="w-full">
          <TabsList className="grid grid-cols-1 mb-8 mx-auto max-w-md">
            <TabsTrigger value="dbz" className="text-lg">Dragon Ball Z</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dbz" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Saiyan Saga</CardTitle>
                <CardDescription>
                  Battle against the first Saiyans that arrived on Earth
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DragonBallZStory />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="text-center mt-8">
        <p className="text-sm text-gray-600">Your current power level: {powerLevel.toLocaleString('en')}</p>
      </div>
    </div>
  );
};

const Story = () => {
  return (
    <GameProvider>
      <GameContextWrapper>
        <StoryContent />
      </GameContextWrapper>
    </GameProvider>
  );
};

export default Story;
