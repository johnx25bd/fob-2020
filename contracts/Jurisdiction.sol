pragma solidity ^0.5.2;

contract Jurisdiction {

    address public owner; // likely a jurisdiction's DAO contract address ...
    string public ipfsAddress;
    string public name;
    uint public tax;


    constructor (string memory _name, string memory _ipfsAddress, uint _tax) public {

        owner = msg.sender;
        tax = _tax;
        name = _name;
        ipfsAddress = _ipfsAddress;

    }

    modifier owned (address _account) {
        require (msg.sender == owner, "Sorry, owner must call function");
        _;
    }


    function () external payable {

    }

    function getBalance () public view returns (uint balance_) {
        return address(this).balance;
    }


    function updateTaxRate (uint _newTaxRate) public owned(owner) {
        tax = _newTaxRate;
    }

    function updateJurisdictionName (string memory _newName) public owned(owner)  {
        name = _newName;
    }

    function updateIpfsAddress (string memory _newIpfsAddress)  public owned(owner) {
        ipfsAddress = _newIpfsAddress;
    }

    function transferOwnership (address _newOwner) public owned(owner)  {
        owner = _newOwner;
    }

    // function withdraw (address _recipient, uint _amount) public owned(owner) {
    //   require(_amount <= address(this).balance);

    //   _recipient.transfer(_amount);


    // }


}
