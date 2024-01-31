const { foldHand, callHand, betHand, checkHand, raiseHand, delay_move, move_history} = require('../helperFunctions/basicCommands.js');
module.exports = {
	data: {
    'name':'Randy Random',
    'author':'sMattGuy',
  },
	async execute(playerData) {
    console.log(`I'm ${playerData.id}, and here's what I can do right now...`);
    console.log(playerData.legalActions());
    let moveToMake = Math.floor(Math.random() * playerData.legalActions().length);
    console.log(`I'm gonna ${playerData.legalActions()[moveToMake]}`);

    let potentialBet = playerData.table.bigBlind;
    let potentialRaise = playerData.table.currentBet + 10;
    if(potentialBet > playerData.stackSize && playerData.legalActions().includes('check') && playerData.legalActions()[moveToMake] == 'bet'){
      return checkHand(playerData);
    }
    if(potentialRaise > playerData.stackSize){
      potentialRaise = playerData.stackSize;
    }
    switch(playerData.legalActions()[moveToMake]){
      case 'check':
        return checkHand(playerData);
      case 'call':
        return callHand(playerData);
      case 'bet':
        return betHand(playerData, potentialBet);
      case 'raise':
        return raiseHand(playerData, potentialRaise);
      case 'fold':
        return foldHand(playerData);
      default:
        console.log('Something\'s wrong....');
    }
  },
};
