const fs = require("node:fs");
const path = require("node:path");
const { Table } = require("@bradyy/poker-engine");
const { delay_move } = require("./helperFunctions/basicCommands.js")

const BALANCE = 1000; // Plan on making this a command line argument

// import player AI
const players = new Map();
const folderPath = path.join(__dirname, 'playerAI');
const playerFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));
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
  const table = new Table(BALANCE);
  
  // this whole section will need to be removed, just adding bots for testing
  players.set("dummy_player1",players.get("Randy Random"));
  players.set("dummy_player2",players.get("Randy Random"));
  players.set("dummy_player3",players.get("Randy Random"));

  //sit down players
  for(let [key, value] of players){
    table.sitDown(key, BALANCE);
  }
  while(table.activePlayers.length > 1){
    table.dealCards();
    //start round loop
    let roundCounter = 0;
    while(table.currentRound){
      console.log(roundCounter++);
      console.log(`Current Round: ${table.currentRound}, Current Pot: ${table.currentPot.amount}`);
      console.log(`Community Cards: ${getPrettyCards(table.communityCards)}`);
      console.log(`Current Player: ${table.currentActor.id}, Hand: ${table.currentActor.hand}, Stack: ${table.currentActor.stackSize}`);
      await players.get(table.currentActor.id).execute(table.currentActor);
      console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
      //artificial delay for now
      //await delay_move(2000);
    }
    //remove any players who are out of money
    for(let i=0;i<table.activePlayers.length;i++){
      if(table.activePlayers[i].stackSize <= 0){
        console.log(`${table.activePlayers[i].id} is out of cash! they've stood up and left!`);
      }
    }
    //once round ends, print out winners and clean up
    console.log('Winner: ',table.winners[0].id);
    console.log('Pot Amount: ',table.currentPot.amount);
    console.log('Stack Size: ',table.winners[0].stackSize);
    //await delay_move(5000);
    table.cleanUp();
    console.log('Players Remaining: ', table.activePlayers.length);
  }
  console.log('Game Over! The winner is: ',table.activePlayers[0].id)
}

function getPrettyCards(cards){
  let pretty_cards = "";
  for(let i=0;i<cards.length;i++){
    pretty_cards += cards[i].suitChar + cards[i].rank + " ";
  }
  return pretty_cards;
}
