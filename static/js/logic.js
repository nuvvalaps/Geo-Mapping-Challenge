
// Function to create a base map and add layers
function createMap(earthquakes) {

    // Create the tile layer that will be the background of our map.
    var global_map = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
  
  
    // Create a baseMaps object to hold the world map layer.
    var baseMaps = {
      "World Map": global_map
    };
  
    // Create an overlayMaps object to hold the earthquake layer.
    var overlayMaps = {
      "Earthquakes": earthquakes
    };
  
    // Create the map object with options.
    var map = L.map("map-id", {
      center: [0,0],
      zoom: 3,
      layers: [global_map, earthquakes]
    });
  
    // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {collapsed: false}).addTo(map);  
    legend.addTo(map);
  }
  



// Function to create circle markers for each earthquake.
    function createMarkers(data) {
      
        function circle(feature, latlng){ 
          return L.circleMarker(latlng,{radius: 0.05 * feature.properties.sig,
            color: color(feature.geometry.coordinates[2])});
        }
      
        // Create popup for each earthquake with date, location, and magnitude data
        function popup(feature, layer) {
            layer.bindPopup("Date: " + new Date(feature.properties.time) +
            "<br>Magnitude: " + feature.properties.mag + 
            "<br>Location: " + feature.properties.place
            );
            }

        let earthquakes = L.geoJSON(data, {
          onEachFeature: popup,
          pointToLayer: circle
        });
 
      // Change color depending on depth of quake. 
      function color(depth){
        switch(true){
          case(depth <= 1):
            return "#ffb3b3";
          case (depth <= 5):
            return "#ff8080";
          case (depth <= 10):
            return "#ff6767";
          case (depth <= 25):
            return "#ff4d4d";
          case (depth > 50):
            return "#ff3434";
        }
      }

        createMap(earthquakes);
      }

function color(depth){
    switch(true){
        case(depth <= 1):
        return "#ffb3b3";
        case (depth <= 5):
        return "#ff8080";
        case (depth <= 10):
        return "#ff6767";
        case (depth <= 25):
        return "#ff4d4d";
        case (depth > 50):
        return "#ff3434";
        }};

// Creating Legend
var legend = L.control({
    position: "bottomright"
  });
  
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var bins = [0,1,5,10,25,50];
    div.innerHTML += "<h4 style='text-align: center'>Earthquake Depth</h4>"
    for (var i = 0; i < bins.length; i++) {
      div.innerHTML += 
      "<i style='background: " + color(bins[i]+ 1) + "'></i> " + bins[i] + (bins[i + 1] ? "&ndash;" + bins[i + 1] + "<br>" : "+");
    }
  return div;}



  // Perform an API call to the USGS API to get the earthquake information. Then call the function to create markers.
  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_month.geojson").then(function (USGSdata){
    createMarkers(USGSdata.features);
});