const { TIMELIMIT } = require('../helpers/parameters.js');
const { foldHand, callHand, betHand, checkHand, raiseHand, delay_move, move_history} = require('../helpers/basicCommands.js');
module.exports = {
	data: {
    'name':'Randy Random',
    'author':'sMattGuy',
  },
	async execute(playerData) {
    const turnTimer = new Promise((_,reject) => {
      setTimeout(() => reject(new Error('timeout')),TIMELIMIT);
    });
    const turnAction = new Promise((resolve,_) => {
      // Put your code in here, your action will go into the resolve
      let moveToMake = Math.floor(Math.random() * playerData.legalActions().length);
      let potentialBet = playerData.table.bigBlind;
      let potentialRaise = playerData.table.currentBet + 10;
      if(potentialBet > playerData.stackSize && playerData.legalActions().includes('check') && playerData.legalActions()[moveToMake] == 'bet'){
        return resolve(['check']);
      }
      if(potentialRaise > playerData.stackSize){
        potentialRaise = playerData.stackSize;
      }
      switch(playerData.legalActions()[moveToMake]){
        case 'check':
          return resolve(['check']);
        case 'call':
          return resolve(['call']);
        case 'bet':
          return resolve(['bet',potentialBet]);
        case 'raise':
          return resolve(['raise',potentialRaise]);
        case 'fold':
          return resolve(['fold']);
        default:
          return resolve(['fold']); // Fallback for any errors
      }
    });
    await Promise.race([turnTimer, turnAction])
      .then((result) => {
        switch(result[0]){
          case 'check':
            return checkHand(playerData);
          case 'call':
            return callHand(playerData);
          case 'bet':
            return betHand(playerData,result[1]);
          case 'raise':
            return raiseHand(playerData,result[1]);
          case 'fold':
            return foldHand(playerData);
        }
      })
      .catch((err) => {
        console.log(err);
        return foldHand(playerData);
      });
  },
};
