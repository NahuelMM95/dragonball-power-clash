
import { ReactNode } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";

type ZoneCardProps = {
  zoneName: string;
  description: string;
  enemies: { name: string; power: number; reward?: string }[];
  showEnemies: boolean;
  onToggleEnemies: () => void;
  onFindEnemy: () => void;
  accentColor: string;
};

const ZoneCard = ({ 
  zoneName, 
  description,
  enemies, 
  showEnemies, 
  onToggleEnemies, 
  onFindEnemy,
  accentColor
}: ZoneCardProps) => {
  return (
    <Card className={`border-2 border-${accentColor} mb-4`}>
      <CardHeader className={`pb-2 bg-${accentColor}/20`}>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg">{zoneName}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleEnemies}
          >
            {showEnemies ? <EyeOff size={18} /> : <Eye size={18} />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pb-2 pt-4">
        {showEnemies && (
          <div className="text-sm">
            <p className="mb-1">Possible Enemies:</p>
            <ul className="list-disc pl-5">
              {enemies.map((enemy) => (
                <li key={enemy.name}>
                  {enemy.name} (Power Level: {enemy.power})
                  {enemy.reward && ` - ${enemy.reward}`}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-4 border-t">
        <Button 
          variant="default" 
          className={`w-full bg-${accentColor} hover:bg-${accentColor}/80`}
          onClick={onFindEnemy}
        >
          Find an Enemy
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ZoneCard;
