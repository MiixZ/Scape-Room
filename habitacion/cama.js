import * as THREE from '../libs/three.module.js'
import { MTLLoader } from '../libs/MTLLoader.js'
import { OBJLoader } from '../libs/OBJLoader.js'

class cama extends THREE.Object3D {

    constructor() {
        super();

        // Se crea la parte de la interfaz que corresponde a la caja
        // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
        var materialLoader = new MTLLoader();
        var objLoader = new OBJLoader();
        materialLoader.load('../models/cama/cama.mtl',
            (materials) => {
                objLoader.setMaterials(materials);
                objLoader.load('../models/cama/cama.obj',
                    (object) => {
                        this.add(object);
                    }, null, null);
            });

        this.scale.set(100, 100, 100);
        this.position.y = 5;
        this.position.x = -300;
    }

    update() {

    }
}

export { cama };