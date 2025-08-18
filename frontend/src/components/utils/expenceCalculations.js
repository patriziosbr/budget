// export const findExpencerWithTotals = (scheda) => {
//   const expencersTotals = [];
//   scheda.notaSpese.forEach((item) => {
//     const expIndex = expencersTotals.findIndex(
//       (ex) => ex.userId === item.user
//     );
//     if (expIndex !== -1) {
//       expencersTotals[expIndex].totalExp += item.importo;
//     } else {
//       expencersTotals.push({
//         userId: item.user,
//         userName: item.inserimentoUser.name,
//         totalExp: item.importo,
//       });
//     }
//   });
//   return expencersTotals;
// };

// export const findMaxExpencer = (expencersTotals) => {
//   if (expencersTotals.length === 0) {
//     return null; // Or handle as appropriate for your application
//   }
//   const max = expencersTotals.reduce((prev, curr) => {
//     return prev.totalExp > curr.totalExp ? prev : curr;
//   });
//   return max;
// };