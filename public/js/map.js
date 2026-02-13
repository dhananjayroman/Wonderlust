
      
      //console.log(map_token)
      mapboxgl.accessToken = Map_Token
    
     const map = new mapboxgl.Map({
        container: 'map', // container ID
        center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 9 // starting zoom
    });
    

//console.log("cordingates",Coordinates)
    const marker = new mapboxgl.Marker({
    color: '#FF0000', // set marker color
    scale: 1.5        // scale the marker size
  })
  .setLngLat(listing.geometry.coordinates)
  .setPopup(new mapboxgl.Popup({ closeOnClick: false })
        .setLngLat([-96, 37.8])
        .setHTML(`<h4>${listing.location}</h4><p>Exact location provided after booking</p>`)
        .addTo(map))
  .addTo(map);
  