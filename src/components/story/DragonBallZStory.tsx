
import { useState, useEffect } from "react";
import { useGame } from "@/contexts/GameContext";
import { useBattle } from "@/contexts/BattleContext";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import BattleDialogContent from "@/components/battle/BattleDialogContent";
import { dbzEnemies } from "@/data/storyEnemies";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const DragonBallZStory = () => {
  const { powerLevel } = useGame();
  const { fightResult, clearFightResult, battleState, startBattle } = useBattle();
  const [progress, setProgress] = useState<number>(0);

  // Get progress from localStorage on component mount
  useEffect(() => {
    const savedProgress = localStorage.getItem("dbzStoryProgress");
    if (savedProgress) {
      setProgress(parseInt(savedProgress));
    }
  }, []);

  // Save progress to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("dbzStoryProgress", progress.toString());
  }, [progress]);

  const handleCloseDialog = () => {
    clearFightResult();
    // If the fight was won, update progress
    if (fightResult?.won) {
      setProgress(currentProgress => Math.max(currentProgress, currentEnemy.id + 1));
    }
  };

  const handleFightEnemy = (enemy) => {
    // Directly use the startBattle function with the selected enemy
    startBattle(enemy);
  };

  // Get current enemy based on progress
  const currentEnemy = dbzEnemies.find(enemy => enemy.id === progress) || dbzEnemies[0];
  const nextEnemy = dbzEnemies.find(enemy => enemy.id === progress + 1);

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <Link to="/">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <ArrowLeft size={16} /> Back to Main Screen
          </Button>
        </Link>
      </div>

      {dbzEnemies.map((enemy, index) => {
        const isCompleted = progress > enemy.id;
        const isCurrent = progress === enemy.id;
        const isLocked = progress < enemy.id;

        return (
          <div 
            key={enemy.id} 
            className={`p-4 border rounded-lg ${
              isCompleted ? "bg-green-100 border-green-300" : 
              isCurrent ? "bg-white border-blue-300 shadow-md" : 
              "bg-gray-100 border-gray-300"
            } transition-all`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`font-bold ${isLocked ? "text-gray-500" : ""}`}>
                  {enemy.name}
                  {isCompleted && <span className="ml-2 text-green-500">✓</span>}
                </h3>
                <p className={`text-sm ${isLocked ? "text-gray-400" : "text-gray-600"}`}>
                  Power Level: {enemy.power}
                </p>
              </div>
              <Button 
                variant={isCompleted ? "outline" : isCurrent ? "default" : "ghost"}
                disabled={isLocked}
                onClick={() => handleFightEnemy(enemy)}
              >
                {isCompleted ? "Fight Again" : isCurrent ? "Fight" : "Locked"}
              </Button>
            </div>
          </div>
        );
      })}

      <Dialog 
        open={battleState.inProgress || (fightResult !== null)} 
        onOpenChange={(open) => {
          // Only allow closing through the buttons we provide
          if (battleState.inProgress) return;
          if (!open) handleCloseDialog();
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

export default DragonBallZStory;
