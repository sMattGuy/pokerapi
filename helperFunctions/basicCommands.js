module.exports = {
  async delay_move(time){
    if(time > 5000){
      return console.log('Cant delay more than 5 seconds!');
    }
    if(time <= 0){
      return console.log('Cant delay for less than 0 time!');
    }
    await new Promise(resolve => setTimeout(resolve, time));
  },
}
