const findStationsBtn = document.getElementById('findStationsBtn');
const statusDiv = document.getElementById('status');
const stationsList = document.getElementById('stationsList');

const stationsData = [
    { name: "Station A", lat: 48.8566, lon: 2.3522 },
    { name: "Station B", lat: 48.8570, lon: 2.3500 },
    { name: "Station C", lat: 48.8580, lon: 2.3550 }
];

function distance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2-lat1) * Math.PI/180;
    const dLon = (lon2-lon1) * Math.PI/180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) *
        Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return R * c;
}

function findNearbyStations(userLat, userLon) {
    const nearby = stationsData
        .map(station => {
            const dist = distance(userLat, userLon, station.lat, station.lon);
            return { ...station, distance: dist };
        })
        .filter(station => station.distance <= 5)
        .sort((a,b) => a.distance - b.distance);

    return nearby;
}

findStationsBtn.addEventListener('click', () => {
    stationsList.innerHTML = '';
    statusDiv.textContent = 'Recherche en cours...';
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                const nearby = findNearbyStations(latitude, longitude);

                if (nearby.length === 0) {
                    statusDiv.textContent = "Aucune station trouvée autour de vous.";
                } else {
                    statusDiv.textContent = `Stations trouvées (${nearby.length}) :`;
                    nearby.forEach(station => {
                        const li = document.createElement('li');
                        li.textContent = `${station.name} - ${station.distance.toFixed(2)} km`;
                        stationsList.appendChild(li);
                    });
                }
            },
            error => {
                statusDiv.textContent = "Impossible de récupérer votre position. Veuillez activer la géolocalisation.";
            }
        );
    } else {
        statusDiv.textContent = "Votre navigateur ne supporte pas la géolocalisation.";
    }
});