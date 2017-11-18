var fs = require('fs');
var Web3 = require('web3');
var web3 = new Web3.providers.HttpProvider("http://52.235.42.157:8545");
var code = fs.readFileSync('Voting.sol').toString()
var solc = require('solc')
var compiledCode = solc.compile(code)

abiDefinition = JSON.parse(compiledCode.contracts[':Voting'].interface)

console.log('^^^^', web3);
VotingContract = web3.eth.contract(abiDefinition)
byteCode = compiledCode.contracts[':Voting'].bytecode
deployedContract = VotingContract.new(['Rama','Nick','Jose'],{data: byteCode, from: web3.eth.accounts[0], gas: 4700000})
deployedContract.address
contractInstance = VotingContract.at(deployedContract.address)

candidates = {"Rama": "candidate-1", "Nick": "candidate-2", "Jose": "candidate-3"}

function voteForCandidate() {
  candidateName = $("#candidate").val();
  contractInstance.voteForCandidate(candidateName, {from: web3.eth.accounts[0]}, function() {
	let div_id = candidates[candidateName];
	console.log(contractInstance.totalVotesFor.call("candidate-1"));
    $("#" + div_id).html(contractInstance.totalVotesFor.call(candidateName).toString());
  });
}

$('document').ready(function() {
  candidateNames = Object.keys(candidates);
  for (var i = 0; i < candidateNames.length; i++) {
    let name = candidateNames[i];
	let val = contractInstance.totalVotesFor.call(name).toString();;
	console.log(val)
	console.log(contractInstance.totalVotesFor.call("candidate-1"));
    $("#" + candidates[name]).html(val);
  }
});



