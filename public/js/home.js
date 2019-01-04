console.log("JS Conectado");
var map;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 19.391003, lng: -99.284041},
      zoom: 5
    });

    marker = new google.maps.Marker;
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
    
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
    
          var image = {
              url: "images/logo2.png",
              scaledSize: new google.maps.Size(30, 30)
            };
    
          console.log(pos);
    
          marker.setPosition(pos);
          marker.setMap(map);
          map.setCenter(pos);
          map.setZoom(16);
    
          console.log("Proceso de carga de mapa terminado");
    
      })
    }
};