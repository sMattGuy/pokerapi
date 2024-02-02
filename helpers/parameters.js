const { Module } = require('node:module');
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
  	'rounds':{
		type: 'string',
		short: 'r',
		default: '1',
	},
}
const {
	values,
	positionals,
} = parseArgs({args,options:arg_options,allowPositionals:true});

const BALANCE = parseInt(values['buy-in']);
const VERBOSE = values['verbose'];
const SLOW = values['slow'];
const ROUNDS = parseInt(values['rounds']);

module.exports = {BALANCE, VERBOSE, SLOW, ROUNDS}