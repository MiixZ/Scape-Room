import * as THREE from '../libs/three.module.js'
import * as CSG from '../libs/CSG-v2.js'

class flexo extends THREE.Object3D {

    constructor() {
        super();

        // Se crea primero porque otros métodos usan las variables que se definen para la interfaz.

        // Construcción del Mesh
        this.cabezaFlexo = this.createCabeza();

        this.add(this.cabezaFlexo);
    }

    createCabeza() {
        var csg = new CSG.CSG();    // Para hacer las operaciones booleanas con la cabeza.

        var cilindroHeight = 15,
            cilindroRadiusTop = 15,
            cilindroRadiusBottom = 25,
            esferaRadius = 35;

        var materialGlobal = new THREE.MeshPhongMaterial({color: 0x000000});

        var cilindroGeometry = new THREE.CylinderGeometry(cilindroRadiusTop, cilindroRadiusBottom, cilindroHeight,
                                                    100, 100);

        cilindroGeometry.translate(0.1, 0.1, 0.1);

        var esfera1Geometry = new THREE.SphereGeometry(esferaRadius, 100, 100),
            esfera2Geometry = new THREE.SphereGeometry(esferaRadius - 0.6, 100, 100);

        esfera1Geometry.translate(0.1, 0.1, 0.1);
        esfera2Geometry.translate(0.1, 0.1, 0.1);

        var cuboGeometry = new THREE.BoxGeometry(esferaRadius, esferaRadius, esferaRadius);

        cuboGeometry.translate(0.1, 0.1, 0.1);

        var esfera1Mesh = new THREE.Mesh(esfera1Geometry, materialGlobal), esfera2Mesh = new THREE.Mesh(esfera2Geometry, materialGlobal),
            cilindroMesh = new THREE.Mesh(cilindroGeometry, materialGlobal), cuboMesh = new THREE.Mesh(cuboGeometry, materialGlobal);

        csg.subtract([esfera1Mesh, esfera2Mesh]);       // Esfera hueca.

        cuboMesh.translateY(-esferaRadius / 2);

        csg.subtract([esfera1Mesh, cuboMesh]);

        csg.union([cilindroMesh]);         // Cabeza.

        return csg.toMesh();
    }

    createCuello() {

    }

    createCuerpo() {

    }

    createBase() {

    }

    update() {

    }
}

export { flexo };