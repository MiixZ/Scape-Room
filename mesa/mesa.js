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

    constructor(gui, titleGui) {
        super();

        // Se crea la parte de la interfaz que corresponde a la caja
        // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
        this.createGUI(gui,titleGui);

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
        this.jarronMesa = new jarron(gui, titleGui);

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
    createGUI(gui,titleGui) {
        // Controles para el tamaño, la orientación y la posición de la caja
        this.guiControls = {
            sizeX : 1.0,
            sizeY : 1.0,
            sizeZ : 1.0,

            rotX : 0.0,
            rotY : 0.0,
            rotZ : 0.0,

            posX : 0.0,
            posY : 0.0,
            posZ : 0.0,

            c2sizeX : 1.0,
            c2sizeY : 1.0,
            c2sizeZ : 1.0,

            c2rotX : 0.0,
            c2rotY : 0.0,
            c2rotZ : 0.0,

            c2posX : 0.0,
            c2posY : 0.0,
            c2posZ : 0.0,
            // Un botón para dejarlo todo en su posición inicial
            // Cuando se pulse se ejecutará esta función.
            reset : () => {
                this.guiControls.sizeX = 1.0;
                this.guiControls.sizeY = 1.0;
                this.guiControls.sizeZ = 1.0;

                this.guiControls.rotX = 0.0;
                this.guiControls.rotY = 0.0;
                this.guiControls.rotZ = 0.0;

                this.guiControls.posX = 0.0;
                this.guiControls.posY = 0.0;
                this.guiControls.posZ = 0.0;

                this.guiControls.c2sizeX = 1.0;
                this.guiControls.c2sizeY = 1.0;
                this.guiControls.c2sizeZ = 1.0;

                this.guiControls.c2rotX = 0.0;
                this.guiControls.c2rotY = 0.0;
                this.guiControls.c2rotZ = 0.0;

                this.guiControls.c2posX = 0.0;
                this.guiControls.c2posY = 0.0;
                this.guiControls.c2posZ = 0.0;
            }
        }

        // Se crea una sección para los controles de la caja
        var folder = gui.addFolder(titleGui);
        // Estas líneas son las que añaden los componentes de la interfaz
        // Las tres cifras indican un valor mínimo, un máximo y el incremento
        // El método listen() permite que si se cambia el valor de la variable en código, el deslizador de la interfaz se actualice
        folder.add(this.guiControls, 'sizeX', 0.1, 5.0, 0.1).name('Tamaño X : ').listen();
        folder.add(this.guiControls, 'sizeY', 0.1, 5.0, 0.1).name('Tamaño Y : ').listen();
        folder.add(this.guiControls, 'sizeZ', 0.1, 5.0, 0.1).name('Tamaño Z : ').listen();

        folder.add(this.guiControls, 'rotX', 0.0, Math.PI/2, 0.1).name('Rotación X : ').listen();
        folder.add(this.guiControls, 'rotY', 0.0, Math.PI/2, 0.1).name('Rotación Y : ').listen();
        folder.add(this.guiControls, 'rotZ', 0.0, Math.PI/2, 0.1).name('Rotación Z : ').listen();

        folder.add(this.guiControls, 'posX', -20.0, 20.0, 0.1).name('Posición X : ').listen();
        folder.add(this.guiControls, 'posY', 0.0, 10.0, 0.1).name('Posición Y : ').listen();
        folder.add(this.guiControls, 'posZ', -20.0, 20.0, 0.1).name('Posición Z : ').listen();

        // -------------------------CILINDRO 2-------------------------------------
        var cilindro2folder = folder.addFolder("Cilindro 2");
        cilindro2folder.add(this.guiControls, 'c2sizeX', 0.1, 5.0, 0.1).name('Tamaño X : ').listen();
        cilindro2folder.add(this.guiControls, 'c2sizeY', 0.1, 5.0, 0.1).name('Tamaño Y : ').listen();
        cilindro2folder.add(this.guiControls, 'c2sizeZ', 0.1, 5.0, 0.1).name('Tamaño Z : ').listen();

        cilindro2folder.add(this.guiControls, 'c2rotX', 0.0, Math.PI/2, 0.1).name('Rotación X : ').listen();
        cilindro2folder.add(this.guiControls, 'c2rotY', 0.0, Math.PI/2, 0.1).name('Rotación Y : ').listen();
        cilindro2folder.add(this.guiControls, 'c2rotZ', 0.0, Math.PI/2, 0.1).name('Rotación Z : ').listen();

        cilindro2folder.add(this.guiControls, 'c2posX', -20.0, 20.0, 0.1).name('Posición X : ').listen();
        cilindro2folder.add(this.guiControls, 'c2posY', 0.0, 10.0, 0.1).name('Posición Y : ').listen();
        cilindro2folder.add(this.guiControls, 'c2posZ', -20.0, 20.0, 0.1).name('Posición Z : ').listen();

        folder.add(this.guiControls, 'reset').name('[ Reset ]');
    }

    update () {
        // Con independencia de cómo se escriban las 3 siguientes líneas, el orden en el que se aplican las transformaciones es:
        // Primero, el escalado
        // Segundo, la rotación en Z
        // Después, la rotación en Y
        // Luego, la rotación en X
        // Y por último la traslación

        this.position.set(this.guiControls.posX,this.guiControls.posY,this.guiControls.posZ);
        this.rotation.set(this.guiControls.rotX,this.guiControls.rotY,this.guiControls.rotZ);
        this.scale.set(this.guiControls.sizeX,this.guiControls.sizeY,this.guiControls.sizeZ);

        this.pata2.position.set(this.guiControls.c2posX + 2,
                                    this.guiControls.c2posY + 2,
                                    this.guiControls.c2posZ + 2); // +2 porque es la posición inicial.

        this.pata2.rotation.set(this.guiControls.c2rotX,
                                    this.guiControls.c2rotY,
                                    this.guiControls.c2rotZ);

        this.pata2.scale.set(this.guiControls.c2sizeX,
                                 this.guiControls.c2sizeY,
                                 this.guiControls.c2sizeZ);
    }
}

export { mesa };
