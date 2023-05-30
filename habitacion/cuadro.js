import * as THREE from '../libs/three.module.js'
import * as CSG from '../libs/CSG-v2.js'

class cuadro extends THREE.Object3D {
    constructor() {
        super();

        // Construcción del Mesh
        this.createCuadro();
    }

    createCuadro() {
        var cuadrito = new THREE.BoxGeometry(150, 150, 10);
        var apoyovideo = new THREE.BoxGeometry(150, 150, 0.1);

        this.video = document.createElement('video');
        this.video.crossOrigin = 'anonymous';
        this.video.preload = '';
        this.video.loop = true;
        this.video.src = '../imgs/bisbal.mp4';
        this.video.load();

        var texture = new THREE.VideoTexture(this.video);
        texture.generateMipmaps = false;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.format = THREE.RGBAFormat;

        var cuadroMaterial = new THREE.MeshPhongMaterial({map: texture});

        this.vidcuadro = new THREE.Mesh(apoyovideo, cuadroMaterial);
        this.vidcuadro.position.set(0, 0, -5.1);

        var materialCuadro = new THREE.MeshPhongMaterial({color: 0x000000});

        this.cuadr = new THREE.Mesh(cuadrito, materialCuadro);
        this.cuadr.add(this.vidcuadro);

        this.cuadr.position.set(0, 25, 0);

        this.add(this.cuadr);
    }

    update() {

    }
}

export { cuadro };