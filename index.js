/*  
  FileName     [ index.js ]
  PackageName  [ lastword ]
  Synopsis     [  ]

  library
  * express     @ 4.16.4
  * ejs         @ 2.6.1
  * path        @ 0.12.7
  * body-parser @ 1.18.3    -> provide RESTful
*/

const express    = require('express');
const path       = require('path');
const bodyParser = require('body-parser')
const Web3       = require('web3');
const Tx         = require('ethereumjs-tx');
const abi        = require('./abi');

var app      = express();
var provider = new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/dafef60eafe847d6b780a5b0fcc770e6');
var web3     = new Web3(providers=provider);
if (!web3.isConnected) throw new Error('Unable to connect to ethereum node at ' + provider.host)
else console.log('Connected to ethereum node at ' + provider.host);

const myAddress     = '0xd46310Aa50aEEEABfB239e209d06428Fc99d0a39';
const leoAddress    = '0x5C1BE9555ed4473f76DBf142121227aa5468251E';
const myPrivateKey  = Buffer.from('FDD4266BEF7492882D94B24FF3595E647E1E01A7E2765804F447C55CC1AFF0CD', 'hex');

const contractABI = abi.abi;
const contract    = web3.eth.contract(contractABI);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.render(path.join(__dirname, './views/index.ejs'));
})

app.get('/update', function(req, res) {
    console.log('Execute update...')
    
    const myBalance     = web3.fromWei(web3.eth.getBalance(myAddress), 'ether').toFixed(4);
    const targetBalance = web3.fromWei(web3.eth.getBalance(leoAddress), 'ether').toFixed(4);

    console.log('My Balance:     ', myBalance, 'ETHER');
    console.log('Target Balance: ', targetBalance, 'ETHER');

    res.send({myBalance, targetBalance});
})

app.get('/demo/:address', function(req, res) {
    console.log('Execute demo...')

    const address = req.params.address;
    const contractInstance = contract.at(address);

    web3.eth.getTransactionCount(myAddress, function (err, txCount) {
        const txObject = {
            nonce: web3.toHex(txCount),
            to: address,
            gasLimit: web3.toHex(42000),
            gasPrice: web3.toHex(web3.toWei('10', 'gwei')),
            data: contractInstance.die.getData()
        }

        const tx = new Tx(txObject);
        tx.sign(myPrivateKey);
        const serializedTransaction = tx.serialize();
        const raw = '0x' + serializedTransaction.toString('hex');

        web3.eth.sendRawTransaction(raw, function (err, txHash) {
            if (!err) {
                console.log(txHash);
                res.send(txHash);
            }
            else console.log(err);
        })
    })
})

app.get('/contractState/:address', function(req, res) {
    console.log('Execute findContract...')
    
    const address  = req.params.address;
    const contractInstance = contract.at(address);
    
    var balance  = web3.fromWei(web3.eth.getBalance(address), 'ether').toFixed(4);
    var lastword = contractInstance.loadLastWords.call();
    
    res.send({lastword, balance});
})

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Listening at http://%s:%s', host, port);
});

