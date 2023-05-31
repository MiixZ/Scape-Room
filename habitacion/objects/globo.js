import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js';
import * as TWEEN from '../libs/tween.esm.js';


class Globo extends THREE.Object3D {

    constructor() {
        super();
        this.globoWidth = 20;
        this.tablonH = 20;
        this.paloW = 2;
        this.paloH = 8;
        this.baseW = 10;
        this.baseH = 2;
        this.rotacion_arriba = 0;
        // Se crea la parte de la interfaz que corresponde a la caja
        // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
        let figura = new THREE.Object3D();
        this.arriba = this.crearMediaEsferaHueca(true);
        figura.add(this.arriba);

        this.abajo = this.crearMediaEsferaHueca(false);
        figura.add(this.abajo);

        this.tablon = this.crearTablon();
        figura.add(this.tablon);

        this.apoyo = this.crearApoyo();
        this.apoyo.position.y -= (this.globoWidth + this.paloH-1) ;
        figura.add(this.apoyo);
        figura.position.y += this.globoWidth + this.paloH -1;

        this.add(figura);
    }

    crearMediaEsferaHueca(positive) {
        let texture = new THREE.TextureLoader().load('../imgs/textura-ajedrezada-marco.jpg');
        let material = new THREE.MeshPhongMaterial({ map: texture });
        let geometryExt = new THREE.SphereGeometry(this.globoWidth);
        let meshExt = new THREE.Mesh(geometryExt, material);

        let geometryInt = new THREE.SphereGeometry(this.globoWidth - 2);
        let meshInt = new THREE.Mesh(geometryInt, material);

        let geoCube = new THREE.BoxGeometry(this.globoWidth * 2 + 1, this.globoWidth, this.globoWidth * 2 + 1);
        let cubeMesh = new THREE.Mesh(geoCube, material);

        if (positive) {
            cubeMesh.position.y = -this.globoWidth / 2;
        } else {
            cubeMesh.position.y = this.globoWidth / 2;

        }
        let csg = new CSG();
        csg.union([meshExt]);
        csg.subtract([meshInt]);
        csg.subtract([cubeMesh]);

        let mesh = csg.toMesh();
        if (positive) {
            mesh.position.set(-this.globoWidth, 0,0)
            let movil = new THREE.Object3D(); 
            movil.position.set(this.globoWidth,0,0);
            movil.rotation.z = this.rotacion_arriba;
            movil.add(mesh);
            return movil;
        }

        return mesh;
    }


    crearTablon(){
        let texture = new THREE.TextureLoader().load('../imgs/cabecera_0.jpg');
        let material = new THREE.MeshPhongMaterial({ map: texture });
        let geoCube = new THREE.BoxGeometry(this.tablonH, this.tablonH, 0.1);
        let mesh = new THREE.Mesh(geoCube, material);

        return mesh;
    }

    crearApoyo(){
        let apoyo = new THREE.Object3D();
        let texture = new THREE.TextureLoader().load('../imgs/marmol-blanco.jpg');
        let material = new THREE.MeshPhongMaterial({ map: texture });
        let circleGeo = new THREE.CylinderGeometry(this.baseW,this.baseW,this.baseH,50);
        let circleMesh = new THREE.Mesh(circleGeo, material);

        let cylGeo = new THREE.CylinderGeometry(this.paloW, this.paloW, this.paloH, 50);
        let cylMesh = new THREE.Mesh(cylGeo, material);

        cylMesh.position.y += this.paloH/2;
        apoyo.add(cylMesh);
        apoyo.add(circleMesh);

        return apoyo;
    }


    animacion(){
        let rotacion = {z:0};
        let rotacionFinal = {z: Math.PI/2}
        let movimiento = new TWEEN.Tween(rotacion).to(rotacionFinal, 4000)
        .easing(TWEEN.Easing.Linear.None)
        .onUpdate(() => {
            this.arriba.rotation.z = -rotacion.z;
        });

        movimiento.start();
    }

    update() {
        TWEEN.update();
    }
}

export { Globo };