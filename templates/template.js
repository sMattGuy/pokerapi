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
// Your AI cannot take more than 5 seconds per turn
// Your AI must play fair and not peak any other players cards using invalid methods
module.exports = {
	data: {
    'name':'unique name',
    'author':'your name',
  },
	async execute(playerData) {
    // Start putting your code below here
  },
};
