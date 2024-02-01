const { getHandResults, foldHand, callHand, betHand, checkHand, raiseHand, move_history} = require('../helpers/basicCommands.js');

module.exports = {
	data: {
    'name':'Careful Carl',
    'author':'MattGuy',
  },
  async execute(playerData) {
    const turnTimer = new Promise((_,reject) => {
      setTimeout(() => reject(new Error('timeout')),2000);
    });
    const turnAction = new Promise((resolve,_) => {
    // Put your code in here, your action will go into the resolve

    const currentCards = playerData.hand;
    if(playerData.legalActions().includes('check')){
      return resolve(['check']);
    }
    else if(playerData.legalActions().includes('call') && (currentCards.rank >= 2 || currentCards.cards[0].rank >= 6)){
      //If hand is decent, or 25% of the time, call
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
