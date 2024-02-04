const { TIMELIMIT } = require('../helpers/parameters.js');
const { foldHand, callHand, betHand, checkHand, raiseHand, move_history} = require('../helpers/basicCommands.js');
const Hand = require('pokersolver').Hand;

module.exports = {
	data: {
    'name':'Inspector Ian',
    'author':'MattGuy',
  },
  async execute(playerData) {
    const turnTimer = new Promise((_,reject) => {
      setTimeout(() => reject(new Error('timeout')),TIMELIMIT);
    });
    const turnAction = new Promise((resolve,_) => {
    // Put your code in here, your action will go into the resolve

    let lastPlayer = playerData.table.lastActor.id;
    let lastMove = 'fold';
    if(lastPlayer != this.data.name){
      let lastMove = move_history.get(lastPlayer);
      if(lastMove){
        lastMove = lastMove.pop().split(' ');
        lastMove = lastMove[0];
      }
    }
    // Start making decisions based on cards and what last player did
    // Similar to Thinking Thomas, Inspector Ian also does things per board state

    // Pre-Flop wont consider what others have yet
    // If hand is bad right away, just check or fold
    if(playerData.hand.rank == 1 && playerData.hand.cards[0].rank <= 4 && playerData.table.currentRound == 'pre-flop'){
      let results = checkOrFold(playerData);
      return resolve(results);
    }
    // If hand is a pair and its pre-flop, raise or bet
    else if(playerData.hand.rank == 2 && playerData.table.currentRound == 'pre-flop'){
      let result;
      if(playerData.hand.cards[0].rank >= 6){
        result = betOrRaise(playerData);
      }
      else{
        result = checkCallOrFold(playerData);
      }
      return resolve(result);
    }
    // If hand isnt that bad and its pre-flop, call
    else if(playerData.hand.rank == 1 && playerData.hand.cards[0].rank > 6 && playerData.table.currentRound == 'pre-flop'){
      let result = checkCallOrFold(playerData);
      return resolve(result);
    }

    // SECTION FOR FLOP AND TURN
    else if(playerData.hand.rank == 1 && (playerData.table.currentRound == 'flop' || playerData.table.currentRound == 'turn')){
      let result = checkOrFold(playerData);
      return resolve(result);
    }
    else if(playerData.hand.rank == 2 && (playerData.table.currentRound == 'flop' || playerData.table.currentRound == 'turn')){
      if(lastMove == 'raise' || lastMove == 'bet'){
        let result = checkCallOrFold(playerData);
        return resolve(result);
      }
      // If possible, raise or bet more
      let result = betOrRaise(playerData);
      return resolve(result);
    }
    else if(playerData.hand.rank >= 3 && (playerData.table.currentRound == 'flop' || playerData.table.currentRound == 'turn')){
      // If possible, raise or bet more
      let result = betOrRaise(playerData);
      return resolve(result);
    }

    // SECTION FOR RIVER
    // If hand is okay, check or call
    else if(playerData.table.currentRound == 'river' && playerData.hand.rank == 1){
      let result = checkOrFold(playerData);
      return resolve(result);
    }
    else if(playerData.table.currentRound == 'river' && playerData.hand.rank == 2 && lastMove != 'raise'){
      let result = betOrRaise(playerData);
      return resolve(result);
    }
    else if(playerData.table.currentRound == 'river' && playerData.hand.rank > 2){
      let result = betOrRaise(playerData);
      return resolve(result);
    }
    //give in
    else{
      let result = checkOrFold(playerData);
      return resolve(result);
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