# Poker API
## An API designed to allow poker bots made by players to verse each other.
The template can be used to design a new bot. There are a few in there to act as examples. By default the bots will play one complete game, with a buy in of 1000 and a blind of 10. It's tournament style, so only one bot can win.
### Commands
The program can be run with these commands.
* `npm test` will run the program and output data to a text file explaining every action the bots took.
* `npm start` will run the program with no output except the winner at the end.
* `npm watch` will run the program slowly in the console so you can read the outputs in real time.
The program has command line arguments as well to augment the game.
* `-b, --buy-in (amount)` Lets you set the buy in amount, the default is 1000.
* `-v, --verbose` Outputs everything the bots are doing, it is recommended to pipe this into a file.
* `-s, --slow` Runs the bot slowly, make sure you also specify `-v` otherwise you will have a slow program with no output.
* `-r, --rounds` Lets you specify the amount of games that will be played.
* `-t, --time-limit (amount in ms)` Lets you specify the amount of time bots have to make a move, the default is 1 second.
### Rules
* Bots only have 1 second to make their turn unless otherwise specified, anything over that will automatically fold their hand.
* Bots are limited to the packages that are already installed.
* Bots cannot use commands that would give them an unfair advantage, such as looking at other players cards.
### Basic Bots
#### Randy Random
* Just makes random moves that are legal.
#### Raising Rachel
* Will try to bet or raise if possible.
* If anyone else raises she will also raise.
* Will only check or call if not enough money to raise or bet.
#### Careful Carl
* Will never bet or raise, only check or call.
* Will only call if hand is 6 Pair or better.
#### Thinking Thomas
* The only default bot to actually look at his hand.
* Makes decisions based on the current state of the game (pre-flop, flop, turn, river).
* Will get greedy if hand is good.
### Bot Creation Tips
Move history can be viewed to see what other players have done, its a map so you can access players move history. You can iterate over the list, or by using playerData.table.lastActor.id you can view a specific player.<br>
When raising you must send it as the current bet + your raise amount, see other AI for example.<br>
When betting you must bet more or equal to the big blind, which you can get from playerData.table.bigBlind.<br>
Fold, Call, and Check do not need value parameters.<br>
To see how to call functions, see one of the example AI, Random Randy contains all possible calls.<br>
To view documentation for this you can view this https://www.npmjs.com/package/@bradyy/poker-engine<br>
For solving the actual hand you get you can use the helper package https://www.npmjs.com/package/pokersolver<br>
You can see the AI Thinking Thomas for help understanding this package better.
