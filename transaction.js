/*  
  FileName     [ index.js ]
  PackageName  [ lastword ]
  Synopsis     [ Connect to Ropsten with Infura API ]

  library
  * web3.js         @ 0.20.7
  * ethereumjs-tx   @ 1.3.7

  Tools
  * Ganache / Testrpc:
    Mnemonic: [waste version earth federal account gain eager collect flash lava used arrow]
  * Remix: Solidity @0.5.2

  Notes: 
  Part 1: Pure transaction.
  Part 2: Trigger the smart contract.
*/

const Web3 = require('web3');
const Tx   = require('ethereumjs-tx');

const ropstenProvider  = new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/dafef60eafe847d6b780a5b0fcc770e6');
const web3 = new Web3(providers=ropstenProvider);

if (!web3.isConnected) throw new Error('Unable to connect to ethereum node at ' + ropstenProvider.host);
else console.log('Connected to ethereum node at ' + ropstenProvider.host);

const myAddress       = '0xd46310Aa50aEEEABfB239e209d06428Fc99d0a39';
const leoAddress      = '0x5C1BE9555ed4473f76DBf142121227aa5468251E';
const myPrivateKey    = Buffer.from('FDD4266BEF7492882D94B24FF3595E647E1E01A7E2765804F447C55CC1AFF0CD', 'hex');
const leoPrivatekey   = Buffer.from('9F5F1DBEDCC1DA0E88CEB058D809DDC97B69DC08751D10005247B0AB4DED1EF3', 'hex');
const contractAddress = '0xbd200117a253d8459815212b09332e4dde708a8f';

// Pure transaction
web3.eth.getTransactionCount(leoAddress, function (err, txCount) {
    const txObject = {
        nonce: web3.toHex(txCount),
        to: myAddress,
        value: web3.toHex(web3.toWei('27', 'ether')),
        gasLimit: web3.toHex(21000),
        gasPrice: web3.toHex(web3.toWei('10', 'gwei')),
        data: ''
    }

    const tx = new Tx(txObject);
    tx.sign(leoPrivatekey);

    const serializedTransaction = tx.serialize();
    const raw = '0x' + serializedTransaction.toString('hex');

    web3.eth.sendRawTransaction(raw, function (err, txHash) {
        if (!err) console.log('TxHash:', txHash);
        else console.log(err);
    })
})

/*
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

// Trigger the smart contract
var contract = web3.eth.contract(heritageABI);
var contractInstance = contract.at(contractAddress);

web3.eth.getTransactionCount(myAddress, function (err, txCount) {
    const txObject = {
        nonce: web3.toHex(txCount),
        to: contractAddress,
        gasLimit: web3.toHex(42000),
        gasPrice: web3.toHex(web3.toWei('10', 'gwei')),
        data: contractInstance.die.getData()
    }

    console.log(txObject)

    const tx = new Tx(txObject);
    tx.sign(myPrivateKey);

    const serializedTransaction = tx.serialize();
    const raw = '0x' + serializedTransaction.toString('hex');

    web3.eth.sendRawTransaction(raw, function (err, txHash) {
        if (!err) console.log('TxHash:', txHash);
        else console.log(err);
    })
})

function trigger (instance, address) { 
    web3.eth.getTransactionCount(myAddress, function (err, txCount) {
        const txObject = {
            nonce: web3.toHex(txCount),
            to: address,
            gasLimit: web3.toHex(42000),
            gasPrice: web3.toHex(web3.toWei('10', 'gwei')),
            data: instance.die.getData()
        }

        console.log(txObject);

        
    })    
}

trigger(contractInstance, contractAddress);
*/