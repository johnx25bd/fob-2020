pragma solidity ^0.5.12;
// vvvv --- Completely unvalidated pseudocode --- vvvv

contract VehicleRegistry {

  struct Vehicle {
    // Some struct to represent a vehicle
    bytes32 DID; // bytes32?

    int stake; // signed int enables vehicles to go into debt



  }

  address admin;
  uint stake; // the amount required to stake to register a vehicle.

  //
  mapping (address => mapping(bytes32 => Vehicle)) public fleets;
    // ^^ Each fleet owner address references a mapping of
    //    Vehicle structs referenced by DID.


  constructor (uint _stakeAmount) {
    admin = msg.sender;

    stakeAmount = _stakeAmount;

  }


  function registerVehicle (
    _vehicleDID, // vehicle identifier - pebble DID

    ) public payable {

      require(msg.value >= stake);
      // Check to see if vehicle is already registered?

      Vehicle newVehicle = Vehicle(
        _vehicleDID,
        // address vehicleOwner, // don't need owner address due to structure of contract?

        stake, // class variable - in this version each vehicle gets same amount of funds staked

        )


      fleets[msg.sender][_vehicleDID] = newVehicle;

      // Questions:
        // Can a user register an array of vehicles?
        // ^^ Much more user friendly ...

    }

    function registerMultipleVehicles (
      // Vehicle[] _vehiclesToRegister, ...?
      ) public payable {

        // Make sure enough money is included:
        require(msg.value > _vehiclesToRegister.length * stake);

        // loop through array, calling registerVehicle(vehicle) for each element.
          // Will this work calling a payable function within a payable function?


      }




}
