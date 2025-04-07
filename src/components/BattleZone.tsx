
import { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Sword, Shield, X, Eye, EyeOff } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const BattleZone = () => {
  const { powerLevel, forest, desert, fightEnemy, fightResult, clearFightResult, battleState, skills, useSkill, fleeFromBattle } = useGame();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showSkills, setShowSkills] = useState(false);
  const [showForestEnemies, setShowForestEnemies] = useState(false);
  const [showDesertEnemies, setShowDesertEnemies] = useState(false);
  const [activeZone, setActiveZone] = useState('forest');
  
  const handleFight = (zone: string) => {
    fightEnemy(zone);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    clearFightResult();
    setDialogOpen(false);
  };

  const handleAttackClick = () => {
    setShowSkills(true);
  };

  const handleSkillClick = (skill: any) => {
    useSkill(skill);
    setShowSkills(false);
  };

  const handleFleeClick = () => {
    fleeFromBattle();
  };

  const toggleEnemies = (zone: string) => {
    if (zone === 'forest') {
      setShowForestEnemies(!showForestEnemies);
    } else if (zone === 'desert') {
      setShowDesertEnemies(!showDesertEnemies);
    }
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
          <Card className="border-2 border-forestGreen mb-4">
            <CardHeader className="pb-2 bg-forestGreen/20">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg">Forest</CardTitle>
                  <CardDescription>Battle wild creatures in the forest to test your power.</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleEnemies('forest')}
                >
                  {showForestEnemies ? <EyeOff size={18} /> : <Eye size={18} />}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pb-2 pt-4">
              {showForestEnemies && (
                <div className="text-sm">
                  <p className="mb-1">Possible Enemies:</p>
                  <ul className="list-disc pl-5">
                    <li>Wolf (Power Level: 5)</li>
                    <li>Bandit (Power Level: 10)</li>
                    <li>Bear (Power Level: 20)</li>
                  </ul>
                </div>
              )}
            </CardContent>
            <CardFooter className="pt-4 border-t">
              <Button 
                variant="default" 
                className="w-full bg-forestGreen hover:bg-forestGreen/80"
                onClick={() => handleFight('forest')}
              >
                Find an Enemy
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="desert">
          <Card className="border-2 border-dbRed mb-4">
            <CardHeader className="pb-2 bg-dbRed/20">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg">Desert</CardTitle>
                  <CardDescription>Challenge powerful creatures in the scorching desert.</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleEnemies('desert')}
                >
                  {showDesertEnemies ? <EyeOff size={18} /> : <Eye size={18} />}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pb-2 pt-4">
              {showDesertEnemies && (
                <div className="text-sm">
                  <p className="mb-1">Possible Enemies:</p>
                  <ul className="list-disc pl-5">
                    <li>Yamcha (Power Level: 50) - Rare, might drop Yamcha's Sword</li>
                    <li>T-Rex (Power Level: 250) - May drop Dino Meat</li>
                  </ul>
                </div>
              )}
            </CardContent>
            <CardFooter className="pt-4 border-t">
              <Button 
                variant="default" 
                className="w-full bg-dbRed hover:bg-dbRed/80"
                onClick={() => handleFight('desert')}
              >
                Find an Enemy
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      <p className="text-sm text-center text-gray-600">Your current power level: {powerLevel}</p>

      {/* Battle Result Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => {
        if (!open) handleCloseDialog();
        setDialogOpen(open);
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {!battleState.inProgress ? (fightResult?.won === true ? 'Victory!' : fightResult?.won === false ? 'Defeat!' : 'Battle') : 'Battle'}
            </DialogTitle>
            <DialogDescription>
              {battleState.inProgress ? 
                `Fighting against ${battleState.enemy?.name}!` : 
                fightResult?.enemy ? `You encountered a ${fightResult.enemy.name}!` : ''}
            </DialogDescription>
          </DialogHeader>
          
          {/* Battle Interface */}
          {battleState.inProgress && battleState.enemy ? (
            <div className="flex flex-col space-y-4">
              {/* Enemy Info */}
              <div className="flex flex-col items-center p-2">
                <div className="bg-gray-100 p-4 rounded-full mb-2 w-16 h-16 flex items-center justify-center">
                  <span className="text-2xl">
                    {battleState.enemy.name === 'Wolf' ? '🐺' : 
                     battleState.enemy.name === 'Bandit' ? '👤' : 
                     battleState.enemy.name === 'Bear' ? '🐻' :
                     battleState.enemy.name === 'Yamcha' ? '👨' :
                     battleState.enemy.name === 'T-Rex' ? '🦖' : '❓'}
                  </span>
                </div>
                <div className="w-full">
                  <div className="flex justify-between text-sm mb-1">
                    <span>{battleState.enemy.name}</span>
                    <span>{battleState.enemy.hp}/{battleState.enemy.maxHp} HP</span>
                  </div>
                  <Progress value={(battleState.enemy.hp / battleState.enemy.maxHp) * 100} className="h-2 bg-red-200" />
                </div>
              </div>
              
              {/* Battle Log */}
              <div className="bg-gray-100 p-2 rounded-md h-28 overflow-y-auto text-sm">
                {battleState.log.map((entry, i) => (
                  <p key={i} className={i === battleState.log.length - 1 ? "font-bold" : ""}>{entry}</p>
                ))}
              </div>
              
              {/* Player Info */}
              <div className="w-full">
                <div className="flex justify-between text-sm mb-1">
                  <span>You</span>
                  <span>{battleState.playerStats.hp}/{battleState.playerStats.maxHp} HP</span>
                </div>
                <Progress value={(battleState.playerStats.hp / battleState.playerStats.maxHp) * 100} className="h-2 bg-green-200" />
                
                <div className="flex justify-between text-sm mt-2 mb-1">
                  <span>Ki</span>
                  <span>{battleState.playerStats.ki}/{battleState.playerStats.maxKi} Ki</span>
                </div>
                <Progress value={(battleState.playerStats.ki / battleState.playerStats.maxKi) * 100} className="h-2 bg-blue-200" />
              </div>
              
              {/* Battle Actions */}
              {battleState.playerTurn ? (
                <div className="flex flex-col space-y-2">
                  {!showSkills ? (
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant="default" 
                        onClick={handleAttackClick}
                        className="bg-dbRed hover:bg-dbRed/80"
                      >
                        <Sword className="mr-1 h-4 w-4" /> Attack
                      </Button>
                      <Button 
                        variant="default" 
                        onClick={handleFleeClick} 
                        className="bg-dbBlue hover:bg-dbBlue/80"
                      >
                        <X className="mr-1 h-4 w-4" /> Flee
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h3 className="font-bold">Skills</h3>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setShowSkills(false)}
                        >
                          Back
                        </Button>
                      </div>
                      
                      {skills.map((skill) => (
                        <Button 
                          key={skill.name}
                          variant="default"
                          className="w-full justify-between bg-dbRed hover:bg-dbRed/80"
                          onClick={() => handleSkillClick(skill)}
                          disabled={skill.kiCost > battleState.playerStats.ki}
                        >
                          <span>{skill.name}</span>
                          {skill.kiCost > 0 && <span className="text-xs bg-blue-500 px-2 py-0.5 rounded-full">{skill.kiCost} Ki</span>}
                        </Button>
                      ))}
                    </div>
                  )}
                  
                  <div className="text-center text-sm text-gray-600">
                    {battleState.playerTurn ? "Your turn" : `${battleState.enemy.name}'s turn`}
                  </div>
                </div>
              ) : (
                <div className="flex justify-center">
                  <div className="text-center text-sm text-gray-600 animate-pulse">
                    {`${battleState.enemy.name}'s turn...`}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center p-4">
              <div className="bg-gray-100 p-4 rounded-full mb-4 w-24 h-24 flex items-center justify-center">
                <span className="text-3xl">
                  {fightResult?.enemy?.name === 'Wolf' ? '🐺' : 
                   fightResult?.enemy?.name === 'Bandit' ? '👤' : 
                   fightResult?.enemy?.name === 'Bear' ? '🐻' :
                   fightResult?.enemy?.name === 'Yamcha' ? '👨' :
                   fightResult?.enemy?.name === 'T-Rex' ? '🦖' : '❓'}
                </span>
              </div>
              <div className="text-center mb-4">
                <p className="font-bold text-lg">{fightResult?.enemy?.name}</p>
                <p>Power Level: {fightResult?.enemy?.power}</p>
              </div>
              {fightResult?.won !== null && (
                <div className={`text-center p-2 rounded-md ${fightResult?.won ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} w-full`}>
                  {fightResult?.won 
                    ? `Victory! You defeated the ${fightResult?.enemy?.name}!` 
                    : `Defeat! The ${fightResult?.enemy?.name} was too strong!`
                  }
                </div>
              )}
            </div>
          )}
          
          {/* Continue Button (only shown when battle is not in progress) */}
          {!battleState.inProgress && (
            <div className="flex justify-center">
              <Button 
                variant="default" 
                onClick={handleCloseDialog}
              >
                Continue
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BattleZone;
