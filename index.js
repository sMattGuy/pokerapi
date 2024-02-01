const fs = require("node:fs");
const path = require("node:path");
const { Table } = require("@mattguy2/poker-engine");
const { move_history, delay_move } = require("./helperFunctions/basicCommands.js")
const { parseArgs } = require('node:util');

const args = process.argv.slice(2);
//set up arguments
const arg_options = {
	'buy-in':{
		type: 'string',
		short: 'b',
    default: '1000',
	},
	'verbose':{
		type: 'boolean',
		short: 'v',
		default: false,
	},
  'slow':{
		type: 'boolean',
		short: 's',
		default: false,
	},
}
const {
	values,
	positionals,
} = parseArgs({args,options:arg_options,allowPositionals:true});

const BALANCE = values['buy-in'];
const VERBOSE = values['verbose'];
const SLOW = values['slow'];

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
        console.log(`Current Player: ${table.currentActor.id}, Hand: ${table.currentActor.hand}, Stack: ${table.currentActor.stackSize}`);
      }
      await players.get(table.currentActor.id).execute(table.currentActor);
      if(VERBOSE){
        console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
        if(SLOW){
          //artificial delay for now
          await delay_move(2000);
        }
      }
    }
    //remove any players who are out of money
    for(let i=0;i<table.activePlayers.length;i++){
      if(table.activePlayers[i].stackSize <= 0){
        console.log(`${table.activePlayers[i].id} is out of cash! they've stood up and left!`);
      }
    }
    //once round ends, print out winners and clean up
    if(VERBOSE){
      console.log('Winner: ',table.winners[0].id);
      console.log('Pot Amount: ',table.currentPot.amount);
      console.log('Stack Size: ',table.winners[0].stackSize);
      if(SLOW){
        await delay_move(5000);
      }
    }
    table.cleanUp();
    if(VERBOSE){
      console.log('Players Remaining: ', table.activePlayers.length);
    }
  }
  console.log('Game Over! The winner is: ',table.activePlayers[0].id);
}

function getPrettyCards(cards){
  let pretty_cards = "";
  for(let i=0;i<cards.length;i++){
    pretty_cards += cards[i].suitChar + cards[i].rank + " ";
  }
  return pretty_cards;
}
