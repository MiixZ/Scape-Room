import * as THREE from '../libs/three.module.js'
import * as TWEEN from "../libs/tween.esm.js";

class lamparastecho extends THREE.Object3D {
    DepthH = 1500;

    constructor() {
        super();

        // Se crea la parte de la interfaz que corresponde a la caja
        // Se crea primero porque otros métodos usan las variables que se definen para la interfaz

        // Construcción del Mesh
        this.lampara1 = this.createLampara();

        this.lampara2 = this.createLampara();

        this.lampara1.position.x = 150;

        this.lampara2.position.x = -150;

        this.animacion();

        this.add(this.lampara1, this.lampara2);
    }

    createLampara() {
        var focoGeometry = new THREE.ConeGeometry(15, 30, 100, 100);
        var paloGeometry = new THREE.CylinderGeometry(1, 1, 25, 100, 100);
        var bombillaGeometry = new THREE.SphereGeometry(5, 100, 100);

        var texture = new THREE.TextureLoader().load('../imgs/acero.jpg');
        var azulMaterial = new THREE.MeshPhongMaterial({color: 0x0000ff});
        var focoMaterial = new THREE.MeshPhongMaterial({map: texture});

        var foco = new THREE.Mesh(focoGeometry, focoMaterial);
        var palo = new THREE.Mesh(paloGeometry, focoMaterial);
        this.bombilla = new THREE.Mesh(bombillaGeometry, azulMaterial);

        foco.position.y = -25;
        palo.position.y = -12.5;
        this.bombilla.position.y = -39;

        this.light = new THREE.SpotLight(0xffffff, 0.6);
        this.light.target = foco;
        this.light.angle = Math.PI/3;
        this.light.penumbra = 0.6;
        this.light.decay = 0.5;
        this.light.position.y = -12.5;

        palo.add(foco, this.bombilla, this.light);

        return palo;
    }

    animacion () {
        let rotacion = {z: this.DepthH / 2 - 15};
        let rotacionFinal = {z: -this.DepthH / 2 + 15};
        let rotacion2 = {z: -this.DepthH / 2 + 15};
        let rotacionFinal2 = {z: this.DepthH / 2 - 15};

        let movimiento = new TWEEN.Tween(rotacion).to(rotacionFinal, 20000)
            .easing(TWEEN.Easing.Linear.None)
            .onUpdate(() => {
                this.lampara1.position.z = rotacion.z;
                this.lampara2.position.z = -rotacion.z;
            })

        let movimiento2 = new TWEEN.Tween(rotacion2).to(rotacionFinal2, 20000)
            .easing(TWEEN.Easing.Linear.None)
            .onUpdate(() => {
                this.lampara1.position.z = rotacion2.z;
                this.lampara2.position.z = -rotacion2.z;
            })

        movimiento.chain(movimiento2);
        movimiento2.chain(movimiento);

        movimiento.start();
    }

    update() {
        TWEEN.update();
    }
}

export { lamparastecho };