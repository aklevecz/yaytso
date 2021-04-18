import { useContext, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import yaytso from "../assets/yaytso.gltf";
import { Context } from "..";
import { SmallButton } from "../containers/modals";
import EggLoader from "./EggLoader";

type EggProps = {
  sceneRef?: React.MutableRefObject<THREE.Scene | undefined>;
  shipState?: string;
  givenGLTF?: string;
  clean?: () => void | undefined;
};

interface EggRef extends THREE.Mesh {
  minting: boolean;
}

export default function Egg({
  sceneRef,
  shipState,
  givenGLTF,
  clean,
}: EggProps) {
  const context = useContext(Context);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const eggRef = useRef<THREE.Mesh>();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const wrapper = wrapperRef!.current!;
    // const { width, height } = wrapper.getBoundingClientRect();
    const width = givenGLTF ? window.innerWidth * 0.5 : window.innerWidth;
    const height = givenGLTF
      ? window.innerWidth * 0.5
      : window.innerHeight * 0.4;
    // const width = 300,
    // height = 300;
    const scene = new THREE.Scene();
    if (sceneRef) {
      sceneRef.current = scene;
    }
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
    camera.position.z = 2.2;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0xebebeb);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.domElement.id = "the-egg";
    // renderer.outputEncoding = THREE.sRGBEncoding;
    // console.log(sceneRef);
    // if (sceneRef) {
    //   console.log("yamtrols");
    const controls = new OrbitControls(camera, renderer.domElement);
    // }
    controls.enableZoom = false;
    wrapper.appendChild(renderer.domElement);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x080820, 0.6);
    scene.add(hemiLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const light = new THREE.DirectionalLight(0xffffff, 0.1);
    light.position.set(-10, 10, -190);
    light.target.position.set(0, 0, 0);

    const loader = new GLTFLoader();
    setTimeout(() => {
      loader.load(givenGLTF ? givenGLTF : yaytso, (gltf) => {
        scene.add(gltf.scene);
        let egg = gltf.scene.children[0] as THREE.Mesh;

        // If they do not have a name then it is coming from collections
        // Maybe just make these eggs explicitly different modules with some shared functions extended
        if (egg.name !== "EGG") {
          egg = gltf.scene.children[2] as THREE.Mesh;
        }
        // console.log(egg.scale);
        eggRef.current = egg;
        eggRef.current.scale.set(0.1, 0.1, 0.1);
        // egg.geometry.attributes.scale.needsUpdate = true;
        setLoading(false);
      });
    }, 1000);

    let frame: number;

    const endScale = givenGLTF ? 0.5 : 1;

    const animate = () => {
      // if (document.getElementById("debug")) {
      //   document.getElementById(
      //     "debug"
      //   )!.innerText = camera.position.z.toString();
      // }
      if (eggRef.current && eggRef.current.scale.x < endScale) {
        const scalar = eggRef.current.scale.x + 0.05;
        // console.log(eggRef.current.scale);
        eggRef.current.scale.set(scalar, scalar, scalar);
      }
      if (eggRef.current && (eggRef.current as EggRef).minting) {
        eggRef.current!.rotation.z += 0.01;
      }

      renderer.render(scene, camera);
      frame = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(frame);
      if (wrapperRef.current) {
        wrapperRef.current.innerHTML = "";
      }
    };
  }, []);

  useEffect(() => {
    if (eggRef.current) {
      (eggRef.current.material as THREE.MeshBasicMaterial).map =
        context.pattern;
      (eggRef.current
        .material as THREE.MeshBasicMaterial).color = new THREE.Color(1, 1, 1);
      (eggRef.current.material as THREE.MeshBasicMaterial).needsUpdate = true;
    }
  }, [context.pattern]);

  useEffect(() => {
    if (shipState) {
      (eggRef.current as EggRef).minting = true;
    }
  }, [shipState]);

  return (
    <div
      ref={wrapperRef}
      className={`egg-wrapper ${givenGLTF && "collection"}`}
    >
      <div id="debug" style={{ position: "absolute", top: 0, left: 0 }}></div>
      {loading && (
        <div>
          <EggLoader centered={!givenGLTF} />
        </div>
      )}
      {context.pattern && !givenGLTF && clean && (
        <SmallButton
          addedClass="clear2"
          title="clean"
          styles={{ bottom: shipState === "READY_TO_SHIP" ? -50 : 0 }}
          click={clean}
        />
      )}
      {/* <input
        type="range"
        min="1"
        max="10"
        defaultValue="50"
        onChange={(e) => {
          const v = parseInt(e.target.value);
          context.pattern?.repeat.set(v, v);
        }}
        className="slider"
        id="myRange"
      /> */}
    </div>
  );
}
