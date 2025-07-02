import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
export default class SceneBuilder {
    constructor() {
        this.scene = null;
        this.sceneDefined = false;
        this.frameCount = 0;
        this.textureLoader = new THREE.TextureLoader();
    }

    setScene(scene) {
        this.scene = scene;
    }

    // lights, background color, etc
    defineScene() {}

    // transformations
    updateScene() {}
}
// TRACK 1: GREENLIGHT
const scene1 = new SceneBuilder();
scene1.defineScene = function (sceneModelArr, shaderPass, playerPath) {
    this.scene.background = new THREE.Color(0x000000);

    this.ambientLight = new THREE.AmbientLight(0xffffff);
    this.scene.add(this.ambientLight);

    console.log(sceneModelArr, shaderPass, playerPath);
    playerPath.material.color = new THREE.Color(0x00ff00);
};

scene1.updateScene = function () {};

const sceneBuilder1 = new SceneBuilder();
sceneBuilder1.defineScene = function (sceneModelArr) {
    this.scene.background = new THREE.Color(0xaa0000);
    this.ambientLight = new THREE.AmbientLight(0xffffff);
    this.scene.add(this.ambientLight);

    this.pointLight = new THREE.PointLight();
    this.scene.add(this.pointLight);

    const buildingModel = sceneModelArr[1].children[0];
    const roadModel = sceneModelArr[0].children[0];
    console.log(buildingModel);

    const video = document.createElement("video");
    video.src = "./assets/video/demo3.mov";
    video.loop = true;
    video.muted = true;
    video.play();

    const videoTexture = new THREE.VideoTexture(video);
    videoTexture.colorSpace = THREE.SRGBColorSpace;
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    videoTexture.generateMipmaps = false;

    buildingModel.material = new THREE.MeshBasicMaterial({ map: videoTexture, side: THREE.DoubleSide });

    // hdri texture test

    const envMap = this.textureLoader.load([
        "./assets/cubeMaps/cubeMap1/nx.png",
        "./assets/cubeMaps/cubeMap1/ny.png",
        "./assets/cubeMaps/cubeMap1/nz.png",
        "./assets/cubeMaps/cubeMap1/px.png",
        "./assets/cubeMaps/cubeMap1/py.png",
        "./assets/cubeMaps/cubeMap1/pz.png",
    ]);
    envMap.mapping = THREE.CubeRefractionMapping;
    this.scene.environment = envMap;

    const roadTexture = this.textureLoader.load("./assets/chapter_1/stage_1/roadNormal.png");
    roadModel.material = new THREE.MeshStandardMaterial({
        envMap: envMap,
        normalMap: roadTexture,
        map: roadTexture,
        //normalScale: 2.0,
        side: THREE.DoubleSide,
        roughness: 0.0,
        metalness: 0.65,
    });

    const loader = new GLTFLoader();
    let scene = this.scene;
    let textureLoader = this.textureLoader;
    let carMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        map: this.textureLoader.load("./assets/chapter_1/stage_1/textures/carMaterial_diffuse.png"),
    });

    this.carMeshArr = [];
    this.carMeshGroup = new THREE.Group();
    let carMeshArr = this.carMeshArr;
    let carMeshGroup = this.carMeshGroup;
    loader.load("./assets/chapter_1/stage_1/scene.gltf", function (gltf) {
        gltf.scene.material = carMat;
        gltf.scene.scale.set(2, 2, 2);

        gltf.scene.traverse((child) => {
            if (child.isMesh) {
                console.log(child);
                child.material = carMat;
            } else {
                child.material = carMat;
            }
            child.material.needsUpdate = true;
        });
        scene.add(gltf.scene);

        for (let i = 0; i < 100; i++) {
            const clone = gltf.scene.clone();
            clone.position.set(Math.random() * 100 - 50, Math.random() * 100 - 50, Math.random() * 100 - 50);
            clone.rotation.set(Math.random() * 360, Math.random() * 360, Math.random() * 360);
            clone.scale.set(0.5, 0.5, 0.5);
            carMeshArr.push(clone);
            carMeshGroup.add(clone);
        }

        scene.add(carMeshGroup);
    });

    const bgSphereGeo = new THREE.SphereGeometry(100, 10, 10, 10);
    const bgSphereMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, wireframe: true });
    const bgSphereMesh = new THREE.Mesh(bgSphereGeo, bgSphereMat);

    this.scene.add(bgSphereMesh);
};
sceneBuilder1.updateScene = function (camera) {
    this.pointLight.position.copy(camera.position);
    this.carMeshGroup.rotateX(0.01);
    this.frameCount++;
};

const sceneBuilder4 = new SceneBuilder();
sceneBuilder4.defineScene = function (sceneModelArr) {
    this.scene.background = new THREE.Color(0x0000000);
    this.ambientLight = new THREE.AmbientLight(0xffffff);
    this.scene.add(this.ambientLight);

    this.pointLight = new THREE.PointLight();
    this.scene.add(this.pointLight);
};
sceneBuilder4.updateScene = function () {};

const sceneBuilder3 = new SceneBuilder();
sceneBuilder3.defineScene = function () {
    this.scene.background = new THREE.Color(0x000000);
    this.ambientLight = new THREE.AmbientLight(0xffffff);
    this.pointLight = new THREE.PointLight(0xffffff);
    this.pointLight.position.set(0, 4, 0);

    this.pointLight2 = new THREE.PointLight(0xffffff);
    this.pointLight2.position.set(3, 4, 3);

    this.pointLight3 = new THREE.PointLight(0xffffff);
    this.pointLight3.position.set(3, 4, -3);

    this.pointLight4 = new THREE.PointLight(0xffffff);
    this.pointLight4.position.set(-3, 4, 3);

    this.pointLight.power = 20;
    this.pointLight2.power = 20;
    this.pointLight3.power = 20;
    this.pointLight4.power = 20;
    this.scene.add(this.ambientLight);
    this.scene.add(this.pointLight);
    this.scene.add(this.pointLight2);
    this.scene.add(this.pointLight3);
    this.scene.add(this.pointLight4);

    this.pointLight = new THREE.PointLight();
    this.scene.add(this.pointLight);
};

sceneBuilder3.updateScene = function () {
    this.pointLight.position.y = 5 + Math.sin(this.frameCount * 0.05);
    this.pointLight.position.x = Math.sin(this.frameCount * 0.05);
    this.pointLight.position.z = Math.cos(this.frameCount * 0.05);
    this.frameCount += 1;
};

const sceneBuilder2 = new SceneBuilder();
sceneBuilder2.defineScene = function (sceneModelArr) {
    this.scene.background = new THREE.Color(0x0000ff);

    this.pointLight = new THREE.PointLight(0xffffff);
    this.pointLight.position.set(0, 2, 5);
    this.pointLight.power = 100;

    this.scene.add(this.pointLight);

    // video texture test
    const video = document.createElement("video");
    video.src = "./assets/video/demo.mov";
    video.loop = true;
    video.muted = true;
    video.play();

    const videoTexture = new THREE.VideoTexture(video);
    videoTexture.colorSpace = THREE.SRGBColorSpace;
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    videoTexture.generateMipmaps = false;

    // hdri texture test
    const textureLoader = new THREE.CubeTextureLoader();
    const envMap = textureLoader.load([
        "./assets/cubeMaps/cubeMap1/nx.png",
        "./assets/cubeMaps/cubeMap1/ny.png",
        "./assets/cubeMaps/cubeMap1/nz.png",
        "./assets/cubeMaps/cubeMap1/px.png",
        "./assets/cubeMaps/cubeMap1/py.png",
        "./assets/cubeMaps/cubeMap1/pz.png",
    ]);
    envMap.mapping = THREE.CubeRefractionMapping;
    this.scene.environment = envMap;
    sceneModelArr.forEach((obj, i) => {
        let newMaterial;
        switch (i) {
            case 0:
                newMaterial = new THREE.MeshStandardMaterial({
                    side: THREE.DoubleSide,
                    roughness: 0.0,
                    metalness: 0.1,
                    envMap: envMap,
                });
                break;
            case 1:
                newMaterial = new THREE.MeshStandardMaterial({
                    side: THREE.DoubleSide,
                    roughness: 0.0,
                    metalness: 0.1,
                    envMap: envMap,
                });
                break;
            case 2:
                newMaterial = new THREE.MeshBasicMaterial({ map: videoTexture, side: THREE.DoubleSide });
                break;
        }
        obj.traverse((child) => {
            child.material = newMaterial;
            child.material.needsUpdate = true;
        });
    });
};

SceneBuilder.sceneBuilderArr = [
    scene1,
    sceneBuilder4,
    sceneBuilder4,
    sceneBuilder4,
    sceneBuilder4,
    sceneBuilder4,
    sceneBuilder4,
    sceneBuilder4,
    sceneBuilder4,
    sceneBuilder1,
    sceneBuilder2,
    sceneBuilder3,
    sceneBuilder4,
];
