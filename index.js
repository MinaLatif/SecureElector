const path = require('path')
var fs = require('fs')
const Web3 = require('web3')

const web3 = new Web3(new Web3.providers.HttpProvider("http://52.242.26.191:8545"))
var solc = require('solc')

const code = fs.readFileSync("Voting.sol");
console.log('Compiling...')
const output = solc.compile(code.toString(), 1);
console.log('Done.')
const bytecode = output.contracts[':Voting'].bytecode;
const abi = JSON.parse(output.contracts[':Voting'].interface);


const VotingContract = web3.eth.contract(abi)
const byteCode = output.contracts[':Voting'].bytecode
const deployedContract = VotingContract.new(['Rama','Nick','Jose'],{data: '0x' + byteCode, from: web3.eth.accounts[0], gas: 4700000})

const contractInstance = VotingContract.at(deployedContract.address)


var express = require('express')
var exphbs = require('express-handlebars')
var app = express()
app.use(express.static(__dirname + '/public'))
app.engine('.hbs', exphbs({
	defaultLayout: 'main',
	extname: '.hbs',
	layoutsDir: path.join(__dirname, 'views')
}))

app.set('view engine', '.hbs')
app.set('views', path.join(__dirname, '/views/layouts'))

app.get('/', function(req, res){
	res.render('index', {contractInstance})
})

app.get('/votes/:candidate', function(req, res){
	let name = req.params.candidate;
	console.log(name)
	let val = contractInstance.totalVotesFor.call(name).toString();
	res.writeHead(200, {"Content-Type": "text/plain"})
	res.end(val);
})


console.log('Listening on port 3000...')
app.listen(3000)




