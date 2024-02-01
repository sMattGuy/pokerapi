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
    'name':'unique name',
    'author':'your name',
  },
  async execute(playerData) {
    const turnTimer = new Promise((_,reject) => {
      setTimeout(() => reject(new Error('timeout')),2000);
    });
    const turnAction = new Promise((resolve,_) => {
      // Put your code in here, your action will go into the resolve

    //   // Example code based on Randy Random
    //   let moveToMake = Math.floor(Math.random() * playerData.legalActions().length);  // Gets a random legal move
    //   let potentialBet = playerData.table.bigBlind; // Sets minimum bet
    //   let potentialRaise = playerData.table.currentBet + 10; // Raises by 10
    //   if(potentialBet > playerData.stackSize && playerData.legalActions().includes('check') && playerData.legalActions()[moveToMake] == 'bet'){
    //     return resolve(['check']); // Checks if player doesn't have enough to bet
    //   }
    //   if(potentialRaise > playerData.stackSize){
    //     potentialRaise = playerData.stackSize; // Checks raise is within players budget
    //   }
    //   // Example switch statement
    //   // When ready to submit move do resolve([action, optional])
    //   switch(playerData.legalActions()[moveToMake]){
    //     case 'check':
    //       return resolve(['check']);
    //     case 'call':
    //       return resolve(['call']);
    //     case 'bet':
    //       return resolve(['bet',potentialBet]);
    //     case 'raise':
    //       return resolve(['raise',potentialRaise]);
    //     case 'fold':
    //       return resolve(['fold']);
    //     default:
    //       return resolve(['fold']); // Fallback for any errors
    //   }


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
