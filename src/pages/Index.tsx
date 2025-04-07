
import { GameProvider } from "@/contexts/GameContext";
import DragonBall from "@/components/DragonBall";
import PowerLevel from "@/components/PowerLevel";
import TrainingUpgrades from "@/components/TrainingUpgrades";
import BattleZone from "@/components/BattleZone";

const Index = () => {
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Training */}
            <div className="md:col-span-1">
              <TrainingUpgrades />
            </div>
            
            {/* Middle column - Dragon Ball Clicker */}
            <div className="md:col-span-1">
              <div className="flex flex-col items-center">
                <DragonBall />
                <div className="mt-6 w-full">
                  <PowerLevel />
                </div>
              </div>
            </div>
            
            {/* Right column - Battle Zone */}
            <div className="md:col-span-1">
              <BattleZone />
            </div>
          </div>
        </div>
        
        <footer className="text-center mt-12 text-sm text-gray-600">
          <p>Click the Dragon Ball to increase your power level!</p>
        </footer>
      </div>
    </GameProvider>
  );
};

export default Index;
