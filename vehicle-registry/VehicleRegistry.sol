pragma solidity ^0.5.12;
import "https://raw.githubusercontent.com/OpenZeppelin/openzeppelin-contracts/master/contracts/math/SafeMath.sol";
import "https://raw.githubusercontent.com/OpenZeppelin/openzeppelin-contracts/master/contracts/ownership/Ownable.sol";
contract VehicleRegistry is Ownable {
    using SafeMath for uint256;
    uint256 MIN_STAKE = 100;
    uint256 SLASH_AMOUNT = 20;
    struct stakeInfo {
        uint256 expires;
        uint256 amount;
        bool exists;
    }
    mapping(address => stakeInfo) stakeholders; // Maybe map from a DID instead of address?? But then how do we get that DID from the Pebble data?
        // OR, it should be a 'parent DID', and inside stakeInfo we have the DIDs of each vehicle belonging to the parent. But how do we easily get the parent's iotex address?
        // For first iteration, just map from address to a single vehicle, say each pebble has its own stake.
    function lockCoins(uint256 lockAmount, uint8 lockTime) public payable {
        require(lockAmount > MIN_STAKE, "You need to stake more than 100 tokens.");
        stakeInfo storage userInfo = stakeholders[msg.sender];
        userInfo.expires = block.timestamp + lockTime;
        userInfo.amount = lockAmount;
    }
    function withdraw(uint256 withdrawAmount) public {
        stakeInfo storage userInfo = stakeholders[msg.sender];
        require(block.timestamp >= userInfo.expires, "You can't withdraw before your stake expiry date passes.");
        require(address(this).balance > withdrawAmount);
        userInfo.expires = 0;
        userInfo.amount -= withdrawAmount;
        msg.sender.transfer(withdrawAmount);
    }
    // After checking in node whether pebble is in polygon, if returns False, slash is called using the private key of the "central authority"
    function slash(uint256 slashAmount, address toBeSlashed) public onlyOwner {
        stakeInfo storage toBeSlashedInfo = stakeholders[toBeSlashed];
        require(toBeSlashedInfo.expires > block.timestamp); // Don't slash if they aren't staking
        toBeSlashedInfo.amount -= slashAmount;
    }
    function registerVehicle (uint256 stakeAmount) public payable {
        require(!this.isStakeholder(msg.sender), "You are already registered");
        require(stakeAmount >= MIN_STAKE);
        stakeInfo memory newStakeInfo = stakeInfo(
            0,
            0,
            true
        );
        stakeholders[msg.sender] = newStakeInfo; // or newVehicle
        this.lockCoins(msg.value, 0);
    }
    function isStakeholder(address _address) public view returns (bool) {
        return stakeholders[_address].exists;
    }
    function getStakeAmount(address _address) public view returns (uint256) {
        return stakeholders[_address].amount;
    }
    function distributeRewards() public {
        // Periodically redistribute slashed amounts to accounts that are operating well?
        // Send most of it to the jurisdiction that has been imposed upon
    }
    // Extensions:
    // Allow a single entity to have multiple vehicles associated with one stake
    // Allow entity to register multiple vehicles in one transaction
    // Add support for multiple stake methods, IOTX and ERC-20 tokens like DAI or our own token
}
