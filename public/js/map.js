mapboxgl.accessToken = Map_Token;

// safety check
if (!listing.geometry || !listing.geometry.coordinates) {
  console.error("Coordinates missing");
}

// create map
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v12",
  center: listing.geometry.coordinates, // [lng, lat]
  zoom: 9,
});

// add marker
const marker = new mapboxgl.Marker({
  color: "#FF385C", // Airbnb style color
  scale: 1.5,
})
  .setLngLat(listing.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 })
      .setHTML(`
        <h4>${listing.location}</h4>
        <p>Exact location provided after booking</p>
      `)
  )
  .addTo(map);

  