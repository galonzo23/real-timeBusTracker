// This array contains the coordinates for the current stop:
var currentStop = [];

// adding Mapbox access token:
mapboxgl.accessToken = '';

// Initiating the map instance:
let map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/dark-v10',
  center: [-71.104081, 42.365554],
  zoom: 13,
});

// create the popup
var popup = new mapboxgl
      .Popup({ offset: 25 })
      .setText(`${new Date()}`);

// adding a marker at the center of the map to initialize
var marker = new mapboxgl.Marker({ color: 'red'})
      .setLngLat([-71.104081, 42.365554])
      .setPopup(popup)
      .addTo(map);

// Requests bus data from MBTA
async function getBusLocations(){
	const url = 'https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip';
	const response = await fetch(url);
	const json     = await response.json();
	return json.data;
}

// Moving the marker on the map every 15000ms, using the Mapbox function marker.setLngLat() to update the marker coordinates
async function move() {  
  // get bus data    
	const locations = await getBusLocations();

	console.log(new Date());
	console.log(locations);

  //add current location to the currentStop array:
  currentStop.push(locations[0].attributes.longitude, 
                   locations[0].attributes.latitude);

  //move marker to current location:
  marker.setLngLat(currentStop);

  //update popup text:
  popup.setText(`${new Date()}`);

  //reset currentStop array:
  currentStop = [];

  setTimeout(move, 15000);
}

if (typeof module !== 'undefined') {
  module.exports = { move };
}