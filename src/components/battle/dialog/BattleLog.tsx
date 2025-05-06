
type BattleLogProps = {
  log: string[];
};

// Helper function to format numbers in text strings
const formatNumbersInString = (text: string): string => {
  // Regex to find numbers in text
  return text.replace(/\b(\d{4,})\b/g, (match) => {
    // Convert the match to a number and format it with commas
    return parseInt(match).toLocaleString('en');
  });
};

const BattleLog = ({ log }: BattleLogProps) => {
  return (
    <div className="bg-gray-100 p-2 rounded-md h-28 overflow-y-auto text-sm">
      {log.map((entry, i) => (
        <p key={i} className={i === log.length - 1 ? "font-bold" : ""}>
          {formatNumbersInString(entry)}
        </p>
      ))}
    </div>
  );
};

export default BattleLog;
