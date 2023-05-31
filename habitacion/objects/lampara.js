import * as THREE from '../libs/three.module.js'
import * as CSG from '../libs/CSG-v2.js'

class lampara extends THREE.Object3D {
    Radius = 3;
    HeightH = 200;
    RadiusBase = 30;
    HeightBase = 1;
    CabezaHeight = 50;
    CabezaRadiusSup = 15;
    CabezaRadiusInf = 30;

    constructor() {
        super();

        // Construcción del Mesh.

        this.createBase();

        this.createCabeza();
    }

    createBase() {
        var baseGeometry = new THREE.CylinderGeometry(this.RadiusBase, this.RadiusBase, 3, 100, 100);
        var paloGeometry = new THREE.CylinderGeometry(this.Radius, this.Radius, this.HeightH, 100, 100);

        var baseMaterial = new THREE.MeshPhongMaterial({color: 0xfafafa});

        this.base = new THREE.Mesh(baseGeometry, baseMaterial);
        this.palo = new THREE.Mesh(paloGeometry, baseMaterial);

        this.base.position.y += this.HeightBase / 2;
        this.palo.position.y += this.HeightBase / 2 + this.HeightH / 2;

        this.add(this.base, this.palo);
    }

    createCabeza() {
        var cabezaGeometry = new THREE.CylinderGeometry(this.CabezaRadiusSup, this.CabezaRadiusInf, this.CabezaHeight, 100, 100, true);

        var texture = new THREE.TextureLoader().load('../imgs/estampado.jpg');
        var cabezaMaterial = new THREE.MeshPhysicalMaterial({map: texture});

        this.cabeza = new THREE.Mesh(cabezaGeometry, cabezaMaterial);

        this.cabeza.position.y = this.CabezaHeight / 2 + this.HeightBase / 2 + 3 * this.HeightH / 4;

        this.add(this.cabeza);
    }

    update() {

    }
}

export { lampara };