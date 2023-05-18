import * as THREE from '../libs/three.module.js'
import { MTLLoader } from '../libs/MTLLoader.js'
import { OBJLoader } from '../libs/OBJLoader.js'
import {MeshPhongMaterial} from "../libs/three.module.js";

class cama extends THREE.Object3D {
 constructor() {
        super();

        // Se crea la parte de la interfaz que corresponde a la caja
        // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
        var materialLoader = new MTLLoader();
        var objLoader = new OBJLoader();
        this.box = new THREE.Box3();
        materialLoader.load('../models/cama/cama.mtl',
            (materials) => {
                objLoader.setMaterials(materials);
                objLoader.load('../models/cama/cama.obj',
                    (object) => {
                        this.box = new THREE.Box3().setFromObject(object);
                        object.scale.set(100, 100, 100);
                        this.add(object);
                    }, null, null);
            });

        this.position.y = 5;
        this.position.x = -277;

        this.createTablon();
    }

    createTablon() {
        var tablonGeometry = new THREE.BoxGeometry(150, 150, 5, 100, 100);
        var texture = new THREE.TextureLoader().load('../imgs/cabecera_8.jpg');
        var tablonMaterial = new MeshPhongMaterial({ map: texture });

        this.tablon = new THREE.Mesh(tablonGeometry, tablonMaterial);
        this.tablon.position.z = -147;
        this.tablon.position.y = 75;

        this.add(this.tablon);
    }

    update() {

    }
}

export { cama };