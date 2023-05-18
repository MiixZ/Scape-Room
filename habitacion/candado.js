import * as THREE from '../libs/three.module.js'
import * as CSG from '../libs/CSG-v2.js'

class candado extends THREE.Object3D {

    constructor() {
        super();

        // Se crea la parte de la interfaz que corresponde a la caja
        // Se crea primero porque otros métodos usan las variables que se definen para la interfaz

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

export { candado };