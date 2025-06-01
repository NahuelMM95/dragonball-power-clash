
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import WildernessZones from './fight/WildernessZones';
import StoryModeMenu from './fight/StoryModeMenu';

const FightMenu = () => {
  const [activeTab, setActiveTab] = useState("wilderness");

  return (
    <div className="bg-white/90 p-4 rounded-lg shadow-md backdrop-blur-sm border-2 border-forestGreen">
      <h2 className="text-xl font-bold text-forestGreen mb-4">Fight</h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="wilderness">Wilderness</TabsTrigger>
          <TabsTrigger value="story">Story Mode</TabsTrigger>
        </TabsList>
        
        <TabsContent value="wilderness">
          <WildernessZones />
        </TabsContent>
        
        <TabsContent value="story">
          <StoryModeMenu />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FightMenu;
