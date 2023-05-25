import * as THREE from '../libs/three.module.js'
import * as CSG from '../libs/CSG-v2.js'
import * as TWEEN from "../libs/tween.esm.js";

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
        this.cajaMaterial = new THREE.MeshPhongMaterial({map: texture, transparent: true});
        this.caja = new THREE.Mesh(cajaGeometry, this.cajaMaterial);

        this.add(this.caja);
    }

    luminosidadCaja() {
        let rotacion = {z:1};
        let rotacionFinal = {z:0.2};

        let movimiento = new TWEEN.Tween(rotacion).to(rotacionFinal, 20000)
            .easing(TWEEN.Easing.Linear.None)
            .onUpdate(() => {
                this.cajaMaterial.opacity = rotacion.z;
            })
            .start();
    }

    update() {
        TWEEN.update();
    }
}

export { caja };