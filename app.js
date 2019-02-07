/*  
  FileName     [ index.js ]
  PackageName  [ lastword ]
  Synopsis     [  ]

  library
  * web3.js         @ 0.20.7
  * ethereumjs-tx   @ 1.3.7

  Tools
  * Ganache / Testrpc:
    Mnemonic: [waste version earth federal account gain eager collect flash lava used arrow]
*/

const Web3 = require('web3');
const Tx   = require('ethereumjs-tx');

// [Done] Connect to provider
// > testnet: ganache received the message.
const mainnetProvider  = new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/dafef60eafe847d6b780a5b0fcc770e6');
const ropstenProvider  = new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/dafef60eafe847d6b780a5b0fcc770e6');
const testnetProvider  = new Web3.providers.HttpProvider('http://127.0.0.1:8545');

let provider = ropstenProvider;
let web3 = new Web3(providers=provider);

if (!web3.isConnected) throw new Error('Unable to connect to ethereum node at ' + provider.host)
else console.log('Connected to ethereum node at ' + provider.host);

// [Done] Check the balance
const myAddress     = '0xd46310Aa50aEEEABfB239e209d06428Fc99d0a39';
const leoAddress    = '0x5C1BE9555ed4473f76DBf142121227aa5468251E';
const myPrivateKey  = Buffer.from('FDD4266BEF7492882D94B24FF3595E647E1E01A7E2765804F447C55CC1AFF0CD', 'hex');

const heritageABI = [
	{
		"constant": false,
		"inputs": [],
		"name": "die",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "loadLastWords",
		"outputs": [
			{
				"name": "x",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "loadBalance",
		"outputs": [
			{
				"name": "amount",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"name": "_lastWord",
				"type": "string"
			},
			{
				"name": "_toAddress",
				"type": "address"
			}
		],
		"payable": true,
		"stateMutability": "payable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "TargetAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "money",
				"type": "uint256"
			}
		],
		"name": "sent",
		"type": "event"
	}
]
const contract    = web3.eth.contract(heritageABI);

function getBalance (address) {
    var balance = web3.fromWei(web3.eth.getBalance(address), 'ether');
    return balance
}

function findContract (address, abi) {
    // var contract = web3.eth.contract(abi, address);
    var contract = web3.eth.contract(abi);
    var contractInstance = contract.at(address);

    return contractInstance
}

function trigger (contract, contractAddress) {
    var contractInstance = contract.at(contractAddress);
    var result;

    web3.eth.getTransaction(myAddress, function (err, txCount) {
        const txObject = {
            nonce: web3.toHex(txCount),
            to: contractAddress,
            gasLimit: web3.toHex(42000),
            gasPrice: web3.toHex(web3.toWei('10', 'gwei')),
            data: contractInstance.die.getData()
        }

        const tx = new Tx(txObject);
        tx.sign(myPrivateKey);
        const serializedTransaction = tx.serialize();
        const raw = '0x' + serializedTransaction.toString('hex');

        web3.eth.sendRawTransaction(raw, function (err, txHash) {
            if (err) console.log(err);
            else result = txHash;
        })
    })
    return result
}


module.exports.myAddress     = myAddress;
module.exports.targetAddress = leoAddress;
module.exports.getBalance    = getBalance;
module.exports.findContract  = findContract;
module.exports.abi           = heritageABI;
module.exports.trigger       = trigger;
module.exports.contract      = contract;