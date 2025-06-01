
export const abbreviateNumber = (num: number, useAbbreviation: boolean = true): string => {
  console.log(`abbreviateNumber called with num: ${num}, useAbbreviation: ${useAbbreviation}`);
  
  if (!useAbbreviation) {
    const result = num.toLocaleString('en-US');
    console.log(`No abbreviation - returning: ${result}`);
    return result;
  }

  const absNum = Math.abs(num);
  
  if (absNum >= 1000000000000) {
    return (num / 1000000000000).toFixed(1).replace(/\.0$/, '') + 'T';
  }
  if (absNum >= 1000000000) {
    return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
  }
  if (absNum >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (absNum >= 1000) {
    const result = (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    console.log(`Abbreviation - returning: ${result}`);
    return result;
  }
  
  return num.toString();
};
