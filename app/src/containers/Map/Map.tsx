import { useEffect } from "react";
import { EggBox } from ".";
import { creators } from "./creators";
import useMap from "./useMap";

export default function Map({ egg }: { egg: EggBox }) {
  const { mapContainer, map, setCenter } = useMap();

  useEffect(() => {
    if (!egg.id) {
      return console.log("NO EGG");
    }
    if (!mapContainer.current) {
      return console.error("container is missing");
    }
    if (!map) {
      return console.error("map is missing");
    }

    if (egg.lat && egg.lng) {
      setCenter(egg.lat, egg.lng);
    }

    const onMarkerClick = () => {
      const lat = marker.getPosition()?.lat();
      const lng = marker.getPosition()?.lng();
      if (!lat || !lng) {
        return console.log("missing pos");
      }
      infoWindow.setPosition({ lat, lng });
      infoWindow.setContent("soon there will be an egg here... but not yet!");
      infoWindow.open(map);
    };

    const infoWindow = new google.maps.InfoWindow();
    const marker = creators.layYaytsoMarker(egg, map, {});
    marker.addListener("click", onMarkerClick);
  }, [egg, map, mapContainer, setCenter]);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div style={{ width: "100%", height: "100%" }} ref={mapContainer}></div>
    </div>
  );
}
