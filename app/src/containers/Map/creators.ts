import { EggBox } from ".";

export const creators = (function () {
  return {
    createEggBoxObject: (lat: number, lng: number) => ({
      lat,
      lng,
      locked: null,
      id: null,
    }),
    layYaytsoMarker: (
      egg: EggBox,
      map: google.maps.Map,
      options: { draggable?: boolean }
    ) =>
      new google.maps.Marker({
        position: {
          lat: egg.lat ? egg.lat : 1,
          lng: egg.lng ? egg.lng : 1,
        },
        map: map,
        icon: {
          url: `${process.env.PUBLIC_URL}/eggvg.svg`,
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(40, 0),
          scaledSize: new google.maps.Size(80, 80),
        },
        ...options,
      }),
  };
})();
