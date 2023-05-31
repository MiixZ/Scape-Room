// Clases de la biblioteca

import * as THREE from './libs/three.module.js'
import {MeshPhongMaterial} from './libs/three.module.js'
import {Stats} from './libs/stats.module.js'
import {PointerLockControls} from './libs/PointerLockControls.js';
import * as TWEEN from './libs/tween.esm.js';


// Clases de nuestro proyecto
import {mesa} from './objects/mesa.js'
import {habitacion} from './objects/habitacion.js'
import {lampara} from './objects/lampara.js'
import {foco} from './objects/foco.js'
import {cama} from './objects/cama.js';
import {flexo} from "./objects/flexo.js";
import {Globo} from './objects/globo.js';
import {lamparastecho} from "./objects/lampara_techo.js";
import {caja} from "./objects/caja.js";
import {sillon} from "./objects/sillon.js";
import {linterna} from "./objects/linterna.js";
import {cuadro} from "./objects/cuadro.js";

/// La clase fachada del modelo
/**
 * Usaremos una clase derivada de la clase Scene de Three.js para llevar el control de la escena y de todo lo que ocurre en ella.
 */

class MyScene extends THREE.Scene {
    WidthH = 750;
    HeightH = 350;
    DepthH = 1500;
    cameraHeight = 150;
    maxCont = 1;

    doorUnlocked = false;
    panelClave = false;
    afterPanel = false;
    cajaPuertaAdd = false;
    sillonAdd = false;

    constructor(myCanvas) {
        super();
        this.pickeableObjects = [];
        this.previousPosition = new THREE.Vector3();
        this.cont = this.maxCont;
        this.cajaAdd = false;

        // Lo primero, crear el visualizador, pasándole el lienzo sobre el que realizar los renderizados.
        this.renderer = this.createRenderer(myCanvas);

        this.initStats();

        // Tendremos una cámara con un control de movimiento con el ratón.
        this.createCamera();

        // Y unos ejes. Imprescindibles para orientarnos sobre dónde están las cosas
        this.axis = new THREE.AxesHelper(5);
        this.add(this.axis);

        // Creamos los objetos

        this.candidates = [];
        this.model = new habitacion();
        this.add(this.model);
        this.pickeableObjects.push(this.model.candado);

        let numParedes = 6;
        for (let i = 1; i <= numParedes; i++) {
            let name = "pared" + i.toString();
            if (i === 3) {
                this.pared3 = this.model.getObjectByName(name);
            }
            let cajaHabitacion = new THREE.Box3().setFromObject(this.model.getObjectByName(name));
            this.candidates.push(cajaHabitacion);
        }

        this.animateLinterna = 1;
        this.animacionCaja = true;
        this.animacionJarron = true;
        this.animacionGlobo = true;

        this.pickeableObjects.push(this.model.getObjectByName("puerta").getObjectByName("pomo"));
        this.pickeableObjects.push(this.model.getObjectByName("pared4"));

        this.mesa = new mesa();
        this.mesa.name = "mesa";
        this.mesa.position.x = this.WidthH / 2 - 50;

        this.mesa.jarronMesa.position.z = 0;
        this.mesa.jarronMesa.position.x = 10;
        this.pickeableObjects.push(this.mesa.jarronMesa);
        this.add(this.mesa);
        let cajaMesa = new THREE.Box3().setFromObject(this.mesa);
        this.candidates.push(cajaMesa);

        this.pickeableObjects.push(this.mesa.jarronMesa.corazon);

        this.lampara = new lampara();
        this.lampara.position.z = this.DepthH / 2 - this.lampara.RadiusBase;
        this.lampara.position.x = this.WidthH / 2 - this.lampara.RadiusBase;
        this.lampara.name = "lampara";
        this.add(this.lampara);
        this.lamparaControl = false;
        let cajaLampara = new THREE.Box3().setFromObject(this.lampara);

        this.candidates.push(cajaLampara);
        this.pickeableObjects.push(this.lampara);

        this.lampara2 = new lampara();
        this.lampara2.position.z = -this.DepthH / 2 + this.lampara2.RadiusBase;
        this.lampara2.position.x = -this.WidthH / 2 + this.lampara2.RadiusBase;
        this.lampara2.name = "lampara2";
        this.add(this.lampara2);
        this.lampara2Control = false;
        let cajaLampara2 = new THREE.Box3().setFromObject(this.lampara2);

        this.candidates.push(cajaLampara2);
        this.pickeableObjects.push(this.lampara2);

        this.lampara3 = new lampara();
        this.lampara3.position.z = -this.DepthH / 2 + this.lampara3.RadiusBase;
        this.lampara3.position.x = this.WidthH / 2 - this.lampara3.RadiusBase;
        this.lampara3.name = "lampara3";
        this.add(this.lampara3);
        let cajaLampara3 = new THREE.Box3().setFromObject(this.lampara3);

        this.candidates.push(cajaLampara3);

        this.foco = new foco();
        this.foco.position.y = this.HeightH - 50;
        this.foco.position.x = this.WidthH / 2 - 30;
        this.add(this.foco);

        this.sillon = new sillon();
        this.sillon.position.set(this.WidthH / 2 - 60, 0, -this.DepthH / 2 + 30);
        this.sillon.rotateY(-Math.PI / 4);
        this.add(this.sillon);

        this.linterna = new linterna();
        this.linterna.position.set(this.sillon.position.x - 45, this.sillon.position.y + 75, this.sillon.position.z + 75);
        this.linterna.rotateX(Math.PI);
        this.linternaControl = true;
        this.pickeableObjects.push(this.linterna);
        this.add(this.linterna);

        this.cama = new cama();
        this.add(this.cama);

        this.cuadro = new cuadro();
        this.cuadro.name = "cuadro";
        this.pickeableObjects.push(this.cuadro);
        this.cuadro.position.set(0, this.HeightH / 2, this.DepthH / 2 - 5);
        this.add(this.cuadro);

        this.flexo = new flexo();
        this.flexo.position.set(this.WidthH / 2 - 70, this.mesa.mesaHeight + 1, -100);
        this.add(this.flexo);

        this.globo = new Globo();
        this.globo.position.set(this.WidthH / 2 - 30, 62, 80);
        this.globo.rotateY(-Math.PI / 2);
        this.add(this.globo);

        this.lamparastecho = new lamparastecho();
        this.lamparastecho.lampara1.position.y = this.HeightH - 30;
        this.lamparastecho.lampara2.position.y = this.HeightH - 30;
        this.add(this.lamparastecho);

        this.createCajas();

        this.createLights();
        this.createBody();
        this.createGround();

        let cajaPuerta = new THREE.Box3().setFromObject(this.model.getObjectByName("puerta"));
        this.candidates.push(cajaPuerta);
        this.indexCajaPuerta = this.candidates.length-1
    }

    initStats() {
        var stats = new Stats();

        stats.setMode(0); // 0: fps, 1: ms

        // Align top-left
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';

        $("#Stats-output").append(stats.domElement);

        this.stats = stats;
    }

    createCajas() {
        this.caja = new caja();
        this.caja.position.set(-this.WidthH / 2 + 100, 95, 0);
        this.caja.name = "caja1";
        this.pickeableObjects.push(this.caja);
        this.add(this.caja);            // Caja de la cama.

        this.caja2 = new caja();
        this.caja2.scale.set(2, 2, 2);
        this.caja2.position.set(-this.WidthH / 2 + 100, 50, -200);
        this.caja2.name = "caja";
        this.pickeableObjects.push(this.caja2);
        this.add(this.caja2);           // Caja que tapa el número


        this.caja3 = new caja();
        this.caja3.position.set(-this.lampara.position.x, 25, this.lampara.position.z);
        let cajaCaja3 = new THREE.Box3().setFromObject(this.caja3);
        this.caja3.name = "caja3";
        this.pickeableObjects.push(this.caja3);
        this.candidates.push(cajaCaja3);
        this.add(this.caja3); // Caja random.
    }

    createCamera() {
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 5000);
        this.camera.position.set(0, this.cameraHeight, 0);
        this.CameraControl = new PointerLockControls(this.camera, this.renderer.domElement);

        this.xdir = 0;
        this.zdir = 0;
        this.tiempoI = Date.now();
        this.velocidad = 500;

        this.add(this.camera);
    }

    createBody() {
        let bodyH = this.cameraHeight + 20;
        let boxGeometry = new THREE.BoxGeometry(30, bodyH, 60);
        boxGeometry.translate(0, bodyH / 2, 0);
        let boxMaterial = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            opacity: 0,
            transparent: true
        })
        boxMaterial.transparent = true;
        this.body = new THREE.Mesh(boxGeometry, boxMaterial);
        this.body.position.set(-300, 0, -20);

        this.add(this.body);
    }

    changeBodyPosition() {
        let cameraPosition = new THREE.Vector3();
        this.camera.getWorldPosition(cameraPosition);
        this.body.position.set(cameraPosition.x, this.body.position.y, cameraPosition.z)// nunca cambiamos la posición y
    }

    checkColisiones() {
        let cajaBody = new THREE.Box3().setFromObject(this.body);
        this.collision = false;
        for (let i = 0; i < this.candidates.length; i++) {
            let candidate = this.candidates[i];
            if (cajaBody.intersectsBox(candidate)) {
                this.handleDefaultCollision();
                break;
            }
        }
    }

    handleDefaultCollision() {
        let direction = new THREE.Vector3(); // Vector de dirección del objeto
        let position = new THREE.Vector3();
        this.camera.getWorldPosition(position);

        direction.subVectors(position, this.previousPosition); //obtenemos la dirección restandole a la posición actual, la posición anterior
        let inverseDirection = direction.clone().multiplyScalar(-6);

        this.camera.position.set(position.x + inverseDirection.x, position.y, position.z + inverseDirection.z);

    }

    createLights() {
        // Se crea una luz ambiental, evita que se vean completamente negras las zonas donde no incide de manera directa una fuente de luz
        // La luz ambiental solo tiene un color y una intensidad
        // Se declara como var y va a ser una variable local a este método
        //    se hace así puesto que no va a ser accedida desde otros métodos
        this.ambientLight = new THREE.AmbientLight(0xccddee, 0);
        // La añadimos a la escena
        this.add(this.ambientLight);

        // Se crea una luz focal que va a ser la luz principal de la escena
        // La luz focal, además tiene una posición, y un punto de mira
        // Si no se le da punto de mira, apuntará al (0,0,0) en coordenadas del mundo
        // En este caso se declara como   this.atributo   para que sea un atributo accesible desde otros métodos.

        this.lampara1Light = new THREE.SpotLight(0x03FA15, 1);
        this.lampara1Light.position.set(this.WidthH / 2 - this.lampara.RadiusBase, this.lampara.cabeza.position.y,
                                    this.DepthH / 2 - this.lampara.RadiusBase);
        this.lampara1Light.target = this.lampara;
        this.lampara1Light.penumbra = 1;

        this.lampara2Light = new THREE.SpotLight(0x03FA15, 1);
        this.lampara2Light.position.set(this.lampara2.position.x, this.lampara2.cabeza.position.y,
                                        this.lampara2.position.z);
        this.lampara2Light.target = this.lampara2;
        this.lampara2Light.penumbra = 1;

        this.lampara3Light = new THREE.SpotLight(0x03FA15, 1);
        this.lampara3Light.position.set(this.lampara3.position.x, this.lampara3.cabeza.position.y,
            this.lampara3.position.z);
        this.lampara3Light.target = this.lampara3;
        this.lampara3Light.penumbra = 1;

        this.add(this.lampara3Light);

        this.LightMesa = new THREE.SpotLight(0xff0055, 0.6);
        this.LightMesa.position.set(this.foco.position.x, this.foco.position.y, this.foco.position.z);
        this.LightMesa.target = this.mesa;
        this.LightMesa.penumbra = 0.5;

        this.LightLinterna = new THREE.SpotLight(0xffffff, 1);
        this.LightLinterna.position.set(this.linterna.position.x, this.linterna.position.y + 100, this.linterna.position.z);
        this.LightLinterna.target = this.linterna;
        this.LightLinterna.penumbra = 1;
        this.LightLinterna.angle = Math.PI / 4;
        this.add(this.LightLinterna);

        this.add(this.LightMesa);
    }

    activateLights() {
        this.camera.add(this.linterna);
        this.linterna.position.set(15, -15, -30);
        this.linterna.rotation.set(Math.PI, 0, 0);
        this.remove(this.LightLinterna);

        this.Luzlinterna = new THREE.SpotLight(0xffffff, 0.2);
        this.Luzlinterna.position.set(this.linterna.position.x, this.linterna.position.y, this.linterna.position.z + 200);
        this.Luzlinterna.target = this.linterna;
        this.Luzlinterna.angle = Math.PI / 15;
        this.camera.add(this.Luzlinterna);
    }

    createRenderer(myCanvas) {
        // Se recibe el lienzo sobre el que se van a hacer los renderizados. Un div definido en el html.

        // Se instancia un Renderer   WebGL
        var renderer = new THREE.WebGLRenderer();

        // Se establece un color de fondo en las imágenes que genera el render
        renderer.setClearColor(new THREE.Color(0xEEEEEE), 1.0);

        // Se establece el tamaño, se aprovecha la totalidad de la ventana del navegador
        renderer.setSize(window.innerWidth, window.innerHeight);

        // La visualización se muestra en el lienzo recibido
        $(myCanvas).append(renderer.domElement);

        return renderer;
    }

    createGround (){
        // El suelo es un Mesh, necesita una geometría y un material.

        // La geometría es una caja con muy poca altura
        var geometryGround = new THREE.BoxGeometry (10000,0.2,10000);

        // El material se hará con una textura de madera
        var texture = new THREE.TextureLoader().load('./imgs/cesped.jpg');
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(100, 100);
        var materialGround = new THREE.MeshPhongMaterial ({map: texture});

        // Ya se puede construir el Mesh
        var ground = new THREE.Mesh (geometryGround, materialGround);
        var ground2 = new THREE.Mesh (geometryGround, materialGround);
        var ground3 = new THREE.Mesh (geometryGround, materialGround);

        // Todas las figuras se crean centradas en el origen.
        // El suelo lo bajamos la mitad de su altura para que el origen del mundo se quede en su lado superior
        ground.position.set(0, -0.1, -this.DepthH / 2 - 5005);
        ground2.position.set(this.WidthH / 2 + 5000, -0.1, 4245);
        ground3.position.set(-this.WidthH / 2 - 5000, -0.1, 4245);

        // Que no se nos olvide añadirlo a la escena, que en este caso es  this
        this.add (ground, ground2, ground3);
    }

    getCamera() {
        // En principio se devuelve la única cámara que tenemos
        // Si hubiera varias cámaras, este método decidiría qué cámara devuelve cada vez que es consultado
        return this.camera;
    }

    setCameraAspect(ratio) {
        // Cada vez que el usuario modifica el tamaño de la ventana desde el gestor de ventanas de
        // su sistema operativo hay que actualizar el ratio de aspecto de la cámara
        this.camera.aspect = ratio;
        // Y si se cambia ese dato hay que actualizar la matriz de proyección de la cámara
        this.camera.updateProjectionMatrix();
    }

    animarLinterna () {
        this.linterna.rotation.y += 0.01;
        this.linterna.rotation.x += 0.01;
    }

    onWindowResize() {
        // Este método es llamado cada vez que el usuario modifica el tamapo de la ventana de la aplicación
        // Hay que actualizar el ratio de aspecto de la cámara
        this.setCameraAspect(window.innerWidth / window.innerHeight);

        // Y también el tamaño del renderizador
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    unlockCamera() {
        this.CameraControl.unlock();
    }

    lockCamera() {
        this.CameraControl.lock();
    }

    mover(evento) {
        if (!this.panelClave) {
            switch (evento.key) {
                case 'w':
                    this.zdir = 1;
                    break;

                case 's':
                    this.zdir = -1;
                    break;

                case 'a':
                    this.xdir = -1;
                    break;

                case 'd':
                    this.xdir = 1;
                    break;

                case 'Enter':
                    this.CameraControl.lock();
                    break;

                case 'q':
                    this.controlLantern();
                    break;

                default:
                    break;
            }
        }
    }

    parar(evento) {
        switch (evento.key) {
            case 'w':
            case 's':
                this.zdir = 0;
                break;

            case 'a':
            case 'd':
                this.xdir = 0;
                break;

            default:
                break;
        }
    }

    pick() {
        if(!this.panelClave && !this.afterPanel){

            let ray = new THREE.Raycaster();
            let center = new THREE.Vector2();
            // Calcula las coordenadas del centro
            center.x = window.innerWidth / 2;
            center.y = window.innerHeight / 2;

            // Normaliza las coordenadas al rango [-1, 1]
            center.x = (center.x / window.innerWidth) * 2 - 1;
            center.y = 1 - (center.y / window.innerHeight) * 2;

            ray.setFromCamera(center, this.camera);

            let pickedObjects = ray.intersectObjects(this.pickeableObjects, true);

            if (pickedObjects.length > 0) {
                let selectedObject = pickedObjects[0].object;
                //let selectedPoint = pickedObjects[0].point;
                let distance = pickedObjects[0].distance;
                if (selectedObject.name === "pomo" && distance < 350) {
                    if(!this.doorUnlocked) {
                        this.showAlert("Parece que la puerta está cerrada...");
                    } else {
                        this.model.animacionAbrir();
                        this.ambientLight.intensity = 0.5;
                        this.showAlert("La puerta se está abriendo");
                    }
                } else if (selectedObject.name === "candado" && distance < 350 && !this.doorUnlocked) {
                    this.panelClave = true;
                    this.showAlert("Me pregunto cual será la combinación, quiero salir de aquí");
                    this.mostrarContenedorClave();
                } else if (selectedObject.parent.name === "lampara" && distance < 350) {
                    this.lamparaControl = !this.lamparaControl;
                    this.controlLamp();
                } else if (selectedObject.name === "jarron" && distance < 350) {
                    if(this.animacionJarron && !this.linternaControl) {
                        this.mesa.jarronMesa.animacionCorazon();
                        this.animacionJarron = false;
                    }
                } else if (selectedObject.name === "corazon" && distance < 350) {
                    if(this.animacionGlobo && !this.linternaControl) {
                        this.globo.animacion();
                        this.mesa.jarronMesa.explotaCorazon();
                        this.animacionGlobo = false;
                    }
                } else if (selectedObject.parent.name === "caja" && distance < 350) {
                    if (this.animacionCaja) {
                        this.caja2.luminosidadCaja();
                        this.animacionCaja = false;
                    }
                } else if (selectedObject.parent.name === "lampara2" && distance < 350) {
                    this.lampara2Control = !this.lampara2Control;

                    if (this.lampara2Control) {
                        this.add(this.lampara2Light);
                    } else {
                        this.remove(this.lampara2Light);
                    }
                } else if (selectedObject.name === "Lanterna_Cylinder") {
                    this.activateLights();
                    this.remove(this.linterna);
                    this.animateLinterna = 0;
                    // La lámpara de la mesa cambia a color marrón.
                    this.LightMesa.color = new THREE.Color(0.2, 0.5, 0.2);
                    this.showAlert("¿Que pasará si pulso la \"Q\"?")
                } else if ((selectedObject.parent.name === "caja1" || selectedObject.parent.name === "caja3") && distance < 350) {
                    this.showAlert("Esta caja no se abre, pero parece muy real...");
                } else if (selectedObject.parent.parent.name === "cuadro") {
                    this.cuadro.video.play();
                    this.cuadro.video.volume = 0.1;
                }
            }
        } else if(this.afterPanel) {
            this.afterPanel = false;
        }
    }


    async showAlert(message) {
        let alert = document.getElementById("alert");
        alert.style.display = "flex";
        alert.textContent = message;

        setTimeout(() => {
            alert.style.display = "none";
            alert.textContent = "";
        }, 2000);
    }

    controlLamp() {
        if(this.lamparaControl) {
            let textureAux = new THREE.TextureLoader().load('./imgs/base_relieve_5.jpg');
            let textureBump = new THREE.TextureLoader().load('./imgs/ladrillo.jpg');

            this.pared3.material = new THREE.MeshPhongMaterial({map: textureAux, bumpMap: textureBump, bumpScale: 1});
            this.pared3.geometry.uvsNeedUpdate = true;
            this.add(this.lampara1Light);
        } else {
            let textureAux = new THREE.TextureLoader().load('./imgs/base_relieve.jpg');
            let textureBump = new THREE.TextureLoader().load('./imgs/ladrillo.jpg');

            this.pared3.material = new THREE.MeshPhongMaterial({map: textureAux, bumpMap: textureBump, bumpScale: 1});
            this.pared3.geometry.uvsNeedUpdate = true;
            this.remove(this.lampara1Light);
        }
    }

    controlLantern() {
        if(this.animateLinterna === 0){
            if(this.linternaControl) {
                this.camera.remove(this.Luzlinterna);
                this.linternaControl = !this.linternaControl;
                // La luz de la mesa vuelve a ser roja.
                this.LightMesa.color = new THREE.Color(0xff0055);
            } else {
                this.camera.add(this.Luzlinterna);
                this.linternaControl = !this.linternaControl;
                // La luz de la mesa vuelve a ser marrón.
                this.LightMesa.color = new THREE.Color(0.2, 0.5, 0.2);
            }
        }
    }

    comprobarClave() {
        let num1 = document.getElementById("num1").value;
        let num2 = document.getElementById("num2").value;
        let num3 = document.getElementById("num3").value;


        if (num1 === '5' && num2 === '8' && num3 === '0') {
            this.doorUnlocked = true;
            this.showAlert("He encontrado la clave correcta");
            this.model.deleteCandado = true;
        } else {
            this.showAlert("Parece que la clave no es correcta...");
        }
        document.getElementById("contenedor").style.display = "none";
        document.getElementById("puntero").style.display = "flex";
        this.panelClave = false;
        this.afterPanel = true;
        this.lockCamera();
    }

    mostrarContenedorClave() {
        this.panelClave = true;
        this.unlockCamera();
        document.getElementById("contenedor").style.display = "flex";
        document.getElementById("puntero").style.display = "none";
        document.getElementById("num1").value = "";
        document.getElementById("num2").value = "";
        document.getElementById("num3").value = "";
    }

    update() {
        if (this.stats) this.stats.update();
        if (this.cama.box.max.x !== -Infinity && !this.cajaAdd) {
            let cajaCama = new THREE.Box3().setFromObject(this.cama);
            this.candidates.push(cajaCama);
            this.cajaAdd = true;
        }
        if (this.sillon.box.max.x !== -Infinity && !this.sillonAdd) {
            let cajaSillon = new THREE.Box3().setFromObject(this.sillon);
            this.candidates.push(cajaSillon);
            this.sillonAdd = true;
            console.log("")
        }
        if (this.model.cajaPuerta.max.x !== -Infinity && this.cajaPuertaAdd === false) {
            this.candidates.splice(this.indexCajaPuerta,1);
            this.cajaPuertaAdd = true;
            let cajaPuerta = new THREE.Box3().setFromObject(this.model.getObjectByName("puerta"));
            this.candidates.push(cajaPuerta);
        }

        this.body.getWorldPosition(this.previousPosition);
        this.cont = 0;
        this.cont++;
        this.tiempoF = Date.now();
        this.deltaT = (this.tiempoF - this.tiempoI) / 1000;
        this.CameraControl.moveForward(this.zdir * this.velocidad * this.deltaT);
        this.CameraControl.moveRight(this.xdir * this.velocidad * this.deltaT);
        this.tiempoI = this.tiempoF;

        if(this.animateLinterna === 1) {
            this.animarLinterna();
        }

        this.model.update();
        this.flexo.update();
        this.mesa.update();
        this.lamparastecho.update();

        this.changeBodyPosition();
        this.checkColisiones();

        // Se actualiza el resto del modelo.

        // Le decimos al renderizador "visualiza la escena que te indico usando la cámara que te estoy pasando"
        this.renderer.render(this, this.getCamera());

        // Este método debe ser llamado cada vez que queramos visualizar la escena de nuevo.
        // Literalmente le decimos al navegador: "La próxima vez que haya que refrescar la pantalla, llama al método que te indico".
        // Si no existiera esta línea,  update()  se ejecutaría solo la primera vez.
        requestAnimationFrame(() => this.update());
        TWEEN.update();
    }
}

/// La función main.
$(function () {
    // Se instancia la escena pasándole el  div  que se ha creado en el html para visualizar
    var scene = new MyScene("#WebGL-output");

    // Se añaden los listener de la aplicación. En este caso, el que va a comprobar cuándo se modifica el tamaño de la ventana de la aplicación.
    window.addEventListener("resize", () => scene.onWindowResize());
    window.addEventListener('keydown', (event) => scene.mover(event));
    window.addEventListener('keyup', (event) => scene.parar(event));
    window.addEventListener('click', (event) => scene.pick());
    const boton = document.getElementById("button");
    boton.addEventListener('click', () => scene.comprobarClave());

    // Que no se nos olvide, la primera visualización.
    scene.update();
});
