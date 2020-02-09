### Dashboard TO DO 

- [ ]  Build dashboard
    - [ ]  Fetch data
        - [ ]  Registered exclusion zones (geojson from arweave from registry)
        - [ ]  Registered vehicles, metadata and last known points.
    - [ ]  Populate map with points and most recent locations
    - [ ]  Put table or something on right panel with each registered
    - [ ]  Write updatePosition() function
        - [ ]  Select that vehicle
        - [ ]  attrTween to new position ...
        - [ ]  Update most recent position in right table
        - [ ]  Update status - in exclusion zone or not
        - [ ]  Update fees paid or total fees paid (from contract?)
        - [ ]  Include tx ids and links to block explorer?
    - [ ]  Connect dashboard to node program (using socket.io?)
    - [ ]  Write into node program to push new data out via websocket as part of process
