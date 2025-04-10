
type EnemyTurnProps = {
  enemyName: string;
};

const EnemyTurn = ({ enemyName }: EnemyTurnProps) => {
  return (
    <div className="flex justify-center">
      <div className="text-center text-sm text-gray-600 animate-pulse">
        {`${enemyName}'s turn...`}
      </div>
    </div>
  );
};

export default EnemyTurn;
