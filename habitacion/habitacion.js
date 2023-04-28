import * as THREE from '../libs/three.module.js'
import * as CSG from '../libs/CSG-v2.js'

class habitacion extends THREE.Object3D {
    WidthH = 750;
    HeightH = 250;
    DepthH = 1500;
    constructor(gui, titleGui) {
        super();

        // Se crea la parte de la interfaz que corresponde a la caja
        // Se crea primero porque otros métodos usan las variables que se definen para la interfaz

        // Construcción del Mesh

        this.createGroundAndTecho();

        this.createParedes();

        // Y añadirlo como hijo del Object3D (el this)

    }

    createParedes() {
        var pared1, pared2, pared3, pared4;

        var geometryPared = new THREE.BoxGeometry (0.2, this.HeightH, this.DepthH);
        var geometryPared2 = new THREE.BoxGeometry (this.WidthH, this.HeightH, 0.2);
        var texture = new THREE.TextureLoader().load('../imgs/roble_oscuro.jpg');
        var materialPared = new THREE.MeshPhongMaterial ({map: texture});

        pared1 = new THREE.Mesh(geometryPared, materialPared);
        pared2 = new THREE.Mesh(geometryPared, materialPared);
        pared3 = new THREE.Mesh(geometryPared2, materialPared);
        pared4 = new THREE.Mesh(geometryPared2, materialPared);

        pared1.position.set(-this.WidthH / 2, this.HeightH / 2, 0);
        pared2.position.set(this.WidthH / 2, this.HeightH / 2, 0);
        pared3.position.set(0, this.HeightH / 2, this.DepthH / 2);
        pared4.position.set(0, this.HeightH / 2, -this.DepthH / 2);

        this.add(pared1, pared2, pared3, pared4);
    }

    createGroundAndTecho () {
        // El suelo es un Mesh, necesita una geometría y un material.

        // La geometría es una caja con muy poca altura
        var geometryGround = new THREE.BoxGeometry(this.WidthH,0.2, this.DepthH);

        // El material se hará con una textura de madera
        var texture = new THREE.TextureLoader().load('../imgs/wood.jpg');
        var textureTecho = new THREE.TextureLoader().load('../imgs/techo.jpg');
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

    update() {

    }
}

export { habitacion };