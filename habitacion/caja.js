import * as THREE from '../libs/three.module.js'
import * as CSG from '../libs/CSG-v2.js'

class caja extends THREE.Object3D {
    cajaLado = 50;

    constructor() {
        super();

        // Construcción del Mesh.

        this.createCaja();
    }

    createCaja() {
        var cajaGeometry = new THREE.BoxGeometry(this.cajaLado, this.cajaLado, this.cajaLado);

        var texture = new THREE.TextureLoader().load('../imgs/caja.jpg');
        var cajaMaterial = new THREE.MeshPhongMaterial({map: texture});
        var caja = new THREE.Mesh(cajaGeometry, cajaMaterial);

        this.add(caja);
    }

    update() {

    }
}

export { caja };