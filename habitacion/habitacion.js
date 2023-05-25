import * as THREE from '../libs/three.module.js'
import * as CSG from '../libs/CSG-v2.js'
import {candado} from "./candado.js";

class habitacion extends THREE.Object3D {
    WidthH = 750;
    HeightH = 325;
    DepthH = 1500;
    puertaHeight = 200;
    puertaWidth = 107;

    constructor() {
        super();

        // Se crea la parte de la interfaz que corresponde a la caja
        // Se crea primero porque otros métodos usan las variables que se definen para la interfaz

        // Construcción del Mesh

        this.createGroundAndTecho();

        this.createParedes();

        this.puerta = this.createPuerta();
        this.puerta.name = "puerta";

        this.puerta.position.y = this.puertaHeight / 2;
        this.puerta.position.z = -this.DepthH / 2;

        this.createPomo();

        this.add(this.puerta);
    }

    createParedes() {
        var pared1, pared2, pared3, pared4, pared5, pared6;

        var geometryPared = new THREE.BoxGeometry (0.2, this.HeightH, this.DepthH);
        var geometryPared2 = new THREE.BoxGeometry (this.WidthH, this.HeightH, 10);
        var geometryParedLaterales = new THREE.BoxGeometry (this.WidthH / 2 - this.puertaWidth / 2, this.HeightH, 10);
        var geometryParedPuerta = new THREE.BoxGeometry (this.puertaWidth + 20, this.HeightH - this.puertaHeight, 9);
        var textureAux = new THREE.TextureLoader().load('../imgs/base_relieve.jpg');
        var textureBump = new THREE.TextureLoader().load('../imgs/ladrillo.jpg');

        var materialPared = new THREE.MeshPhongMaterial ({map: textureAux, bumpMap: textureBump, bumpScale: 1});

        pared1 = new THREE.Mesh(geometryPared, materialPared);
        pared2 = new THREE.Mesh(geometryPared, materialPared);
        pared3 = new THREE.Mesh(geometryPared2, materialPared);
        pared4 = new THREE.Mesh(geometryParedLaterales, materialPared);
        pared5 = new THREE.Mesh(geometryParedLaterales, materialPared);
        pared6 = new THREE.Mesh(geometryParedPuerta, materialPared);

        pared1.name = "pared1";
        pared2.name = "pared2";
        pared3.name = "pared3";
        pared4.name = "pared4";
        pared5.name = "pared5";
        pared6.name = "pared6";

        pared1.position.set(-this.WidthH / 2, this.HeightH / 2, 0);
        pared2.position.set(this.WidthH / 2, this.HeightH / 2, 0);
        pared3.position.set(0, this.HeightH / 2, this.DepthH / 2);
        pared4.position.set(this.DepthH / 7, this.HeightH / 2, -this.DepthH / 2);
        pared5.position.set(-this.DepthH / 7, this.HeightH / 2, -this.DepthH / 2);
        pared6.position.set(0, 2*this.HeightH - 2*this.puertaHeight + 12, -this.DepthH / 2);

        this.add(pared1, pared2, pared3, pared4, pared5, pared6);
    }

    createGroundAndTecho () {
        // El suelo es un Mesh, necesita una geometría y un material.

        // La geometría es una caja con muy poca altura
        var geometryGround = new THREE.BoxGeometry(this.WidthH,0.2, this.DepthH);

        // El material se hará con una textura de madera
        var texture = new THREE.TextureLoader().load('../imgs/suelo.jpg');
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(9, 15);
        var textureTecho = new THREE.TextureLoader().load('../imgs/techoTextura.jpg');
        textureTecho.wrapS = THREE.RepeatWrapping;
        textureTecho.wrapT = THREE.RepeatWrapping;
        textureTecho.repeat.set(1, 3);
        var materialGround = new THREE.MeshPhongMaterial ({map: texture});
        var materialTecho= new THREE.MeshPhongMaterial ({map: textureTecho});

        // Ya se puede construir el Mesh
        var ground = new THREE.Mesh (geometryGround, materialGround) ;
        var techo = new THREE.Mesh(geometryGround, materialTecho) ;

        // Todas las figuras se crean centradas en el origen.
        // El suelo lo bajamos la mitad de su altura para que el origen del mundo se quede en su lado superior
        ground.position.y = -0.1;
        techo.position.y = this.HeightH;

        // Que no se nos olvide añadirlo a la escena, que en este caso es  this
        this.add(ground, techo);
    }

    createPuerta() {
        var geometryPuerta = new THREE.BoxGeometry(this.puertaWidth, this.puertaHeight, 15);
        var texture = new THREE.TextureLoader().load('../imgs/puerta.jpg');
        var materialPuerta = new THREE.MeshPhongMaterial({map: texture});

        return new THREE.Mesh(geometryPuerta, materialPuerta);
    }

    createPomo() {
        var geometryApoyo = new THREE.CylinderGeometry(2.5, 2.5, 5, 100, 100);
        var geometryPomo = new THREE.SphereGeometry(3.75, 100, 100);
        var material = new THREE.MeshPhongMaterial({color: 0xfffaaa});

        geometryApoyo.translate(-2*this.puertaWidth / 5, 2.5, 0);
        geometryApoyo.rotateX(Math.PI / 2);
        geometryPomo.translate(-2*this.puertaWidth / 5, 0, 5 + 1.25);

        var ApoyoMesh = new THREE.Mesh(geometryApoyo, material);
        var PomoMesh = new THREE.Mesh(geometryPomo, material);
        this.candado = new candado();
        this.candado.position.set(-2*this.puertaWidth / 5, -9,  1.25);

        PomoMesh.add(this.candado);

        ApoyoMesh.position.z = 10;
        PomoMesh.position.z = 10;

        PomoMesh.name = "pomo";
        this.puerta.add(ApoyoMesh, PomoMesh);
    }

    update() {

    }
}

export { habitacion };