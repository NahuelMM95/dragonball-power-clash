
import { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Dialog } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ForestZone from './battle/ForestZone';
import DesertZone from './battle/DesertZone';
import BattleDialogContent from './battle/BattleDialogContent';

const BattleZone = () => {
  const { 
    powerLevel, 
    fightResult, 
    clearFightResult, 
    battleState
  } = useGame();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeZone, setActiveZone] = useState('forest');

  const handleCloseDialog = () => {
    clearFightResult();
    setDialogOpen(false);
  };

  return (
    <div className="bg-white/90 p-4 rounded-lg shadow-md backdrop-blur-sm border-2 border-forestGreen">
      <h2 className="text-xl font-bold text-forestGreen mb-4">Battle Zone</h2>
      
      <Tabs value={activeZone} onValueChange={setActiveZone} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="forest">Forest</TabsTrigger>
          <TabsTrigger value="desert">Desert</TabsTrigger>
        </TabsList>
        
        <TabsContent value="forest">
          <ForestZone />
        </TabsContent>
        
        <TabsContent value="desert">
          <DesertZone />
        </TabsContent>
      </Tabs>
      
      <p className="text-sm text-center text-gray-600">Your current power level: {powerLevel}</p>

      {/* Battle Result Dialog */}
      <Dialog open={dialogOpen || battleState.inProgress} onOpenChange={(open) => {
        if (!open) handleCloseDialog();
        setDialogOpen(open);
      }}>
        <BattleDialogContent 
          battleState={battleState} 
          fightResult={fightResult} 
          handleCloseDialog={handleCloseDialog} 
        />
      </Dialog>
    </div>
  );
};

export default BattleZone;
