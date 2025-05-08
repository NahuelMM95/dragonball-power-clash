
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ShopHeader from "@/components/shop/ShopHeader";
import TrainingGearTab from "@/components/shop/TrainingGearTab";
import SkillsTab from "@/components/shop/SkillsTab";
import ItemsTab from "@/components/shop/ItemsTab";

const TrainingUpgrades = () => {
  return (
    <div className="bg-white/90 p-4 rounded-lg shadow-md backdrop-blur-sm border-2 border-dbBlue">
      <ShopHeader />
      
      <Tabs defaultValue="training-gear">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="training-gear">Training Gear</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="items">Items</TabsTrigger>
        </TabsList>
        
        <TabsContent value="training-gear" className="mt-1">
          <TrainingGearTab />
        </TabsContent>
        
        <TabsContent value="skills" className="mt-1">
          <SkillsTab />
        </TabsContent>
        
        <TabsContent value="items" className="mt-1">
          <ItemsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrainingUpgrades;
