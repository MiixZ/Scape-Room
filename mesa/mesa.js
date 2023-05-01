import * as THREE from '../libs/three.module.js'
import * as CSG from '../libs/CSG-v2.js'
import { jarron } from '../jarron/jarron.js'

class mesa extends THREE.Object3D {
    pata;
    pata2;
    pata3;
    pata4;
    superficie;
    jarronMesa;
    mesaWidth = 100;
    mesaHeight = 50;
    mesaDepth = 200;

    constructor() {
        super();

        // Se crea la parte de la interfaz que corresponde a la caja
        // Se crea primero porque otros métodos usan las variables que se definen para la interfaz

       /* // ----------------------------- CILINDRO 1 -------------------------------------------
        // Un Mesh se compone de geometría y material.
        // radialSegment (quinto parámetro: número de revoluciones).
        // heightSegment (sexto parámetro: número de extrusiones).
        var cilindroGeom = new THREE.CylinderGeometry(1, 1, 4);
        // Como material se crea uno a partir de un color
        var cilindroMaterial = new THREE.MeshPhongMaterial({color: 0x008000});

        // ----------------------------- CILINDRO 2 -------------------------------------------
        // Un Mesh se compone de geometría y material
        var cilindroGeom2 = new THREE.CylinderGeometry(1, 1, 4);
        // Como material se crea uno a partir de un color.
        var cilindroMaterial2 = new THREE.MeshPhongMaterial({color: 0x008000});

        // ----------------------------- CILINDRO 3 -------------------------------------------
        // Un Mesh se compone de geometría y material
        var cilindroGeom3 = new THREE.CylinderGeometry(1, 1, 4);
        // Como material se crea uno a partir de un color
        var cilindroMaterial3 = new THREE.MeshPhongMaterial({color: 0x008000});

        // ----------------------------- CILINDRO 4 -------------------------------------------
        // Un Mesh se compone de geometría y material
        var cilindroGeom4 = new THREE.CylinderGeometry(1, 1, 4);
        // Como material se crea uno a partir de un color
        var cilindroMaterial4 = new THREE.MeshPhongMaterial({color: 0x008000});*/

        // Construcción del Mesh
        this.pata = this.createCilindro();
        this.pata2 = this.createCilindro();
        this.pata3 = this.createCilindro();
        this.pata4 = this.createCilindro();
        this.superficie = this.createCuadrado();
        this.jarronMesa = new jarron();

        // Y añadirlo como hijo del Object3D (el this)
        this.add(this.pata);
        this.add(this.pata2);
        this.add(this.pata3);
        this.add(this.pata4);
        this.add(this.superficie);
        this.add(this.jarronMesa);

        // Las geometrías se crean centradas en el origen.
        // Como queremos que el sistema de referencia esté en la base,
        // subimos el Mesh del pata a la mitad de su altura, y colocamos cada pata en su sitio.
        // Cilindro 1 -> Pata delantera derecha.
        // Cilindro 2 -> Pata delantera izquierda.
        // Cilindro 3 -> Pata trasera derecha.
        // Cilindro 4 -> Pata trasera izquierda.

        this.jarronMesa.scale.set(10, 10, 10);

        this.pata.position.y = this.mesaHeight / 2;
        this.pata2.position.y = this.mesaHeight / 2;
        this.pata3.position.y = this.mesaHeight / 2;
        this.pata4.position.y = this.mesaHeight / 2;
        this.superficie.position.y = this.mesaHeight; // Encima de los cilindros.
        this.jarronMesa.position.y = this.mesaHeight;

        this.pata.position.x = this.mesaWidth / 3;
        this.pata2.position.x = this.mesaWidth / 3;
        this.pata3.position.x = -this.mesaWidth / 3;
        this.pata4.position.x = -this.mesaWidth / 3;
        this.jarronMesa.position.x = -this.mesaWidth / 4;

        this.pata.position.z = -this.mesaDepth/ 3;
        this.pata2.position.z = this.mesaDepth/ 3;
        this.pata3.position.z = -this.mesaDepth/ 3;
        this.pata4.position.z = this.mesaDepth/ 3;
        this.jarronMesa.position.z = this.mesaWidth / 2;
    }

    createCuadrado() {
        var SuperficieGeom = new THREE.BoxGeometry(this.mesaWidth, 1, this.mesaDepth, 10, 10, 10);
        var superficieMaterial = new THREE.MeshPhongMaterial({color: 0xcd853f});

        return new THREE.Mesh(SuperficieGeom, superficieMaterial);
    }

    createCilindro() {
        var cilindroGeom = new THREE.CylinderGeometry(3, 3, this.mesaHeight);
        var cilindroMaterial = new THREE.MeshPhongMaterial({color: 0x654321});

        return new THREE.Mesh(cilindroGeom, cilindroMaterial);
    }

    update () {

    }
}

export { mesa };
