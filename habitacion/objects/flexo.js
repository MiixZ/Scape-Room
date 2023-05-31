import * as THREE from '../libs/three.module.js'
import * as CSG from '../libs/CSG-v2.js'
import * as TWEEN from '../libs/tween.esm.js';

class flexo extends THREE.Object3D {
    texture = new THREE.TextureLoader().load('../imgs/flexo.jpg');
    material = new THREE.MeshPhysicalMaterial({map: this.texture});
    empiezaAnimacion = false;

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

        var esferaGeom = new THREE.SphereGeometry(15, 10, 10);
        var esfera2Geom = new THREE.SphereGeometry(14, 10, 10);

        var cilindroGeom = new THREE.CylinderGeometry(5, 9, 25, 10, 10);

        var cuboGeom = new THREE.BoxGeometry(35, 15, 35);

        var esferaMesh = new THREE.Mesh(esferaGeom, this.material);
        var esfera2Mesh = new THREE.Mesh(esfera2Geom, this.material);
        var cilindroMesh = new THREE.Mesh(cilindroGeom, this.material);
        var cuboMesh = new THREE.Mesh(cuboGeom, this.material);

        var esferaHueca = csg.subtract([esferaMesh, esfera2Mesh]).toMesh();

        esferaHueca.position.y = -19;

        var cabezaSinCortar = csg2.union([esferaHueca, cilindroMesh]).toMesh();

        cuboMesh.position.y = -27.5;

        this.cabeza = csgAux.subtract([cabezaSinCortar, cuboMesh]).toMesh();

        this.cabeza.translateZ(-7.5);
        this.cabeza.translateY(12.5);
        this.cabeza.rotateX(Math.PI/3);

        var bombillaGeom = new THREE.SphereGeometry(3, 100, 100);
        var bombillaMat = new THREE.MeshPhongMaterial({color: 0x0f0fff,    // Color blanco
                                                                                 shininess: 100,     // Brillo máximo
                                                                                 specular: 0xffffff  // Reflejo máximo
                                                                                 });

        var bombillaMesh = new THREE.Mesh(bombillaGeom, bombillaMat);
        bombillaMesh.position.y = -12;

        this.light = new THREE.SpotLight(0x0000ff, 1);
        this.light.target = this.cabeza;
        this.light.angle = Math.PI/6;
        this.light.penumbra = 0.6;
        this.light.decay = 0.5;
        this.light.position.y = 100;

        this.cabeza.add(this.light, bombillaMesh);

        return this.cabeza;
    }

    createCuello() {
        // Crear un cuello simple con un cilindro alto y delgado acorde a las medidas de la cabeza.
        var cuelloGeom = new THREE.CylinderGeometry(2.5, 2.5, 25, 100, 100);

        this.cuelloMesh = new THREE.Mesh(cuelloGeom, this.material);

        this.cuelloMesh.add(this.cabezaFlexo);

        this.cuelloMesh.translateY(12.5);
        this.cuelloMesh.rotateX(-Math.PI/4);
        this.cuelloMesh.translateY(12.5);

        return this.cuelloMesh;
    }

    createCuerpo() {
        var cuerpoGeom = new THREE.CylinderGeometry(2.5, 2.5, 25, 100, 100);

        this.cuerpoMesh = new THREE.Mesh(cuerpoGeom, this.material);

        var apoyoCuelloGeom = new THREE.SphereGeometry(2.5, 100, 100);

        this.apoyoCuelloMesh = new THREE.Mesh(apoyoCuelloGeom, this.material);
        this.apoyoCuelloMesh.position.y = 12.5;

        this.cuerpoMesh.translateY(12.5);

        this.cuerpoMesh.add(this.cuelloFlexo, this.apoyoCuelloMesh);

        this.cuerpoMesh.translateY(0.25);

        return this.cuerpoMesh;
    }

    createBase() {
        var baseGeom = new THREE.CylinderGeometry(15, 15, 0.5, 100, 10);

        var baseMesh = new THREE.Mesh(baseGeom, this.material);

        baseMesh.translateY(0.25);

        baseMesh.add(this.cuerpoFlexo);

        return baseMesh;
    }

    animacion(){
        if(!this.empiezaAnimacion) {
            let rotacion = {z:0};
            let rotacionFinal = {z: Math.PI};
            let rotacion2 = {z:Math.PI};
            let rotacionFinal2 = {z:2*Math.PI};
            let ix = 0;
            let sentidox = true;
            let iz = 0;
            let sentidoz = true;

            let movimiento = new TWEEN.Tween(rotacion).to(rotacionFinal, 500)
                .easing(TWEEN.Easing.Linear.None)
                .onUpdate(() => {
                    this.cuelloFlexo.translateY(-12.5);
                    this.cuelloFlexo.rotateX(Math.PI/4);
                    this.cuelloFlexo.rotation.z = rotacion.z;
                    this.cuelloFlexo.rotateX(-Math.PI/4);
                    this.cuelloFlexo.translateY(12.5);
                }).onComplete(() => {
                    if(ix === 5) {
                        sentidox = false;
                    } else if (ix === 0) {
                        sentidox = true;
                    }

                    if(sentidox) {
                        this.position.x += 5;
                        ix++;
                    } else {
                        this.position.x -= 5;
                        ix--;
                    }
                });

            let movimiento2 = new TWEEN.Tween(rotacion2).to(rotacionFinal2, 2000)
                .easing(TWEEN.Easing.Linear.None)
                .onUpdate(() => {
                    this.cuelloFlexo.translateY(-12.5);
                    this.cuelloFlexo.rotateX(Math.PI/4);
                    this.cuelloFlexo.rotation.z = rotacion2.z;
                    this.cuelloFlexo.rotateX(-Math.PI/4);
                    this.cuelloFlexo.translateY(12.5);
                }).onComplete(() => {
                    if(iz === 5) {
                        sentidoz = false;
                    } else if (iz === 0) {
                        sentidoz = true;
                    }

                    if(sentidoz) {
                        this.position.z += 5;
                        iz++;
                    } else {
                        this.position.z -= 5;
                        iz--;
                    }
                });

            movimiento.chain(movimiento2);
            movimiento2.chain(movimiento);

            movimiento.start();

            this.empiezaAnimacion = true;
        }
    }

    update() {
        TWEEN.update();

        this.animacion();

        this.cuerpoFlexo.rotateY(0.01);
    }
}

export { flexo };