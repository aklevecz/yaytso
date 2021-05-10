import { Loader } from "@googlemaps/js-api-loader";
import { useEffect, useRef, useState } from "react";
const loader = new Loader({
  apiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY!,
  version: "weekly",
});

// Maybe don't need this in favor of the setCenter
const DEFAULT_LAT = 34.04362997897908;
const DEFAULT_LNG = -118.2376335045432;
export default function useMap(
  center = { lat: DEFAULT_LAT, lng: DEFAULT_LNG }
) {
  const [map, setMap] = useState<google.maps.Map>();
  const mapContainer = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let map: google.maps.Map;
    loader.load().then(() => {
      if (!mapContainer.current) {
        return console.error("container is missing");
      }
      // const lat =
      // const lng =

      map = new google.maps.Map(mapContainer.current, {
        styles: require("../../assets/silverMap.json"),
        zoom: 15,
        center: {
          lat: center.lat,
          lng: center.lng,
        },
      });
      setMap(map);
    });
  }, []);

  const setCenter = (lat: number, lng: number) => {
    map && map.setCenter({ lat, lng });
  };

  return { map, mapContainer, setCenter };
}
