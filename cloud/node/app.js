var request = require('request');



// Just fetching geoJSON from (hard coded) arweave urls:

// This object will ideally be fetched from
// a smart contract registry of these strings ...
var zones = {
  london: {
    arweave: "https://arweave.net/0KCazCF6ok3x37C9TThXCUpnq5jpYD7h-YYFUOcBHmw",
    ipfs: "https://ipfs.io/ipfs/QmdG9DLEP9ha9qHZYR7v8dYwFD9PkKSACoZZyZ6J52r6pr"
  },
  berlin: {
    arweave: "https://arweave.net/WHYZxyw_AL--zROiJlF_oMf2AQytiMgo5j3tTL-9JPU",
    ipfs: "https://ipfs.io/ipfs/QmbsryEzoZhTK3GLJSz2Rp6BrNeLhs69XUEu1auvaFQv1Y"
  },
  paris: {
    arweave: "https://arweave.net/EGbLOMIsqGNQ9BM_sHskfKWYVuqESM8tVwcoHx65Z1c",
    ipfs: "https://ipfs.io/ipfs/QmcGJotvEs25KFLyxe6Y2jiXZUBaYsqJZbDPWxYpdeJqND"
  }
};



// This is kind of working but I think we should use promises ...
for (key of Object.keys(zones)) {

  request({
    url: zones[key].arweave,
    json: true
  }, function(error, response, body) {
    if (!error && response.statusCode === 200) {

      zones[key].geojson = body;
      console.log('zones', zones);

    }
  });
}
