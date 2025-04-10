
type BattleLogProps = {
  log: string[];
};

const BattleLog = ({ log }: BattleLogProps) => {
  return (
    <div className="bg-gray-100 p-2 rounded-md h-28 overflow-y-auto text-sm">
      {log.map((entry, i) => (
        <p key={i} className={i === log.length - 1 ? "font-bold" : ""}>{entry}</p>
      ))}
    </div>
  );
};

export default BattleLog;
