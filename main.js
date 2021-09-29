


//================= Options for map and main image ==================================
let image = new Image();
let imageUrl = 'https://i.pinimg.com/originals/3a/2c/61/3a2c61d24fb552bdcc45381916134a9b.jpg';
image.src = imageUrl;
let width = image.width;
let height = image.height;
let imageBounds = [
    [0.0, 0.0],
    [height, width]
];
//===================================================================================



//=============== Create map and main layer for image ===============================
let map = L.map('map', {
    crs: L.CRS.Simple,
    center: [height/2, width/2],
    // minZoom: 9.4,
    // maxZoom: 10,
    zoom: 0,
    zoomControl: false,
    editable: true,
    tilt0: true,
});

L.imageOverlay(imageUrl, imageBounds).addTo(map);

let editableLayers = new L.FeatureGroup();
map.addLayer(editableLayers);
//===================================================================================



//============== Remove watermark from map ==========================================
var node = document.querySelector('[title="A JS library for interactive maps"]');
node.remove();
//===================================================================================



//============== Disable options of moving image ====================================
// Disable zooming for map
map.touchZoom.disable();
map.doubleClickZoom.disable();
map.scrollWheelZoom.disable();
map.boxZoom.disable();
map.keyboard.disable();
// Disable dragging map for mouse
$('html').mousedown(function () {
    map.dragging.disable();
});
//===================================================================================



//=============== Options for toolbar ===============================================
let options = {

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
        circlemarker: false,
        circle: false,
        rectangle: false,
        marker: false
    },

    edit: {
        featureGroup: editableLayers, //REQUIRED!!
        remove: true,
    }
};
let drawControl = new L.Control.Draw(options);
map.addControl(drawControl);
//===================================================================================



//================= Polygon Draw Listener ===========================================
map.on(L.Draw.Event.CREATED, function (e) {

    let layer = e.layer;
    // let toString = {}.toString;
    // console.log( toString.call(layer) ); // [object Array]

    processLayer(layer);
    let color0 = getRandomColor();
    editableLayers.addLayer(layer.setStyle({color: color0, fillColor: color0, opacity: 0.5}));
});
//====================================================================================



//================ JSON data for transfer ===========================================
let geometryString;
let countOfPoly = 0;
function processLayer(layer) {

    let geojson = layer.toGeoJSON();
    if (countOfPoly >= 1) {
        geometryString += ', ';
    }
    geometryString += JSON.stringify(geojson.geometry);
    countOfPoly += 1;
    console.log(geometryString)

    // var id = $('#idinput').val()
    let command = 'ECHO: \n\'' + geometryString;// + '\' >> ' + id + '.json'

    $('#textarea').val(command);
}
//===================================================================================



//================== Color randomizer ===============================================
const Colors = [ 'BADA55', 'FF18C9', '23F65D', '0200F5', 'FCFF0F' ];
function getRandomColor() {

    let color = '#';
    color += Colors[Math.floor(Math.random() * 5)];

    return color;
}
//===================================================================================