import { useContext, useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import { Context } from "..";
import { PINATA_GATEWAY } from "../containers/Collection";
import Skybox from "./skybox.jpg";

export default function WorldScene({ eggLTs }: { eggLTs: Array<string> }) {
    const context = useContext(Context);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const eggsRef= useRef<THREE.Group[]>([]);
    const sceneRef = useRef<THREE.Scene>();
    useEffect(() => {
        // if (eggLTs.length === 0) {
        //     return;
        // }
        var sheet = document.createElement("style");
        sheet.id = "world";
        sheet.innerHTML = "* {overflow:hidden;}";
        document.body.appendChild(sheet);
        console.log("world scene");
        const wrapper = wrapperRef!.current!;
        // const { width, height } = wrapper.getBoundingClientRect();
        const width = window.innerWidth,
            height = window.innerHeight;
        const scene = new THREE.Scene();
        sceneRef.current = scene;
        const camera = new THREE.PerspectiveCamera(
            75,
            width / height,
            0.1,
            100
        );
        camera.position.z = 2.2;
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.setClearColor(0xff0000);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.shadowMap.enabled = true;

        // const controls = new OrbitControls(camera, renderer.domElement);
        const controls = new PointerLockControls(camera, renderer.domElement);
        if (wrapperRef.current) wrapperRef.current.onclick = () => controls.lock();
        scene.add(controls.getObject());
        let moveForward = false;
        let moveBackward = false;
        let moveLeft = false;
        let moveRight = false;
        let canJump = false;

        let prevTime = performance.now();
        const velocity = new THREE.Vector3();
        const direction = new THREE.Vector3();
        const onKeyDown = function (event: KeyboardEvent) {
            switch (event.code) {
                case "ArrowUp":
                case "KeyW":
                    moveForward = true;
                    break;

                case "ArrowLeft":
                case "KeyA":
                    moveLeft = true;
                    break;

                case "ArrowDown":
                case "KeyS":
                    moveBackward = true;
                    break;

                case "ArrowRight":
                case "KeyD":
                    moveRight = true;
                    break;

                case "Space":
                    if (canJump === true) velocity.y += 350;
                    canJump = false;
                    break;
            }
        };

        const onKeyUp = function (event: KeyboardEvent) {
            switch (event.code) {
                case "ArrowUp":
                case "KeyW":
                    moveForward = false;
                    break;

                case "ArrowLeft":
                case "KeyA":
                    moveLeft = false;
                    break;

                case "ArrowDown":
                case "KeyS":
                    moveBackward = false;
                    break;

                case "ArrowRight":
                case "KeyD":
                    moveRight = false;
                    break;
            }
        };

        document.addEventListener("keydown", onKeyDown);
        document.addEventListener("keyup", onKeyUp);

        // controls.enableZoom = false;
        wrapper.appendChild(renderer.domElement);

        const hemiLight = new THREE.HemisphereLight(0xffffbb, 0x080820, .4);
        scene.add(hemiLight);

        // const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
        // scene.add(ambientLight);

        const light = new THREE.DirectionalLight(0xffffff, 0.3);
        light.position.set(3, 20, 2);
        light.target.position.set(0, 0, 0);
        light.castShadow = true;
        light.shadow.bias = -0.001;
        light.shadow.mapSize.width = 2048 * 2;
        light.shadow.mapSize.height = 2048 * 2;
        light.shadow.camera.near = 0.1;
        light.shadow.camera.far = 500.0;
        light.shadow.camera.near = 0.5;
        light.shadow.camera.far = 500.0;
        light.shadow.camera.left = 100;
        light.shadow.camera.right = -100;
        light.shadow.camera.top = 100;
        light.shadow.camera.bottom = -100;
        scene.add(light);

        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(500, 500),
            new THREE.MeshStandardMaterial({ color: "blue" })
        );

        floor.receiveShadow = true;
        floor.castShadow = true;
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -2;
        scene.add(floor);

        const sloader = new THREE.TextureLoader();
        const texture = sloader.load(Skybox, () => {
            const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
            rt.fromEquirectangularTexture(renderer, texture);
            scene.background = rt;
        });

        let frame: number;

        const animate = () => {
            // if (document.getElementById("debug")) {
            //   document.getElementById(
            //     "debug"
            //   )!.innerText = camera.position.z.toString();
            // }
            const time = performance.now();

            if (controls.isLocked === true) {
                const delta = (time - prevTime) / 1000;

                velocity.x -= velocity.x * 10.0 * delta;
                velocity.z -= velocity.z * 10.0 * delta;

                velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

                direction.z = Number(moveForward) - Number(moveBackward);
                direction.x = Number(moveRight) - Number(moveLeft);
                direction.normalize(); // this ensures consistent movements in all directions

                if (moveForward || moveBackward)
                    velocity.z -= direction.z * 400.0 * delta;
                if (moveLeft || moveRight)
                    velocity.x -= direction.x * 400.0 * delta;
                controls.moveRight(-velocity.x * delta);
                controls.moveForward(-velocity.z * delta);

                controls.getObject().position.y += velocity.y * delta; // new behavior

                if (controls.getObject().position.y < 10) {
                    velocity.y = 0;
                    controls.getObject().position.y = 10;

                    canJump = true;
                }
            }
            prevTime = time;
            // console.log(camera.position)
            renderer.render(scene, camera);
            frame = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            var sheetToBeRemoved = document.getElementById("world")!;
            var sheetParent = sheetToBeRemoved.parentNode!;
            sheetParent.removeChild(sheetToBeRemoved);
            cancelAnimationFrame(frame);
            if (wrapperRef.current) {
                wrapperRef.current.innerHTML = "";
            }
        };
    }, []);

    useEffect(() => {
        if (sceneRef.current) {
            if (!eggsRef.current) {
                eggsRef.current = []
            }
            const loader = new GLTFLoader();
            eggLTs.forEach((uri, i) => {
                console.log(uri);
                loader.load(
                    uri.replace("ipfs://", PINATA_GATEWAY + "/"),
                    (gltf) => {
                        sceneRef!.current!.add(gltf.scene);
                        console.log(eggsRef)
                        eggsRef!.current!.push(gltf.scene)
                        // const egg = gltf.scene.children[0] as THREE.Mesh;
                        gltf.scene.position.x = i * 10;
                        gltf.scene.position.y = 10;
                        gltf.scene.traverse(function (node) {
                            if ((node as any).isMesh) {
                                node.castShadow = true;
                            }
                        });
                    }
                );
            });
        }
    }, [eggLTs]);

    return (
        <div ref={wrapperRef} id="world-scene">
            <div
                id="debug"
                style={{ position: "absolute", top: 0, left: 0 }}
            ></div>
        </div>
    );
}
