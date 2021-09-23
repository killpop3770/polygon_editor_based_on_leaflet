var map = L.map('map', {
    center: [0.5, 0.9],
    minZoom: 9.4,
    maxZoom: 10,
    zoom: 9.5,
    zoomControl: false,
});

var imageUrl = 'https://i.pinimg.com/originals/3a/2c/61/3a2c61d24fb552bdcc45381916134a9b.jpg',
    imageBounds = [
        [0.0, 0.0],
        [1.0, 1.78]
    ];

L.imageOverlay(imageUrl, imageBounds).addTo(map);

var editableLayers = new L.FeatureGroup();

map.addLayer(editableLayers);

// Disable zooming for map
map.touchZoom.disable();
map.doubleClickZoom.disable();
// map.scrollWheelZoom.disable();
map.boxZoom.disable();
map.keyboard.disable();

// Disable dragging map for mouse
$('html').mousedown( function() {
    map.dragging.disable();
});

var options = {

    position: 'topright',

    // Disable all except polygon shape
    draw: {
        polyline: false,
        polygon: {
            allowIntersection: false, // Restricts shapes to simple polygons
            drawError: {
                color: '#e1e100', // Color the shape will turn when intersects
                message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
            },
            shapeOptions: {
                color: '#bada55'
            }
        },
        circle: false,
        rectangle: false,
        marker: false
    },

    edit: {
        featureGroup: editableLayers, //REQUIRED!!
        remove: true,
    }
};

var drawControl = new L.Control.Draw(options);
map.addControl(drawControl);

// map.on(L.Draw.Event.CREATED, function (e) {
//
//     var type = e.layerType;
//     var layer = e.layer;
//
//     processLayer(layer);
//     editableLayers.addLayer(layer);
// });

map.on('draw:created', function (e) {

    var type = e.layerType;
    var layer = e.layer;

    processLayer(layer);
    editableLayers.addLayer(layer);
})

//JSON data for transfer
function processLayer(layer) {

  var geojson = layer.toGeoJSON();
  var geometryString = JSON.stringify(geojson.geometry);
  console.log(geometryString)

  // var id = $('#idinput').val()

  var command = 'ECHO: \n\'' + geometryString;// + '\' >> ' + id + '.json'

  $('#textarea').val(command);
}