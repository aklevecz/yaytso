import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { ContractContext } from "../../contexts/ContractContext";
import { ContractTypes } from "../../ContractManager";
import { EggBox } from ".";
import Map from "./Map";
import { ethers } from "ethers";

export default function FindMap() {
  const contracts = useContext(ContractContext);
  const params = useParams<{ egg: string | undefined }>();
  const [egg, setEgg] = useState<EggBox>({
    lat: null,
    lng: null,
    locked: null,
    id: null,
  });
  useEffect(() => {
    if (!contracts.contracts) {
      return;
    }
    if (!contracts.contracts[ContractTypes.CARTON]) {
      return;
    }
    const cartonI = contracts.contracts[ContractTypes.CARTON].interface;
    if (cartonI && params.egg) {
      const id = parseInt(params.egg);
      cartonI.Boxes(id).then((box: any) => {
        const { lat, lon, locked } = box;
        const latFloat = parseFloat(ethers.utils.parseBytes32String(lat));
        const lngFloat = parseFloat(ethers.utils.parseBytes32String(lon));
        setEgg({ lat: latFloat, lng: lngFloat, locked, id });
      });
    }
  }, [contracts, params.egg]);
  return <Map egg={egg} />;
}
