import { Loader } from "@googlemaps/js-api-loader";
import { useEffect, useRef } from "react";

const loader = new Loader({
  apiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY!,
  version: "weekly",
});

export default function Map() {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let map: google.maps.Map, infoWindow: google.maps.InfoWindow;

    loader.load().then(() => {
      if (!mapContainer.current) {
        return console.error("container is missing");
      }
      const lat = 34.04362997897908;
      const lng = -118.2376335045432;
      map = new google.maps.Map(mapContainer.current, {
        styles: require("../assets/silverMap.json"),
        zoom: 15,
        center: { lat, lng },
      });

      infoWindow = new google.maps.InfoWindow();

      const marker = new google.maps.Marker({
        position: { lat, lng },
        map: map,
        icon: {
          url: "eggvg.svg",
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(40, 0),
          scaledSize: new google.maps.Size(80, 80),
        },
      });
      marker.addListener("click", () => {
        infoWindow.setPosition({ lat, lng });
        infoWindow.setContent("soon there will be an egg here... but not yet!");
        infoWindow.open(map);
      });
    });
  }, []);
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div style={{ width: "100%", height: "100%" }} ref={mapContainer}></div>
    </div>
  );
}
