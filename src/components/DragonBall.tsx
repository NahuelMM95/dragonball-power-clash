
import { useState } from 'react';
import { useGame } from '@/contexts/GameContext';

const DragonBall = () => {
  const { increaseClicks, clicks } = useGame();
  const [isClicking, setIsClicking] = useState(false);

  const handleClick = () => {
    increaseClicks();
    setIsClicking(true);
    setTimeout(() => setIsClicking(false), 100);
  };

  return (
    <div className="flex flex-col items-center">
      <div 
        className={`cursor-pointer mb-4 ${isClicking ? 'animate-shake' : 'animate-float'}`} 
        onClick={handleClick}
      >
        <div className="relative">
          <div className="dragon-ball w-40 h-40 rounded-full bg-dragonYellow animate-pulse-glow flex items-center justify-center">
            <span className="text-black text-4xl font-bold">★</span>
          </div>
        </div>
      </div>
      <p className="text-lg font-semibold">Clicks: {clicks}</p>
      <p className="text-sm text-gray-600">Every 100 clicks = +1 Power Level</p>
    </div>
  );
};

export default DragonBall;
