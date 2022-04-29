const myMap = {
	coordinates: [],
	businesses: [],
	map: {},
	markers: {},
                        


// Create map                                                      
makeMap() { 
    this.map = L.map('map').setView(this.coordinates, 11)
   
//Create tile layer  
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map Data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    minZoom: '15'
}).addTo(this.map)


// Create geolocation marker
const marker = L.marker(this.coordinates) 
marker
.addTo(this.map)
.bindPopup('<p1><b>you are here</b></p1>')
.openPopup()
},

//business markers
addMarkers() {
    for (let i = 0; i < this.businesses.length; i++) {
    this.markers = L.marker([
        this.businesses[i].lat,
        this.businesses[i].long,
    ])
        .bindPopup(`<p1>${this.businesses[i].name}</p1>`)
        .addTo(this.map)
    }
},

}
  // Get  coordinates                                                             
  async function getCoords(){
	const pos = await new Promise((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(resolve, reject)
	});
	return [pos.coords.latitude, pos.coords.longitude]
}
console.log(getCoords());

async function getFoursquare(business){
    const options = {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: 'fsq328dR8dLAONeVkqzl3E23jwNA2Ar8YRxRzcm9Nd/rjJM='
        }
      };
    let limit = 5
	let lat = myMap.coordinates[0]
	let lon = myMap.coordinates[1]
	let response = await fetch(`https://api.foursquare.com/v3/places/search?query=${business}%20type&ll=${lat}%2${lon}imit=${limit}`, options)
    let data = await response.text()
	let parsedData = JSON.parse(data)
	let businesses = parsedData.results
	return businesses
    }
    // process foursquare array
function processBusinesses(data) {
	let businesses = data.map((element) => {
		let location = {
			name: element.name,
			lat: element.geocodes.main.latitude,
			long: element.geocodes.main.longitude
		};
		return location
	})
	return businesses
}


// event handlers
// window load
window.onload = async () => {
	const coords = await getCoords()
	myMap.coordinates = coords
	myMap.makeMap()
}

// business submit button
document.getElementById('submit').addEventListener('click', async (event) => {
	event.preventDefault()
	let business = document.getElementById('business').value
	let data = await getFoursquare(business)
	myMap.businesses = processBusinesses(data)
	myMap.addMarkers()
})


    