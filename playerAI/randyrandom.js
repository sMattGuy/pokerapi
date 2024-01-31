module.exports = {
	data: {
    'name':'Randy Random',
    'author':'sMattGuy',
  },
	async execute(actions) {
    console.log(`I'm Randy Random, and here's what I can do right now...`);
    console.log(actions.legalActions());
    let moveToMake = Math.floor(Math.random() * actions.legalActions().length);
    console.log(`I'm gonna ${actions.legalActions()[moveToMake]}`);
    switch(actions.legalActions()[moveToMake]){
      case 'call':
        return actions.callAction();
      case 'raise':
        return actions.raiseAction(50);
      case 'fold':
        return actions.foldAction();
      default:
        console.log('Something\'s wrong....');
    }
  },
};
