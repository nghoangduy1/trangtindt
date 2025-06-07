const map = L.map("map").setView([16.047079, 108.20623], 6);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

async function drawMap() {
  const geoRes = await fetch("/map/vn.json");
  const geoData = await geoRes.json();

  L.geoJSON(geoData, {
    style: {
      fillColor: '#007bff',
      weight: 1,
      color: "green",
      fillOpacity: 0.7
    },
    onEachFeature: (feature, layer) => {
      const name = feature.properties.name;
      layer.bindPopup(`<b>${name}</b>`);
    }
  }).addTo(map);
}

drawMap();
