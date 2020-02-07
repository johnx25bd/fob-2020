// This script runs inside the enclave.

SecureWorker.importScripts('imports.js')

SecureWorker.onMessage(function (message) {
    if (message.type === 'pointInPolygonCheck') {
        // Loop over each jurisdiction in input one by one and check if in polygon
        for (const [jurisdiction, poly] of Object.entries(message.polygons)) {
            let res = pointInPolygon.default(turf.point(message.point), turf.polygon(poly));
            SecureWorker.postMessage({
                type: 'pointInPolygonResponse',
                jurisdiction,
                inPolygon: res
            })
        }
    }
});


