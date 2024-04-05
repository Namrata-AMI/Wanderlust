
  //let mapToken = mapToken;  // access token from .env
 // console.log(mapToken);
	mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        center: listing.geometry.coordinates, // starting position [lng, lat]
        zoom: 9 // starting zoom
    });


   // console.log(coordinates);

     // Create a default Marker and add it to the map.
     const marker = new mapboxgl.Marker( { color:"red" } )
     .setLngLat(listing.geometry.coordinates)   // listing.geometry.coordinates
     .setPopup(new mapboxgl.Popup({offset: 25})
     .setHTML(
      `<h4> ${listing.title} </h4> <p> Exact location of after your Booking! </p>`
      )
      )
     .addTo(map);                // add those coordinates to our map






     map.on('load', () => {
      // Load an image from an external URL.
      map.loadImage(
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUYYoLXhZHRcOK30Icn5msvQ_QAl_bRwXmUdL-a2crN_ahNgbuNqK8z4PrH9bcctn00Y8&usqp=CAU',
        (error, image) => {
              if (error) throw error;

              // Add the image to the map style.
              map.addImage('home', image);
 // Add a data source containing one point feature.
 map.addSource('point', {
  'type': 'geojson',
  'data': {
      'type': 'FeatureCollection',
      'features': [
          {
              'type': 'Feature',
              'geometry': {
                  'type': 'Point',
                  'coordinates': listing.geometry.coordinates,
              }
          }
      ]
  }
});
  // Add a layer to use the image to represent the data.
  map.addLayer({
    'id': 'points',
    'type': 'symbol',
    'source': 'point', // reference the data source
    'layout': {
        'icon-image': 'home', // reference the image
        'icon-size': 0.20
    }
});
}
);
});