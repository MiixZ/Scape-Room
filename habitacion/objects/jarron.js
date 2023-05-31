import * as THREE from '../libs/three.module.js'
import * as CSG from '../libs/CSG-v2.js'
import { Corazon } from './Corazon.js';
import * as TWEEN from "../libs/tween.esm.js";

class jarron extends THREE.Object3D {
    jarron;
    constructor() {
        super();

        // Construcción del Mesh
        this.jarron = this.createJarron();
        this.jarron.name = "jarron";

        // Y añadirlo como hijo del Object3D (el this)
        this.corazon = new Corazon();
        this.corazon.scale.set(0.5, 0.5, 0.5);
        this.corazon.position.y = 10;
        this.add(this.corazon);
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

    animacionCorazon() {
        let rotacion = { y: this.corazon.position.y };
        let rotacionFinal = { y: this.corazon.position.y + 40 };

        let movimiento = new TWEEN.Tween(rotacion).to(rotacionFinal, 4000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(() => {
                this.corazon.position.y = rotacion.y;
            }).onComplete(() => {
                this.corazon.scale.set(1, 1, 1);
            });

        movimiento.start();
    }

    explotaCorazon() {
        let rotacion = { scale: 1 };
        let rotacionFinal = { scale: 0.05 };

        let movimiento = new TWEEN.Tween(rotacion).to(rotacionFinal, 7000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(() => {
                this.corazon.scale.set(rotacion.scale, rotacion.scale, rotacion.scale)
            }).onComplete(() => {
                this.remove(this.corazon);
            });

        movimiento.start();
    }

    update() {
        TWEEN.update();
        this.corazon.update();
    }
}

export { jarron };