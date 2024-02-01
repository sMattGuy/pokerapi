const { foldHand, callHand, betHand, checkHand, raiseHand, delay_move, move_history} = require('../helpers/basicCommands.js');
module.exports = {
	data: {
    'name':'Raising Rachel',
    'author':'sMattGuy',
  },
  async execute(playerData) {
    const turnTimer = new Promise((_,reject) => {
      setTimeout(() => reject(new Error('timeout')),2000);
    });
    const turnAction = new Promise((resolve,_) => {
      // Put your code in here, your action will go into the resolve

      let moveToMake = Math.floor(Math.random() * playerData.legalActions().length);

      let potentialBet = playerData.table.bigBlind;
      if(potentialBet > playerData.stackSize){
        if(playerData.legalActions().includes('check')){
          return resolve(['check']);
        }
        else{
          return resolve(['fold']);
        }
      }
      let potentialRaise = playerData.table.currentBet + 10;
  
      if(potentialBet > playerData.stackSize && playerData.legalActions().includes('check') && playerData.legalActions()[moveToMake] == 'bet'){
        return resolve(['check']);
      }
      if(potentialRaise > playerData.stackSize){
        potentialRaise = playerData.stackSize;
      }
  
      if(playerData.legalActions().includes('raise')){
        return resolve(['raise', potentialRaise]);
      }
      else if(playerData.legalActions().includes('bet')){
        return resolve(['bet', potentialBet]);
      }
      else if(playerData.legalActions().includes('call')){
        return resolve(['call']);
      }
      else{
        return resolve(['fold']);
      }
    
    // DO NOT CHANGE ANYTHING BELOW THIS LINE!
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
