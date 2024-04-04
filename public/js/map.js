
  //let mapToken = mapToken;  // access token from .env
 // console.log(mapToken);
	mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        center: coordinates, // starting position [lng, lat]
        zoom: 9 // starting zoom
    });


   // console.log(coordinates);

     // Create a default Marker and add it to the map.
     const marker = new mapboxgl.Marker( { color:"red" } )
     .setLngLat(coordinates)   // listing.geometry.coordinates
     .setPopup(new mapboxgl.Popup({offset: 25}))
     .setHTML("<h1>Hello World!</h1>")
     .setMaxWidth("300px")
     .addTo(map);                // add those coordinates to our map


