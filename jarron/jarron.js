import * as THREE from '../libs/three.module.js'
import * as CSG from '../libs/CSG-v2.js'

class jarron extends THREE.Object3D {
    jarron;
    constructor(gui, titleGui) {
        super();

        // Se crea la parte de la interfaz que corresponde a la caja
        // Se crea primero porque otros métodos usan las variables que se definen para la interfaz

        // Construcción del Mesh
        this.jarron = this.createJarron();

        // Y añadirlo como hijo del Object3D (el this)
        this.add(this.jarron);
    }

    createJarron() {
        var csg = new CSG.CSG();
        var esfera1Geom = new THREE.SphereGeometry(0.5, 10, 10);
        var esfera2Geom = new THREE.SphereGeometry(1, 10, 10);
        var esfera3Geom = new THREE.SphereGeometry(0.8, 10, 10);

        esfera1Geom.translate(0, 2, 0);
        esfera2Geom.translate(0, 1, 0);
        esfera3Geom.translate(0, 1, 0);

        var esferasMaterial = new THREE.MeshPhongMaterial({color: 0xc4aead});

        var esfera1Mesh = new THREE.Mesh(esfera1Geom, esferasMaterial);
        var esfera2Mesh = new THREE.Mesh(esfera2Geom, esferasMaterial);
        var esfera3Mesh = new THREE.Mesh(esfera3Geom, esferasMaterial);

        csg.subtract([esfera2Mesh, esfera3Mesh]);  // Entre corchetes porque tiene que iterar un array.
        csg.subtract([esfera1Mesh]);
        return csg.toMesh();
    }

    update() {

    }
}

export { jarron };