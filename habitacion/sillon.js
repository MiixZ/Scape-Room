import * as THREE from '../libs/three.module.js'
import { MTLLoader } from '../libs/MTLLoader.js'
import { OBJLoader } from '../libs/OBJLoader.js'
import {MeshPhongMaterial} from "../libs/three.module.js";

class sillon extends THREE.Object3D {
    constructor() {
        super();

        var materialLoader = new MTLLoader();
        var objLoader = new OBJLoader();
        this.box = new THREE.Box3();
        materialLoader.load('../models/sillon/chairss.mtl',
            (materials) => {
                objLoader.setMaterials(materials);
                objLoader.load('../models/sillon/chairss.obj',
                    (object) => {
                        this.box = new THREE.Box3().setFromObject(object);
                        object.scale.set(150, 150, 150);
                        this.add(object);
                    }, null, null);
            });
    }

    update() {

    }
}

export { sillon };