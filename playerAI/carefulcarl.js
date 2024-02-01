const { getHandResults, foldHand, callHand, betHand, checkHand, raiseHand, move_history} = require('../helperFunctions/basicCommands.js');

module.exports = {
	data: {
    'name':'Careful Carl',
    'author':'MattGuy',
  },
	async execute(playerData) {
    // Start putting your code below here
    const currentCards = playerData.hand;
    if(playerData.legalActions().includes('check')){
      return checkHand(playerData);
    }
    else if(playerData.legalActions().includes('call') && (currentCards.rank >= 2 || currentCards.cards[0].rank >= 6)){
      //If hand is decent, or 25% of the time, call
      return callHand(playerData);
    }
    else{
      return foldHand(playerData);
    }
  },
};
