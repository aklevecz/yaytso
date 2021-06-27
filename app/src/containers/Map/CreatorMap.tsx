import { ethers } from "ethers";
import { useContext, useEffect, useState } from "react";
import { LAT_LA, LNG_LA } from "../../constants";
import { ContractContext } from "../../contexts/ContractContext";
import { WalletContext } from "../../contexts/WalletContext";
import { ContractTypes } from "../../ContractManager";
import { creators } from "./creators";
import useMap from "./useMap";

export default function CreatorMap() {
  const contracts = useContext(ContractContext);
  const wallet = useContext(WalletContext);
  console.log(contracts);
  const [markerPos, setMarkerPos] = useState<{ lat: number; lng: number }>({
    lat: 0,
    lng: 0,
  });
  const { mapContainer, map } = useMap();

  const createBox = async () => {
    const carton =
      contracts.contracts &&
      contracts.contracts[ContractTypes.CARTON].interface;
    if (!carton) {
      return console.log("Carton is missing");
    }
    if (!wallet.user || !wallet.user.signer) {
      return console.log("No signer present");
    }
    const latString = markerPos.lat.toString();
    const latBytes = ethers.utils.formatBytes32String(latString);
    const lngString = markerPos.lng.toString();
    const lngBytes = ethers.utils.formatBytes32String(lngString);
    const contractSigner = carton.connect(wallet.user.signer);
    const tx = await contractSigner.createBox(latBytes, lngBytes);
    const receipt = await tx.wait();
    for (const event of receipt.events) {
      console.log(event);
    }
  };

  useEffect(() => {
    if (map) {
      const egg = creators.createEggBoxObject(LAT_LA, LNG_LA);
      const marker = creators.layYaytsoMarker(egg, map, { draggable: true });

      const onMarkerDrag = () => {
        const lat = marker.getPosition()?.lat()!;
        const lng = marker.getPosition()?.lng()!;
        setMarkerPos({ lat, lng });
      };

      marker.addListener("drag", onMarkerDrag);
    }
  }, [map]);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div style={{ width: "100%", height: "100%" }} ref={mapContainer}></div>
      <button
        onClick={createBox}
        style={{ position: "absolute", top: "70%", left: "50%" }}
      >
        create
      </button>
    </div>
  );
}
