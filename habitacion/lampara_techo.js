import * as THREE from '../libs/three.module.js'

class lamparastecho extends THREE.Object3D {

    constructor() {
        super();

        // Se crea la parte de la interfaz que corresponde a la caja
        // Se crea primero porque otros métodos usan las variables que se definen para la interfaz

        // Construcción del Mesh
        this.lampara1 = this.createLampara();

        this.lampara2 = this.createLampara();

        this.lampara1.position.x = 50;

        this.lampara2.position.x = -50;

        this.add(this.lampara1, this.lampara2);
    }

    createLampara() {
        var focoGeometry = new THREE.ConeGeometry(15, 30, 100, 100);
        var paloGeometry = new THREE.CylinderGeometry(1, 1, 25, 100, 100);

        var texture = new THREE.TextureLoader().load('../imgs/acero.jpg');
        var focoMaterial = new THREE.MeshPhongMaterial({map: texture});

        var foco = new THREE.Mesh(focoGeometry, focoMaterial);
        var palo = new THREE.Mesh(paloGeometry, focoMaterial);

        foco.position.y = -40;
        palo.position.y = -12.5;

        palo.add(foco);

        return palo;
    }

    update() {

    }
}

export { lamparastecho };