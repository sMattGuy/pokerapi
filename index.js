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
    playerData.hand = [];
    players.set(playerData.data.name,playerData);
  }
}
// what will eventually start the game off
runGame();

async function runGame(){
  const table = new Table();
  table.sitDown("dummy_player",1000); // TEMP JUST FOR TESTING
  //sit down players
  for(let [key, value] of players){
    table.sitDown(key, BALANCE);
  }
  //start round loop 
  table.dealCards();
  while(table.currentRound){
    await players.get(table.currentActor.id).execute(table.currentActor);
    //artificial delay for now
    await delay_move(3000);
  }
}
