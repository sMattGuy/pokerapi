const fs = require("node:fs");
const path = require("node:path");
const { Table } = require("@mattguy2/poker-engine");
const { move_history, delay_move } = require("./helpers/basicCommands.js")
const { VERBOSE, BALANCE, SLOW, ROUNDS } = require('./helpers/parameters.js');

// import player AI
const players = new Map();
const folderPath = path.join(__dirname, 'activePlayers');
try{
  if(!fs.existsSync(folderPath)){
    fs.mkdirSync(folderPath);
    return console.log('You must put bots into \'activePlayers\' folder!');
  }
}
catch(err){
  return console.log('You must create a directory called \'activePlayers\' and put bots into it!');
}
const playerFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));
if(playerFiles.length <= 1){
  return console.log('You must put 2 or more bots into the \'activePlayers\' folder!');
}
for(const file of playerFiles){
  const filePath = path.join(folderPath,file);
  const ai = require(filePath);
  if('data' in ai && 'execute' in ai){
    let playerData = {};
    playerData.data = ai.data;
    playerData.execute = ai.execute;
    players.set(playerData.data.name,playerData);
  }
}
// what will eventually start the game off
runGame();

async function runGame(){
  let winCounter = new Map();
  for (let r = 0; r < ROUNDS; r++) {
    const table = new Table(BALANCE);
    //sit down players
    for(let [key, value] of players){
      table.sitDown(key, BALANCE);
    }
    while(table.activePlayers.length > 1){
      table.dealCards();
      //start round loop
      let roundCounter = 0;
      while(table.currentRound){
        if(VERBOSE){
          console.log(roundCounter++);
          console.log(`Current Round: ${table.currentRound}, Current Pot: ${table.currentPot.amount}`);
          console.log(`Community Cards: ${getPrettyCards(table.communityCards)}`);
          console.log(`Current Player: ${table.currentActor.id}, Hand: ${table.currentActor.hand} (${table.currentActor.hand.descr}), Stack: ${table.currentActor.stackSize}`);
        }

        //activate player to make move, only 2 seconds to respond
        await players.get(table.currentActor.id).execute(table.currentActor);

        if(VERBOSE){
          console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
          if(SLOW){
            //artificial delay for now
            await delay_move(2000);
          }
        }
      }
      //once round ends, print out winners and clean up
      if(VERBOSE){
        console.log('Final hands:');
        for(let i=0;i<table.activePlayers.length;i++){
          console.log(`${table.activePlayers[i].id} has ${table.activePlayers[i].hand} (${table.activePlayers[i].hand.descr})`);
        }
        console.log('Winner: ',table.winners[0].id);
        console.log('Pot Amount: ',table.currentPot.amount);
        console.log('Stack Size: ',table.winners[0].stackSize);
        if(SLOW){
          await delay_move(5000);
        }
      }
      //check if any players are out of money
      if (VERBOSE) {
        for(let i=0;i<table.activePlayers.length;i++){
          if(table.activePlayers[i].stackSize <= 0){
            console.log(`${table.activePlayers[i].id} is out of cash! they've stood up and left!`);
          }
        }  
      }
      if(VERBOSE){
        console.log('Game Over! The winner is: ',table.winners[0].id);
      }
      table.cleanUp();
      if(VERBOSE){
        console.log('Players Remaining: ', table.activePlayers.length);
        for(let i=0;i<table.activePlayers.length;i++){
          console.log(`${table.activePlayers[i].id}`);
        } 
        console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
      }
    }
    const newWins = winCounter.get(table.activePlayers[0].id) + 1 || 1;
    winCounter.set(table.activePlayers[0].id, newWins);
  }
  console.log('Winners');
  for(let [key, value] of winCounter){
    console.log(`${key}: ${value}`);
  }
}

function getPrettyCards(cards){
  let pretty_cards = "";
  for(let i=0;i<cards.length;i++){
    pretty_cards += cards[i].suitChar + cards[i].rank + " ";
  }
  return pretty_cards;
}
