
import { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { useBattle } from '@/contexts/BattleContext';
import { useSettings } from '@/hooks/useSettings';
import { abbreviateNumber } from '@/utils/numberAbbreviation';
import { Dialog } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ForestZone from '../battle/ForestZone';
import DesertZone from '../battle/DesertZone';
import BattleDialogContent from '../battle/BattleDialogContent';
import WastelandZone from '../battle/WastelandZone';
import CrystalCaveZone from '../battle/CrystalCaveZone';

const WildernessZones = () => {
  const { powerLevel } = useGame();
  const { fightResult, clearFightResult, battleState } = useBattle();
  const { settings } = useSettings();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeZone, setActiveZone] = useState('forest');

  const handleCloseDialog = () => {
    clearFightResult();
    setDialogOpen(false);
  };

  return (
    <div>
      <Tabs value={activeZone} onValueChange={setActiveZone} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="forest" className="text-xs">Forest</TabsTrigger>
          <TabsTrigger value="desert" className="text-xs">Desert</TabsTrigger>
          <TabsTrigger value="crystal-cave" className="text-xs">Crystal</TabsTrigger>
          <TabsTrigger value="wasteland" className="text-xs">Wasteland</TabsTrigger>
        </TabsList>
        
        <TabsContent value="forest">
          <ForestZone />
        </TabsContent>
        
        <TabsContent value="desert">
          <DesertZone />
        </TabsContent>
        
        <TabsContent value="crystal-cave">
          <CrystalCaveZone />
        </TabsContent>

        <TabsContent value="wasteland">
          <WastelandZone />
        </TabsContent>
      </Tabs>
      
      <p className="text-sm text-center text-gray-600 mt-4">Your current power level: {abbreviateNumber(powerLevel, settings.numberAbbreviation)}</p>

      <Dialog 
        open={dialogOpen || battleState.inProgress} 
        onOpenChange={(open) => {
          if (battleState.inProgress) return;
          if (!open) handleCloseDialog();
          setDialogOpen(open);
        }}
      >
        <BattleDialogContent 
          battleState={battleState} 
          fightResult={fightResult} 
          handleCloseDialog={handleCloseDialog} 
        />
      </Dialog>
    </div>
  );
};

export default WildernessZones;
