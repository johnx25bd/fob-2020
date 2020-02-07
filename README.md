# DSAT: Decentralized Spatial Asset Tracking

This project, developed by the @LondonBlockchainLabs technical team for the 2020 [Future of Blockchain](https://www.futureofblockchain.co.uk/) competition, fuses trusted IoT, enclave computing and smart contracts to create a decentralized spatial asset tracking and governance system.

Our goal is to build a decentralized system to detect where connected sensors are located on Earth and apply policies accordingly, using smart contracts. We see many potential use cases for this - enforcing congestion or exclusion zones, taxing or tolling systems, automatically granting entry to restricted areas, and so on.

Why does this need blockchain? Our intent is to develop a prototype system that would enable sovereign governments and vehicle manufacturers to coordinate efficiently. Consider the use case of international trucking in the UK and EU. Trucks built by a diverse range of manufacturers travel through multiple sovereign jurisdictions to transport goods from origin to destination. The system we envision would provide a simple interface for countries to manage their jurisdiction and apply and enforce policies, and simplify the technology vehicle manufacturers need to implement in order to comply with all participating countries' laws. Additionally, by using trusted IoT devices, the privacy of potentially sensitive commercial or personal information captured by connected vehicles could be maintained, while still enabling sophisticated location detection and policy enforcement.

Elements of the architecture include:
- Jurisdiction Registry, where countries register geospatial data representing their areas of enforcement. This could be thought of as congestion zones in urban areas, though that is just a simple use case.
- Vehicle Registry, where vehicle owners claim ownership of a vehicle's embedded sensor, and therefore responsibility for where that vehicle travels. In this proof of concept funds are staked to this smart contract to enable them to be slashed when a vehicle enters a Restricted Zone - thought of as a toll, congestion charge or tax.
- IoTeX Pebble trackers embedded in registered vehicles capturing (and signing) environmental data including GPS coordinates.
- Cloud bucket to store Pebble data.
- A NodeJS program running on a cloud server that tests vehicle locations to detect if they are within a Restricted Zone. If so, a slashing function is invoked, effectively charging the vehicle owner for that vehicle entering the Restricted Zone.
- An interactive dashboard visualizing the Restricted Zones and the locations of vehicles in the system.

Feedback is very welcome - please email john.iv@x25bd.com if you have any ideas. 🙏

# Interfaces:

[`./vehicle-registry/README.md`](./vehicle-registry/README.md)

[`./jurisdiction-registry/`](./jurisdiction-registry/README.md)

[Node Cloud Program](./cloud/README.md)

[Dashboard](./dashboard/README.md)
