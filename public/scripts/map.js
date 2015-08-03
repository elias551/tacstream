$(document).ready(function () {
    
    var location = navigator.geolocation.getCurrentPosition(function (location) {

        var map = L.map('map').setView([location.coords.latitude, location.coords.longitude], 13);
        
        var OpenStreetMap_Mapnik = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        });
        
        OpenStreetMap_Mapnik.addTo(map);
    });
});
