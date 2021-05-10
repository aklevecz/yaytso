import { ethers } from "ethers";
import { createContext, useContext, useEffect, useState } from "react";
import { CARTON_MAIN_ADDRESS } from "../constants";
import { ContractTypes } from "../ContractManager";
import { contractAdapter, WalletContext } from "./WalletContext";

type ContractObject = {
  address: string;
  interface: ethers.Contract | null;
};

type ContractsMap = {
  [contractType: number]: ContractObject;
};

type ContractContextAttrs = {
  contracts: ContractsMap | null;
  getCartonContract: () => ethers.Contract | null;
};
const initialState = {
  contracts: {
    [ContractTypes.CARTON]: {
      address: "0x0",
      interface: null,
    },
  },
  getCartonContract: () => null,
};

export const ContractContext =
  createContext<ContractContextAttrs>(initialState);

const ContractProvider = ({ children }: { children: any }) => {
  const wallet = useContext(WalletContext);
  const [contracts, setContracts] = useState<ContractsMap | null>(null);

  const getCartonContract = () =>
    contracts && contracts[ContractTypes.CARTON].interface;

  useEffect(() => {
    if (wallet.provider && wallet.user && wallet.user.chainId) {
      const cartonContract = contractAdapter.getContractI(
        ContractTypes.CARTON,
        wallet.user.chainId,
        wallet.provider
      );
      setContracts((contracts) => ({
        ...contracts,
        [ContractTypes.CARTON]: {
          address: cartonContract.address,
          interface: cartonContract,
        },
      }));
    } else {
      const provider = contractAdapter.getProvider(1);
      const cartonContract = contractAdapter.getContractI(
        ContractTypes.CARTON,
        1,
        provider
      );
      setContracts((contracts) => ({
        ...contracts,
        [ContractTypes.CARTON]: {
          address: CARTON_MAIN_ADDRESS,
          interface: cartonContract,
        },
      }));
    }
  }, [wallet.provider, wallet.user]);
  return (
    <ContractContext.Provider value={{ contracts, getCartonContract }}>
      {children}
    </ContractContext.Provider>
  );
};

export default ContractProvider;
