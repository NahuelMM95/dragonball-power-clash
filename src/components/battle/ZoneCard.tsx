
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
  // Define color mapping for dynamic styling
  const colorStyles: Record<string, { border: string, bg: string, hover: string }> = {
    forestGreen: { 
      border: "border-forestGreen", 
      bg: "bg-forestGreen", 
      hover: "hover:bg-forestGreen/80"
    },
    dbRed: { 
      border: "border-dragonOrange", 
      bg: "bg-dragonOrange", 
      hover: "hover:bg-dragonOrange/80" 
    },
    crystalBlue: { 
      border: "border-blue-500", 
      bg: "bg-blue-500", 
      hover: "hover:bg-blue-600" 
    },
    // Add other colors as needed
    desert: {
      border: "border-dragonOrange",
      bg: "bg-dragonOrange",
      hover: "hover:bg-dragonOrange/80"
    },
    wasteland: {
      border: "border-green-700",
      bg: "bg-green-700",
      hover: "hover:bg-green-800"
    }
  };
  
  // Get the style for the current accentColor or default to forestGreen
  const style = colorStyles[accentColor] || colorStyles.forestGreen;
  
  return (
    <Card className={`border-2 ${style.border} mb-4`}>
      <CardHeader className={`pb-2 ${style.bg}/20`}>
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
                  {enemy.name} (Power Level: {enemy.power.toLocaleString('en')})
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
          className={`w-full ${style.bg} ${style.hover}`}
          onClick={onFindEnemy}
        >
          Find an Enemy
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ZoneCard;
