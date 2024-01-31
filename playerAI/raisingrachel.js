const { foldHand, callHand, betHand, checkHand, raiseHand, delay_move, move_history} = require('../helperFunctions/basicCommands.js');
module.exports = {
	data: {
    'name':'Raising Rachel',
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

    if(playerData.legalActions().includes('raise')){
      console.log('I have to raise!');
      return raiseHand(playerData,potentialRaise);
    }
    else if(playerData.legalActions().includes('bet')){
      console.log('I\'ll settle to bet!');
      return betHand(playerData, potentialBet);
    }
    else if(playerData.legalActions().includes('call')){
      console.log('Guess I\'ll call...');
      return callHand(playerData);
    }
    else{
      console.log('Nothing I can do...');
      return foldHand(playerData);
    }
  },
};
