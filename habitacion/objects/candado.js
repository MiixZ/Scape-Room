import * as THREE from '../libs/three.module.js'

class candado extends THREE.Object3D {
    // Material marrón.
    materialMarron = new THREE.MeshPhongMaterial({color: 0x654321});
    // Material plateado.
    materialPlateado = new THREE.MeshPhongMaterial({color: 0xCCCCCC});

    constructor() {
        super();

        // Se crea la parte de la interfaz que corresponde a la caja.
        // Se crea primero porque otros métodos usan las variables que se definen para la interfaz.

        // Construcción del Mesh
        this.createCandado();
    }

    createCandado() {
        var cuerpo = new THREE.CylinderGeometry(3, 3, 7, 100, 100);
        var toro = new THREE.TorusGeometry(4, 0.5, 100, 100);

        let candadoMesh = new THREE.Mesh(cuerpo, this.materialMarron);
        let toroMesh = new THREE.Mesh(toro, this.materialPlateado);

        toroMesh.name = "candado";
        candadoMesh.name = "candado";

        candadoMesh.translateY(3.5);
        toroMesh.translateY(9);
        candadoMesh.scale.set(2, 1, 1);

        this.add(candadoMesh, toroMesh);
    }

    update() {

    }
}

export { candado };