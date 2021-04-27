import { useContext, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import yaytso from "../assets/yaytso.gltf";
import { SmallButton } from "./modals";
import EggLoader from "../components/EggLoader";
import { shipStates } from "./Create";
import { CanvasContext } from "../contexts/CanvasContext";

// sceneRef, shipState, clean -> mainpage
// givenGLTD => collection
type EggProps = {
  sceneRef?: React.MutableRefObject<THREE.Scene | undefined>;
  shipState?: string;
  clean?: () => void | undefined;
};

interface EggRef extends THREE.Mesh {
  minting: boolean;
  sending: boolean;
}

export default function Egg({ sceneRef, shipState, clean }: EggProps) {
  const context = useContext(CanvasContext);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const eggRef = useRef<THREE.Mesh>();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const wrapper = wrapperRef!.current!;
    // const { width, height } = wrapper.getBoundingClientRect();
    const width = window.innerWidth;
    const height = window.innerHeight * 0.4;
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
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    // }
    wrapper.appendChild(renderer.domElement);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x080820, 0.6);
    scene.add(hemiLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const light = new THREE.DirectionalLight(0xffffff, 0.1);
    light.position.set(-10, 10, -190);
    light.target.position.set(0, 0, 0);

    // const vShader = `
    //   varying vec2 vUv;

    //   void main() {
    //     vUv = uv;
    //     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    //   }
    // `;

    // const fShader = `
    //   // Fragment shader

    //   varying vec2 vUv;
    //   uniform sampler2D t0; // 512x512 texture

    //   void main() {
    //     vec4 color0 = texture2D(t0, fract(vUv * 5.0));   // tiles the image in a 2x2 grid
    //     gl_FragColor = color0;
    //   }
    // `;

    // const lexture = new THREE.TextureLoader().load("r.png");
    // lexture.wrapS = THREE.RepeatWrapping;
    // lexture.wrapT = THREE.RepeatWrapping;
    // lexture.repeat.set(4, 4);
    // const uniforms = {
    //   u_resolution: { value: new THREE.Vector2(width, height) },
    //   u_mouse: { value: new THREE.Vector2() },
    //   t0: { value: lexture },
    // };

    // (uniforms.t0 as any).texture.wrapS = THREE.RepeatWrapping;
    // (uniforms.t0 as any).texture.wrapT = THREE.RepeatWrapping;

    // document.addEventListener("mousemove", (e) => {
    //   //  window.addEventListener( 'resize', onWindowResize, false );
    //   uniforms.u_mouse.value.x = e.clientX;
    //   uniforms.u_mouse.value.y = e.clientY;
    // });

    const loader = new GLTFLoader();
    setTimeout(() => {
      loader.load(yaytso, (gltf) => {
        scene.add(gltf.scene);
        let egg = gltf.scene.children[0] as THREE.Mesh;

        // (egg.material as any).map = lexture;
        // (egg.material as any).needsUpdate = true;
        // egg.material = new THREE.ShaderMaterial({
        //   vertexShader: vShader,
        //   fragmentShader: fShader,
        //   uniforms,
        // });
        eggRef.current = egg;
        eggRef.current.scale.set(0.1, 0.1, 0.1);

        // egg.geometry.attributes.scale.needsUpdate = true;
        setLoading(false);
      });
    }, 1000);

    let frame: number;

    const endScale = 1;

    const animate = (t: any) => {
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

      if (eggRef.current && (eggRef.current as EggRef).minting) {
        const w = 0.7 + 0.3 * 0.5 + Math.sin(t * 0.005) * 0.3 * 0.5;
        eggRef.current.scale.set(w, w, w);
      }

      renderer.render(scene, camera);
      frame = requestAnimationFrame(animate);
    };
    animate(0);

    const w = wrapperRef.current;
    return () => {
      cancelAnimationFrame(frame);
      if (w) {
        w.innerHTML = "";
      }
    };
  }, [sceneRef]);

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
      if (
        shipState === shipStates.PINNING ||
        shipState === shipStates.MINTING ||
        shipState === shipStates.SIGNING
      ) {
        (eggRef.current as EggRef).sending = true;
      }
    } else if (eggRef.current) {
      (eggRef.current as EggRef).minting = false;
      (eggRef.current as EggRef).sending = false;
    }
  }, [shipState]);

  return (
    <div ref={wrapperRef} className={`egg-wrapper`}>
      <div id="debug" style={{ position: "absolute", top: 0, left: 0 }}></div>
      {loading && (
        <div>
          <EggLoader centered={true} />
        </div>
      )}
      {context.pattern && clean && !(eggRef.current as EggRef).sending && (
        <SmallButton
          addedClass="clear2"
          title="clean"
          styles={{ bottom: shipState === "READY_TO_SHIP" ? -50 : 0 }}
          click={() => {
            clean();
            (eggRef.current as EggRef).sending = false;
            (eggRef.current as EggRef).minting = false;
          }}
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
