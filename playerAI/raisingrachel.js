const { foldHand, callHand, betHand, checkHand, raiseHand, delay_move, move_history} = require('../helpers/basicCommands.js');
module.exports = {
	data: {
    'name':'Raising Rachel',
    'author':'sMattGuy',
  },
	async execute(playerData) {
    let moveToMake = Math.floor(Math.random() * playerData.legalActions().length);

    let potentialBet = playerData.table.bigBlind;
    if(potentialBet > playerData.stackSize){
      if(playerData.legalActions().includes('check')){
        return checkHand(playerData);
      }
      else{
        return foldHand(playerData);
      }
    }
    let potentialRaise = playerData.table.currentBet + 10;

    if(potentialBet > playerData.stackSize && playerData.legalActions().includes('check') && playerData.legalActions()[moveToMake] == 'bet'){
      return checkHand(playerData);
    }
    if(potentialRaise > playerData.stackSize){
      potentialRaise = playerData.stackSize;
    }

    if(playerData.legalActions().includes('raise')){
      return raiseHand(playerData,potentialRaise);
    }
    else if(playerData.legalActions().includes('bet')){
      return betHand(playerData, potentialBet);
    }
    else if(playerData.legalActions().includes('call')){
      return callHand(playerData);
    }
    else{
      return foldHand(playerData);
    }
  },
};
