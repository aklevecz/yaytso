import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import EggLoader from "../components/EggLoader";

type EggProps = {
  gltfUrl: string;
  endScale?: number;
};

export default function EggKolletiv({ gltfUrl, endScale = 0.5 }: EggProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const eggRef = useRef<THREE.Mesh>();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const wrapper = wrapperRef!.current!;
    // const { width, height } = wrapper.getBoundingClientRect();
    const width = window.innerWidth * endScale;
    // Dumb
    const height =
      endScale <= 0.5 ? window.innerHeight * 0.4 : window.innerHeight * 0.8;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
    camera.position.z = 2.2;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0xebebeb);
    renderer.setPixelRatio(window.devicePixelRatio);

    wrapper.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x080820, 0.6);
    scene.add(hemiLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const light = new THREE.DirectionalLight(0xffffff, 0.1);
    light.position.set(-10, 10, -190);
    light.target.position.set(0, 0, 0);

    const loader = new GLTFLoader();
    setTimeout(() => {
      loader.load(gltfUrl, (gltf) => {
        scene.add(gltf.scene);
        const egg = gltf.scene.children[2] as THREE.Mesh;
        eggRef.current = egg;
        eggRef.current.scale.set(0.1, 0.1, 0.1);
        setLoading(false);
      });
    }, 1000);

    let frame: number;

    // const endScale = 0.5;

    const animate = () => {
      if (eggRef.current && eggRef.current.scale.x < endScale) {
        const scalar = eggRef.current.scale.x + 0.05;
        eggRef.current.scale.set(scalar, scalar, scalar);
      }

      renderer.render(scene, camera);
      frame = requestAnimationFrame(animate);
    };
    animate();

    const w = wrapperRef.current;
    return () => {
      cancelAnimationFrame(frame);
      if (w) {
        w.innerHTML = "";
      }
    };
  }, [endScale, gltfUrl]);

  return (
    <div ref={wrapperRef} className={`egg-wrapper collection`}>
      <div id="debug" style={{ position: "absolute", top: 0, left: 0 }}></div>
      {loading && (
        <div>
          <EggLoader centered={true} />
        </div>
      )}
    </div>
  );
}
