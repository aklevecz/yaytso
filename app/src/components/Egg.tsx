import { useContext, useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import yaytso from "../assets/yaytso.gltf";
import { Context } from "..";
import { SmallButton } from "../containers/modals";

export default function Egg({ sceneRef, shipState, givenGLTF }: any) {
  const context = useContext(Context);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const eggRef = useRef<THREE.Mesh>();
  useEffect(() => {
    const wrapper = wrapperRef!.current!;
    // const { width, height } = wrapper.getBoundingClientRect();
    const width = window.innerWidth;
    const height = window.innerHeight * 0.4;
    // const width = 300,
    // height = 300;
    console.log(width, height);
    const scene = new THREE.Scene();
    if (sceneRef) {
      sceneRef.current = scene;
    }
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
    camera.position.z = 2.2;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0xffffff);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputEncoding = THREE.sRGBEncoding;

    if (sceneRef) {
      const controls = new OrbitControls(camera, renderer.domElement);
    }
    // controls.enableZoom = false;
    wrapper.appendChild(renderer.domElement);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x080820, 1);
    scene.add(hemiLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);

    const light = new THREE.DirectionalLight(0xffffff, 0.7);
    light.position.set(10, 10, 10);
    light.target.position.set(0, 0, 0);

    const loader = new GLTFLoader();
    loader.load(givenGLTF ? givenGLTF : yaytso, (gltf) => {
      scene.add(gltf.scene);
      const egg = gltf.scene.children[0] as THREE.Mesh;
      eggRef.current = egg;
      egg.castShadow = true;
      console.log(eggRef.current.material);
    });

    let frame: number;

    const animate = () => {
      // if (document.getElementById("debug")) {
      //   document.getElementById(
      //     "debug"
      //   )!.innerText = camera.position.z.toString();
      // }
      if (eggRef.current && (eggRef.current as any).minting) {
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
      (eggRef.current.material as any).map = context.pattern;
      (eggRef.current.material as any).color = new THREE.Color(1, 1, 1);
      (eggRef.current.material as THREE.Material).needsUpdate = true;
    }
  }, [context.pattern]);

  useEffect(() => {
    if (shipState) {
      (eggRef.current as any).minting = true;
    }
  }, [shipState]);

  return (
    <div ref={wrapperRef} className="egg-wrapper">
      <div id="debug" style={{ position: "absolute", top: 0, left: 0 }}></div>
      {context.pattern && (
        <SmallButton
          addedClass="clear2"
          title="clean egg"
          click={() => context.clearPattern()}
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
