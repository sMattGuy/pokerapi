// Here is an explination for everything you need to know to create an AI for the poker game
// You have access to these options to essentially make your decision
const { foldHand, callHand, betHand, checkHand, raiseHand, move_history} = require('../helpers/basicCommands.js');
const Hand = require('pokersolver').Hand;
// Move history can be viewed to see what other players have done, its a map so you can access players move history
// You can iterate over the list, or by using playerData.table.lastActor.id you can view a specific player

// When raising you must send it as the current bet + your raise amount, see other AI for example
// When betting you must bet more or equal to the big blind, which you can get from playerData.table.bigBlind
// Fold, Call, and Check do not need value parameters
// To see how to call functions, see one of the example AI, Random Randy contains all possible calls

// To view documentation for this you can view this https://www.npmjs.com/package/@bradyy/poker-engine

// For solving the actual hand you get you can use the helper package https://www.npmjs.com/package/pokersolver
// You can see the AI Thinking Thomas for help understanding this

// BASIC GUIDELINES
// Your AI cannot take more than 2 seconds per turn
// Your AI must play fair and not peak any other players cards using invalid methods
module.exports = {
	data: {
    'name':'Thinking Thomas',
    'author':'MattGuy',
  },
  async execute(playerData) {
    const turnTimer = new Promise((_,reject) => {
      setTimeout(() => reject(new Error('timeout')),2000);
    });
    const turnAction = new Promise((resolve,_) => {
    // Put your code in here, your action will go into the resolve
    
    // If hand is bad right away, just check or fold
    if(playerData.hand.rank == 1 && playerData.hand.cards[0].rank <= 6 && playerData.table.currentRound == 'pre-flop'){
      let results = checkOrFold(playerData);
      return resolve(results);
    }
    // If hand is a pair and its pre-flop, raise or bet
    else if(playerData.hand.rank == 2 && playerData.table.currentRound == 'pre-flop'){
      let result = betOrRaise(playerData);
      return resolve(result);
    }
    // If hand isnt that bad and its pre-flop, call
    else if(playerData.hand.rank == 1 && playerData.hand.cards[0].rank > 6 && playerData.table.currentRound == 'pre-flop'){
      let result = checkCallOrFold(playerData);
      return resolve(result);
    }
    // SECTION FOR FLOP AND TURN
    else if(playerData.hand.rank == 2 && (playerData.table.currentRound == 'flop' || playerData.table.currentRound == 'turn')){
      //hand is a pair or better, check or call if possible
      let result = checkCallOrFold(playerData);
      return resolve(result);
    }
    else if(playerData.hand.rank >= 3 && (playerData.table.currentRound == 'flop' || playerData.table.currentRound == 'turn')){
      // If possible, raise or bet more
      let result = betOrRaise(playerData);
      return resolve(result);
    }
    else if(playerData.table.currentRound == 'flop' || playerData.table.currentRound == 'turn'){
      let results = checkOrFold(playerData);
      return resolve(results);
    }
    // SECTION FOR RIVER
    // If hand is okay, check or call
    else if(playerData.table.currentRound == 'river' && playerData.hand.rank == 2){
      let result = checkCallOrFold(playerData);
      return resolve(result);
    }
    // Great hand, bet a lot
    else if(playerData.table.currentRound == 'river' && playerData.hand.rank >= 3){
      let result = betOrRaise(playerData);
      return resolve(result);
    }
    //give in
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

function checkOrFold(playerData){
  if(playerData.legalActions().includes('check')){
    return ['check']; // Check if possible
  }
  else{
    return ['fold']; // Fold otherwise
  }
}

function checkCallOrFold(playerData){
  if(playerData.legalActions().includes('check')){
    return ['check']; // Check if possible (was big blind this round)
  }
  else if(playerData.legalActions().includes('call')){
    return ['call'];
  }
  else {
    return ['fold'];
  }
}

function betOrRaise(playerData){
  let potentialBet = playerData.table.bigBlind;
  let potentialRaise = playerData.table.currentBet + 10;
  if(potentialBet > playerData.stackSize && playerData.legalActions().includes('check')){
    return ['check'];
  }
  if(potentialRaise > playerData.stackSize){
    potentialRaise = playerData.stackSize; //reduce raise to stack (all in)
  }
  if(playerData.legalActions().includes('bet')){
    return ['bet',potentialBet];
  }
  else if(playerData.legalActions().includes('raise')){
    return ['raise',potentialRaise];
  }
  else if(playerData.legalActions().includes('call')){
    return ['call'];
  }
  else {
    return ['fold'];
  }
}