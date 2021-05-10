import { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { ContractContext } from "../../contexts/ContractContext";
import { WalletContext } from "../../contexts/WalletContext";
import { claimYaytso } from "../../libs/contract";
import { createPinataURL } from "../../libs/utils";
import EggSolo from "../EggSolo";
import ReceiptModal from "../../containers/modals/Receipt";
import { Receipt } from "../Create";

enum Status {
  DEFAULT = "would you like to claim this beautiful egg?",
  CLAIMING = "claiming yaytso...",
  CLAIMED = "you have claimed the yaytso!",
}
export default function Discover() {
  const params =
    useParams<{
      sig: string | undefined;
      bId: string | undefined;
      nonce: string | undefined;
    }>();
  const contracts = useContext(ContractContext);
  const wallet = useContext(WalletContext);
  const cartonContract = contracts.getCartonContract();

  const [fetching, setFetching] = useState(true);
  const [status, setStatus] = useState(Status.DEFAULT);
  const [yaytso, setYaytso] = useState<any>(null);
  const [receipt, setReceipt] = useState<Receipt | null>(null);

  const claim = async () => {
    console.log(wallet.user, wallet.user!.address);
    if (wallet.user && !wallet.user.address) {
      return alert(
        "you must connect a web3 wallet in order to claim this egg!"
      );
    }
    if (!cartonContract) {
      return;
    }
    const provider = wallet!.provider!;

    const event = cartonContract.filters.YaytsoClaimed();
    const filter = {
      address: event.address,
      topics: event.topics,
    };

    const tx = await claimYaytso(bId, nonce, sig, cartonContract, wallet.user);
    setStatus(Status.CLAIMING);
    provider.on(filter, (log, event) => {
      const parsedLog = cartonContract.interface.parseLog(log);
      if (parsedLog.name === "YaytsoClaimed") {
        console.log(parsedLog);
        setReceipt({
          recipient: wallet.user!.address,
          txHash: tx.hash,
          tokenId: yaytso.tokenId,
          metadata: yaytso.metadata.replace("ipfs://", ""),
          svgCID: yaytso.image.replace("ipfs://", ""),
          contractAddress: wallet.contract!.address,
        });
        setStatus(Status.CLAIMED);
      }
    });
    console.log(tx);

    // const receipt = await tx.wait();

    // for (const event of receipt.events) {
    //   console.log(event);
    // }
  };

  const fetchEggData = useCallback(async () => {
    if (!cartonContract) {
      console.log("no carton");
      return null;
    }
    const egg = parseInt(await cartonContract.boxIdToTokenId(params.bId));
    if (!egg) {
      setFetching(false);
      return console.log("no egg in this box?");
    }
    const uri = wallet.contract && (await wallet.contract.tokenURI(egg));
    fetch(createPinataURL(uri))
      .then((r) => r.json())
      .then((d) => {
        setFetching(false);
        setYaytso({ ...d, tokenId: egg, metadata: uri });
      })
      .catch((e) => {
        console.log(e);
        setFetching(false);
      });
  }, [cartonContract, wallet.contract, params.bId]);

  useEffect(() => {
    fetchEggData();
  }, [fetchEggData]);

  useEffect(() => {
    const c = document.querySelector(
      ".container-of-containerz"
    ) as HTMLDivElement;

    if (yaytso) {
      if (c) {
        c.classList.add("override-center");
      }
    }
    return () => {
      if (c) {
        c.classList.remove("override-center");
      }
    };
  }, [yaytso]);

  if (!params.sig || !params.bId || !params.nonce) {
    return <div>missing params</div>;
  }

  const { sig, bId, nonce } = params;

  if (fetching) {
    return <div>loading...</div>;
  }

  // if (!wallet.user) {
  //   return <div>no wallet found</div>;
  // }

  // if (!wallet.user.address) {
  //   return <div>you aren't signed in</div>;
  // }
  if (!yaytso) {
    return (
      <div style={{ fontSize: 50, fontWeight: "bold", width: "80%" }}>
        mmm don't see an egg in here
      </div>
    );
  }
  return (
    <div>
      {yaytso && (
        <div>
          <div className="discover__name">{yaytso.name}</div>
          <EggSolo
            gltfUrl={createPinataURL(yaytso.animation_url)}
            endScale={0.4}
          />
        </div>
      )}
      <div className="discover__prompt">{status}</div>
      {status !== Status.CLAIMED && (
        <button disabled={status !== Status.DEFAULT} onClick={claim}>
          claim
        </button>
      )}
      {receipt && <ReceiptModal receipt={receipt} />}
    </div>
  );
}
