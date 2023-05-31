import * as THREE from '../libs/three.module.js'
import * as CSG from '../libs/CSG-v2.js'

class foco extends THREE.Object3D {

    constructor() {
        super();

        // Construcción del Mesh
        this.createFoco();
    }

    createFoco() {
        var focoGeometry = new THREE.CylinderGeometry(15, 30, 50, 100, 100);

        var texture = new THREE.TextureLoader().load('../imgs/foco.webp');
        var focoMaterial = new THREE.MeshPhongMaterial({map: texture});
        var foco = new THREE.Mesh(focoGeometry, focoMaterial);

        this.add(foco);
    }

    update() {

    }
}

export { foco };