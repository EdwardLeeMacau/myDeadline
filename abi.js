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

module.exports.abi = heritageABI;