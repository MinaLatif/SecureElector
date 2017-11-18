const path = require('path')
//const express = require('express')
var fs = require('fs')
const Web3 = require('web3')

const web3 = new Web3(new Web3.providers.HttpProvider("http://52.242.26.191:8545"))
var solc = require('solc')

const input = fs.readFileSync("Token.sol");
console.log('Compiling...')
const output = solc.compile(input.toString(), 1);
console.log('Done.')
const bytecode = output.contracts[':Token'].bytecode;
const abi = JSON.parse(output.contracts[':Token'].interface);


const contract = web3.eth.contract(abi);

const contractInstance = contract.new({
	data: '0x' + bytecode,
	from: web3.eth.coinbase,
	gas: 90000*2
}, (err, res) => {
	if(err) {
		console.log('Err: ' + err);
		return
	}

	console.log(web3.eth.coinbase)
	console.log('Transaction hash: ' + res.transactionHash);

	if(res.address){
		console.log('Contract address: ' + res.address)
		testContract(res.address);
	}
});

function testContract(address){
	const destAcct = '0x14A2AC8D15e97C872af8A090CB74Fb4828059869';
	const token = contract.at(destAcct)

	const balance1 = token.balances.call(address)
	console.log(address + ": " + balance1.toString())

	token.transfer(destAcct, 100, {from: web3.eth.coinbase}, (err, res) => {
		console.log('tx: ' + res)
		const balance2 = token.balances.call(destAcct);
		console.log(destAcct + ": " + balance2.toString())
	})
}


// const app = express()

// app.get('/', (response, request) => {

// })

//app.listen(3000);
