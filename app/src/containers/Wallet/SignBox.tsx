import { ethers } from "ethers";
import { useContext, useEffect, useState } from "react";
import { ContractContext } from "../../contexts/ContractContext";
import { WalletContext } from "../../contexts/WalletContext";
import { ContractTypes } from "../../ContractManager";

type State = {
  nonce: number | null;
  boxId: number | null;
  tokenId: number | null;
};

const pkey = "d386e3dac68bcd13d229a89eef9fc4ee2610ab7c708d0c9ba91998752fa9462c";

export default function SignBox() {
  const contractsContext = useContext(ContractContext);
  const walletContext = useContext(WalletContext);
  const [state, setState] = useState<State>({
    nonce: null,
    boxId: null,
    tokenId: null,
  });
  const [wallet, setWallet] = useState<ethers.Wallet | null>(null);
  const [signature, setSignature] = useState("");

  const cartonI =
    contractsContext.contracts &&
    contractsContext.contracts[ContractTypes.CARTON]?.interface;

  const handleChange = (e: any) =>
    setState({ ...state, [e.target.name]: e.target.value });

  const signMessage = async () => {
    const hashedMessage = ethers.utils.solidityKeccak256(
      ["uint256", "uint256"],
      [state.boxId, state.nonce]
    );
    const bytesMessage = ethers.utils.arrayify(hashedMessage);
    // const signedMessage = await wallet!.signMessage(bytesMessage);
    const signedMessage = await walletContext.user!.signer?.signMessage(
      bytesMessage
    );
    const verified = await cartonI!.verify(
      walletContext.user!.address,
      state.boxId,
      state.nonce,
      signedMessage
    );
    console.log(verified);
    // const verified = true;
    if (verified) {
      setSignature(signedMessage!);
    } else {
      setSignature("an error occured");
    }
  };

  const createBox = async () => {
    const connectedWallet = wallet?.connect(walletContext.provider!);
    const signer = walletContext.user!.signer;
    const cartonSigner = contractsContext.getCartonContract()!.connect(signer!);
    const tx = await cartonSigner.createBox(
      ethers.utils.formatBytes32String("lat"),
      ethers.utils.formatBytes32String("lng")
    );
    console.log(tx);
  };

  const fillBox = async () => {
    const connectedWallet = wallet?.connect(walletContext.provider!);
    const signer = walletContext.user!.signer;
    const cartonSigner = contractsContext.getCartonContract()!.connect(signer!);
    const tx = await cartonSigner.fillBox(
      state.boxId,
      walletContext.user!.address,
      state.tokenId
    );
  };

  const approve = () => {
    const connectedWallet = wallet?.connect(walletContext.provider!);
    const signer = walletContext.user!.signer;

    const yaytsoSigner = walletContext.contract?.connect(signer!);

    const tx = yaytsoSigner!.approve(cartonI!.address, state.tokenId);
  };

  useEffect(() => {
    // const wallet = ethers.Wallet.createRandom();
    const wallet = new ethers.Wallet(pkey);
    setWallet(wallet);
  }, []);

  return (
    <div>
      {wallet && wallet.address}
      <div>
        <div>nonce</div>
        <input name="nonce" onChange={handleChange} />
      </div>
      <div>
        <div>box id</div>
        <input name="boxId" onChange={handleChange} />
      </div>
      <button onClick={signMessage}>sign</button>
      <div>
        <div>token id </div>
        <input name="tokenId" onChange={handleChange} />
      </div>
      <button onClick={approve}>approve</button>
      <button onClick={fillBox}>fill box</button>
      <button onClick={createBox}>create box</button>
      <div style={{ margin: 20, width: "90%", wordBreak: "break-all" }}>
        {signature}
      </div>
    </div>
  );
}
