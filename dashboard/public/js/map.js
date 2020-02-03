// Create mapbox map
/*

This code was written for a UCL masters project in 2019.

*/

// Set global variables
var dims = {
  h: window.innerHeight,
  w: window.innerWidth
}

// Instantiate mapbox map:
mapboxgl.accessToken = 'pk.eyJ1Ijoicm9iaXNvbml2IiwiYSI6ImNqbjM5eXEwdjAyMnozcW9jMzdpbGk5emoifQ.Q_S2qL8UW-UyVLikG_KqQA';

var map = new mapboxgl.Map({
  container: 'main-map',
  style: 'mapbox://styles/mapbox/light-v10',
  center: [50, 10],
  zoom: 1
});

map.addControl(
  new mapboxgl.NavigationControl(),
  'top-left'
);

map.addControl(
  new mapboxgl.ScaleControl({
    maxWidth: 80,
    unit: 'imperial'
  }),
  'bottom-left'
);

var popup = new mapboxgl.Popup({
  closeButton: false,
  closeOnClick: false,
  anchor: 'left'
});





// Setup our svg layer that we can manipulate with d3
var container = map.getCanvasContainer();
var svg = d3.select(container).append("svg")

// we calculate the scale given mapbox state (derived from viewport-mercator-project's code)
// to define a d3 projection
function getD3() {
  var bbox = document.body.getBoundingClientRect();
  var center = map.getCenter();
  var zoom = map.getZoom();
  // 512 is hardcoded tile size, might need to be 256 or changed to suit your map config
  var scale = (512) * 0.5 / Math.PI * Math.pow(2, zoom);

  var d3projection = d3.geoMercator()
    .center([center.lng, center.lat])
    .translate([bbox.width / 2, bbox.height / 2])
    .scale(scale);

  return d3projection;
}
// calculate the original d3 projection
var d3Projection = getD3();

var path = d3.geoPath()

var url = "http://enjalot.github.io/wwsd/data/UK/london_stations.topojson";
d3.json(url).then( function(data) {
  console.log(data);
  var points = topojson.feature(data, data.objects.london_stations)
  console.log(points);

  //console.log(data[0], getLL(data[0]), project(data[0]))
  var dots = svg.selectAll("circle.dot")
    .data(points.features)

  dots.enter().append("circle").classed("dot", true)
    .attr("r", 1)
    .style('fill', "#0082a3")
    .style("fill-opacity", 0.6)
    .style('stroke', "#004d60")
    .style("stroke-width", 1)

    // .transition().duration(1000)
    .attr("r", 6);

  function render() {
    d3Projection = getD3();
    path.projection(d3Projection)

    dots
      .attr('cx', function(d) {
          var x = d3Projection(d.geometry.coordinates)[0];
          console.log('Cx', x)

          return x
        })
      .attr('cy', function(d) {
          var y = d3Projection(d.geometry.coordinates)[1];
          return y
        },
      )
  }

  // re-render our visualization whenever the view changes
  map.on("viewreset", function() {
    render()
  })
  map.on("move", function() {
    render()
  })

  // render our initial visualization
  render()
}).catch(err => console.log(err))('');






// establish websockets connection with node server

// Fetch all vehicles currently in the system

// interpret

// Fetch
