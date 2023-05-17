import * as THREE from '../libs/three.module.js'
import * as CSG from '../libs/CSG-v2.js'

class flexo extends THREE.Object3D {
    rotacion = false;

    constructor() {
        super();

        // Se crea primero porque otros métodos usan las variables que se definen para la interfaz.

        // Construcción del Mesh
        this.cabezaFlexo = this.createCabeza();
        this.cuelloFlexo = this.createCuello();
        this.cuerpoFlexo = this.createCuerpo();
        this.baseFlexo = this.createBase();             // Realmente es el flexo entero.

        this.add(this.baseFlexo);
    }

    createCabeza() {
        // Crear una cabeza de flexo ayudándose con csg.
        // Se puede crear una esfera y un cilindro y hacer la resta.
        var csg = new CSG.CSG();
        var csg2 = new CSG.CSG();
        var csgAux = new CSG.CSG();
        var materialVerde = new THREE.MeshPhongMaterial({color: 0x00ff00});
        var materialRojo = new THREE.MeshPhongMaterial({color: 0xff0000});

        var esferaGeom = new THREE.SphereGeometry(15, 10, 10);
        var esfera2Geom = new THREE.SphereGeometry(14, 10, 10);

        var cilindroGeom = new THREE.CylinderGeometry(5, 9, 25, 10, 10);

        var cuboGeom = new THREE.BoxGeometry(35, 15, 35);

        var esferaMesh = new THREE.Mesh(esferaGeom, materialVerde);
        var esfera2Mesh = new THREE.Mesh(esfera2Geom, materialVerde);
        var cilindroMesh = new THREE.Mesh(cilindroGeom, materialRojo);
        var cuboMesh = new THREE.Mesh(cuboGeom, materialRojo);

        var esferaHueca = csg.subtract([esferaMesh, esfera2Mesh]).toMesh();

        esferaHueca.position.y = -19;

        var cabezaSinCortar = csg2.union([esferaHueca, cilindroMesh]).toMesh();

        cuboMesh.position.y = -27.5;

        this.cabeza = csgAux.subtract([cabezaSinCortar, cuboMesh]).toMesh();

        this.cabeza.translateZ(-7.5);
        this.cabeza.translateY(12.5);
        this.cabeza.rotateX(Math.PI/3);

        this.light = new THREE.SpotLight(0x0000ff, 1);
        this.light.target = this.cabeza;
        this.light.angle = Math.PI/4;
        this.cabeza.add(this.light);

        return this.cabeza;
    }

    createCuello() {
        // Crear un cuello simple con un cilindro alto y delgado acorde a las medidas de la cabeza.
        var cuelloGeom = new THREE.CylinderGeometry(2.5, 2.5, 25, 100, 100);
        var materialVerde = new THREE.MeshPhongMaterial({color: 0x00ff00});

        this.cuelloMesh = new THREE.Mesh(cuelloGeom, materialVerde);

        this.cuelloMesh.add(this.cabezaFlexo);

        this.cuelloMesh.translateY(12.5);
        this.cuelloMesh.rotateX(-Math.PI/4);
        this.cuelloMesh.translateY(12.5);

        return this.cuelloMesh;
    }

    createCuerpo() {
        var cuerpoGeom = new THREE.CylinderGeometry(2.5, 2.5, 25, 10, 10);
        var materialRojo = new THREE.MeshPhongMaterial({color: 0xff0000});

        this.cuerpoMesh = new THREE.Mesh(cuerpoGeom, materialRojo);

        var apoyoCuelloGeom = new THREE.SphereGeometry(2.5, 100, 100);

        this.apoyoCuelloMesh = new THREE.Mesh(apoyoCuelloGeom, materialRojo);
        this.apoyoCuelloMesh.position.y = 12.5;

        this.cuerpoMesh.translateY(12.5);

        this.cuerpoMesh.add(this.cuelloFlexo, this.apoyoCuelloMesh);

        this.cuerpoMesh.translateY(0.25);

        return this.cuerpoMesh;
    }

    createBase() {
        var baseGeom = new THREE.CylinderGeometry(15, 15, 0.5, 100, 10);
        var materialRojo = new THREE.MeshPhongMaterial({color: 0xff00ff});

        var baseMesh = new THREE.Mesh(baseGeom, materialRojo);

        baseMesh.translateY(0.25);

        baseMesh.add(this.cuerpoFlexo);

        return baseMesh;
    }

    update() {
        this.cuelloFlexo.translateY(-12.5);
        this.cuelloMesh.rotateX(Math.PI/4);
        this.cuelloFlexo.rotateZ(0.01);
        this.cuelloMesh.rotateX(-Math.PI/4);
        this.cuelloFlexo.translateY(12.5);

        this.cuerpoFlexo.rotateY(0.01);
    }
}

export { flexo };