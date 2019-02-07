pragma solidity 0.5.0;

contract Heritage {
    string lastWord;
    address payable to;
    address payable owner;
    uint password;
    
    // Record the "sending event"
    event sent(
        address sender,
        address TargetAddress, 
        uint money
    );
    
    // The function which have set onlyOwner, can be triggle 
    // by owner only (owner defined in constructor)
    modifier onlyOwner(){
        require(msg.sender == owner);
        _;      // Do the actions
    }

    constructor (
        string memory _lastWord, 
        address payable _toAddress
    ) 
        public payable
    {
        owner = msg.sender;
        lastWord = _lastWord;
        to = _toAddress; 
    }

    function die() public payable onlyOwner{
        uint256 remain = address(this).balance;
        // to.send(remain);
        to.transfer(remain);
        emit sent(msg.sender, to, address(this).balance);
    }
    
    function loadLastWords() public view returns (string memory x) {
        return lastWord;
    }
    
    function loadBalance() public view onlyOwner returns (uint amount){
        return address(this).balance;
    } 
}