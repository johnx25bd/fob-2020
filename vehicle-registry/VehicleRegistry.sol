pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import "https://raw.githubusercontent.com/OpenZeppelin/openzeppelin-contracts/master/contracts/math/SafeMath.sol";
import "https://raw.githubusercontent.com/OpenZeppelin/openzeppelin-contracts/master/contracts/ownership/Ownable.sol";

contract VehicleRegistry is Ownable {
    using SafeMath for uint256;
    uint256 MIN_STAKE = 100;
    uint256 SLASH_AMOUNT = 20;

    struct StakeInfo {
        bool exists;
        uint256 unclaimedSlashRewards;
        Vehicle[] vehicles;
    }

    struct Vehicle {
        string id;
        uint256 amount;
        uint256 expires;
    }

    mapping(string => StakeInfo) stakeholders;

    function lockCoins(string memory ownerDID, string memory vehicleDID, uint256 lockAmount, uint8 lockTime) public payable {
        require(lockAmount > MIN_STAKE, "You need to stake more than 100 tokens.");
        StakeInfo storage userInfo = stakeholders[ownerDID];
        if (compareStrings(userInfo.vehicles[userInfo.vehicles.length - 1].id, vehicleDID)) {
            userInfo.vehicles[userInfo.vehicles.length - 1].expires = block.timestamp + lockTime * 1 minutes;
            userInfo.vehicles[userInfo.vehicles.length - 1].amount = lockAmount;
        } else {
            revert("Could not lock coins, can't find correct vehicleDID");
        }
    }

    function withdraw(string memory ownerDID, string memory vehicleDID, uint256 withdrawAmount) public {
        StakeInfo storage userInfo = stakeholders[ownerDID];
        for (uint i = 0; i < userInfo.vehicles.length; i++) {
            if (compareStrings(userInfo.vehicles[i].id, vehicleDID)) {
                require(block.timestamp >= userInfo.vehicles[i].expires, "You can't withdraw before your stake expiry date passes.");
                require(address(this).balance > withdrawAmount);
                userInfo.vehicles[i].expires = 0;
                userInfo.vehicles[i].amount -= withdrawAmount;
                msg.sender.transfer(withdrawAmount);
                return;
            }
        }
        revert("You do not own a vehicle with this DID");
    }

    function slash(uint256 slashAmount, string memory slashedOwnerDID, string memory slashedVehicleDID, string memory paidDID) public onlyOwner {
        StakeInfo storage toBeSlashedInfo = stakeholders[slashedOwnerDID];
        StakeInfo storage toBePaidInfo = stakeholders[paidDID];
        for (uint i = 0; i < toBeSlashedInfo.vehicles.length; i++) {
            if (compareStrings(toBeSlashedInfo.vehicles[i].id, slashedVehicleDID)) {
                toBeSlashedInfo.vehicles[i].amount -= slashAmount;
                toBePaidInfo.unclaimedSlashRewards += slashAmount;
                return;
            }
        }
        revert("Owner does not have a vehicle with provided DID");
    }


    function registerVehicle (string memory ownerDID, string memory vehicleDID, uint8 lockTime) public payable {
        require(msg.value >= MIN_STAKE, "You need to stake at least 100 wei");
        if (!this.isStakeholder(ownerDID)) {
            stakeholders[ownerDID].exists = true;
            stakeholders[ownerDID].unclaimedSlashRewards = 0;
        }
        for (uint i = 0; i < stakeholders[ownerDID].vehicles.length; i++) {
            require(!compareStrings(stakeholders[ownerDID].vehicles[i].id, vehicleDID), "This device is already registered!");
        }

        stakeholders[ownerDID].vehicles.push(Vehicle(vehicleDID, 0, 0));
        this.lockCoins(ownerDID, vehicleDID, msg.value, lockTime);
    }

    function isStakeholder(string memory ownerDID) public view returns (bool) {
        return stakeholders[ownerDID].exists;
    }

    function deleteStakeholder(string memory ownerDID) public {
        stakeholders[ownerDID].exists = false;
    }

    function getVehicles(string memory ownerDID) public view returns (string[] memory, uint256[] memory, uint256[] memory) {
        string[] memory ids = new string[](stakeholders[ownerDID].vehicles.length);
        uint256[] memory amounts = new uint256[](stakeholders[ownerDID].vehicles.length);
        uint256[] memory expires = new uint256[](stakeholders[ownerDID].vehicles.length);

        for (uint i = 0; i < stakeholders[ownerDID].vehicles.length; i++) {
            Vehicle storage vehicle = stakeholders[ownerDID].vehicles[i];
            ids[i] = vehicle.id;
            amounts[i] = vehicle.amount;
            expires[i] = vehicle.expires;
        }
        return (ids, amounts, expires);
    }

    function compareStrings (string memory a, string memory b) internal pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }

}
