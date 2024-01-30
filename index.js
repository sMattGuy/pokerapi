const pokersolver = require("pokersolver");
const fs = require("node:fs");
const path = require("node:path");

const BALANCE = 1000; // Plan on making this a command line argument
// Information for the deck being used.
const card_icons = ['♠A','♠2','♠3','♠4','♠5','♠6','♠7','♠8','♠9','♠10','♠J','♠Q','♠K','♥A','♥2','♥3','♥4','♥5','♥6','♥7','♥8','♥9','♥10','♥J','♥Q','♥K','♦A','♦2','♦3','♦4','♦5','♦6','♦7','♦8','♦9','♦10','♦J','♦Q','♦K','♣A','♣2','♣3','♣4','♣5','♣6','♣7','♣8','♣9','♣10','♣J','♣Q','♣K'];
const card_codes = ['As','2s','3s','4s','5s','6s','7s','8s','9s','Ts','Js','Qs','Ks','Ah','2h','3h','4h','5h','6h','7h','8h','9h','Th','Jh','Qh','Kh','Ad','2d','3d','4d','5d','6d','7d','8d','9d','Td','Jd','Qd','Kd','Ac','2c','3c','4c','5c','6c','7c','8c','9c','Tc','Jc','Qc','Kc'];
let usedCards = [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];

// import player AI
const players = [];
const folderPath = path.join(__dirname, 'playerAI');
const playerFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));
for(const file of playerFiles){
  const filePath = path.join(folderPath,file);
  const ai = require(filePath);
  if('data' in ai && 'execute' in ai){
    let playerData = {};
    playerData.data = ai.data;
    playerData.balance = BALANCE;
    playerData.execute = ai.execute;
    players.push(playerData);
  }
}
console.log(players);

// what will eventually start the game off
runGame();

async function runGame(){
  //the main function which runs the game loop until only one player is left.
  await players[0].execute();
}
