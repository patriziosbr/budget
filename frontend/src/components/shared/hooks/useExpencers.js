import { useState, useEffect } from "react";

/**
 * Custom hook for calculating expense totals and comparisons between users
 * @param {Object} scheda - The scheda object containing notaSpese array
 */
export const useExpencers = (scheda) => {
  const [expencersWithTotals, setExpencersWithTotals] = useState([]);
  const [maxExpencer, setMaxExpencer] = useState(null);
  const [expencersDiff, setExpencersDiff] = useState([]);

  const findExpencersWithTotals = (scheda) => {
    if (!scheda?.notaSpese?.length) {
      setExpencersWithTotals([]);
      setMaxExpencer(null);
      setExpencersDiff([]);
      return;
    }

    // Calculate totals per user
    const totalsMap = {};
    scheda.notaSpese.forEach((item) => {
      const userId = item.user;
      if (!totalsMap[userId]) {
        totalsMap[userId] = {
          userId,
          userName: item?.inserimentoUser?.name || "Unknown",
          totalExp: 0,
        };
      }
      totalsMap[userId].totalExp += item.importo || 0;
    });

    const totalsArray = Object.values(totalsMap);
    setExpencersWithTotals(totalsArray);

    // Find max spender
    if (totalsArray.length === 0) {
      setMaxExpencer(null);
      setExpencersDiff([]);
      return;
    }

    const max = totalsArray.reduce((prev, curr) => {
      if (prev.totalExp === curr.totalExp) {
        return {
          userId: null,
          userName: "Users spent equal",
          totalExp: curr.totalExp,
        };
      }
      return prev.totalExp > curr.totalExp ? prev : curr;
    });

    setMaxExpencer(max);

    // Calculate differences
    let resDiff = [];
    if (max.userName !== "Users spent equal") {
      totalsArray
        .filter((item) => item.userId !== max.userId)
        .forEach((item) => {
          resDiff.push({
            userHigh: max.userName,
            userLess: item.userName,
            diff: (max.totalExp - item.totalExp).toFixed(2),
          });
        });
    }
    setExpencersDiff(resDiff);
  };

  useEffect(() => {
    findExpencersWithTotals(scheda);
  }, [scheda.notaSpese]);

  return {
    expencersWithTotals,
    maxExpencer,
    expencersDiff,
  };
};

export default useExpencers;
