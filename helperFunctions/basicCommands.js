// The move history will store each move a player makes, essentially keeping a history.
// This history can be accessed by any bot to make inferences based on what the other bots do
// The formatting for it is a key word followed by any data, so it can be accessed by splicing the string
/**
 * 'call' will just signify they called the hand
 * 'bet amt' will have a data value after it
 * 'raise amt' will also have data after it
 * 'fold' shows they folded
**/
// The actual history itself is read sequentially, the last item in the array for that player is the latest action
// For bots to view the move history, they can iterate over the map, or get the last player from the engine to look up
const move_history = new Map();
module.exports = {
  move_history,
  async delay_move(time){
    if(time > 5000){
      return console.log('Cant delay more than 5 seconds!');
    }
    if(time <= 0){
      return console.log('Cant delay for less than 0 time!');
    }
    await new Promise(resolve => setTimeout(resolve, time));
  },
  async checkHand(currentPlayer){
    if(!checkValidOption(currentPlayer, 'check')){
      //player submitted invalid move
      foldInvalidHand(currentPlayer);
      return;
    }
    let existing_history = move_history.get(currentPlayer.id);
    if(existing_history){
      //update history to include new move
      existing_history.push('check');
      move_history.set(currentPlayer.id,existing_history);
    }
    else{
      //players first move, add it to the map
      let new_history = [];
      new_history.push('check');
      move_history.set(currentPlayer.id, new_history)
    }
    //after updating the history call the engine function for the player.
    console.log(`${currentPlayer.id} checked`);
    currentPlayer.checkAction();
  },
  async callHand(currentPlayer){
    if(!checkValidOption(currentPlayer, 'call')){
      //player submitted invalid move
      foldInvalidHand(currentPlayer);
      return;
    }
    let existing_history = move_history.get(currentPlayer.id);
    if(existing_history){
      //update history to include new move
      existing_history.push('call');
      move_history.set(currentPlayer.id,existing_history);
    }
    else{
      //players first move, add it to the map
      let new_history = [];
      new_history.push('call');
      move_history.set(currentPlayer.id, new_history)
    }
    //after updating the history call the engine function for the player.
    console.log(`${currentPlayer.id} called!`);
    currentPlayer.callAction();
  },
  async betHand(currentPlayer, bet){
    if(!checkValidOption(currentPlayer, 'bet')){
      //player submitted invalid move
      foldInvalidHand(currentPlayer);
      return;
    }
    let existing_history = move_history.get(currentPlayer.id);
    if(existing_history){
      //update history to include new move
      existing_history.push(`bet ${bet}`);
      move_history.set(currentPlayer.id,existing_history);
    }
    else{
      //players first move, add it to the map
      let new_history = [];
      new_history.push(`bet ${bet}`);
      move_history.set(currentPlayer.id, new_history)
    }
    //after updating the history call the engine function for the player.
    console.log(`${currentPlayer.id} bet ${bet}!`);
    currentPlayer.betAction(bet);
  },
  async raiseHand(currentPlayer, raise){
    if(!checkValidOption(currentPlayer, 'raise')){
      //player submitted invalid move
      foldInvalidHand(currentPlayer);
      return;
    }
    let existing_history = move_history.get(currentPlayer.id);
    if(existing_history){
      //update history to include new move
      existing_history.push(`raise ${raise}`);
      move_history.set(currentPlayer.id,existing_history);
    }
    else{
      //players first move, add it to the map
      let new_history = [];
      new_history.push(`raise ${raise}`);
      move_history.set(currentPlayer.id, new_history)
    }
    //after updating the history call the engine function for the player.
    console.log(`${currentPlayer.id} raised ${raise}!`);
    currentPlayer.raiseAction(raise);
  },
  async foldHand(currentPlayer){
    let existing_history = move_history.get(currentPlayer.id);
    if(existing_history){
      //update history to include new move
      existing_history.push('fold');
      move_history.set(currentPlayer.id,existing_history);
    }
    else{
      //players first move, add it to the map
      let new_history = [];
      new_history.push('fold');
      move_history.set(currentPlayer.id, new_history)
    }
    //after updating the history call the engine function for the player.
    console.log(`${currentPlayer.id} folded!`);
    currentPlayer.foldAction();
  },
}
function checkValidOption(currentPlayer, action){
  for(i=0;i<currentPlayer.legalActions().length;i++){
    if(action == currentPlayer.legalActions()[i]){
      return true;
    }
  }
  return false;
}
function foldInvalidHand(currentPlayer){
  console.log(`Invalid choice selected! Automatically folding hand!`);
  foldHand(currentPlayer);
}
