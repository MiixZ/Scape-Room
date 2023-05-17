// Clases de la biblioteca

import * as THREE from '../libs/three.module.js'
import { GUI } from '../libs/dat.gui.module.js'
import { Stats } from '../libs/stats.module.js'
import { PointerLockControls } from '../libs/PointerLockControls.js';
import * as TWEEN from '../libs/tween.esm.js';


// Clases de nuestro proyecto

import { mesa } from '../mesa/mesa.js'
import { habitacion } from './habitacion.js'
import { Corazon } from '../corazon/Corazon.js'
import { lampara } from './lampara.js'
import { foco } from './foco.js'
import { cama } from './cama.js';
import { MeshPhongMaterial } from "../libs/three.module.js";
import {flexo} from "./flexo.js";
import { Globo } from '../globo/globo.js';


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

        let numParedes = 4;
        for (let i = 1; i <= numParedes; i++) {
            let name = "pared" + i.toString();
            if (i === 3) {
                this.pared3 = this.model.getObjectByName(name);
            }
            let cajaHabitacion = new THREE.Box3().setFromObject(this.model.getObjectByName(name));
            this.candidates.push(cajaHabitacion);
        }

        this.cajaHabitacion = new THREE.Box3().setFromObject(this.model);

        this.pickeableObjects.push(this.model.getObjectByName("puerta").getObjectByName("pomo"));
        this.pickeableObjects.push(this.model.getObjectByName("pared4"));

        this.mesa = new mesa();
        this.mesa.position.x = this.WidthH / 2 - 50;
        this.mesa.scale.z = 1.3;
        this.mesa.jarronMesa.scale.x += 1.3;
        this.mesa.scale.y = 1.2;
        this.add(this.mesa);
        let cajaMesa = new THREE.Box3().setFromObject(this.mesa);
        this.candidates.push(cajaMesa);

        this.corazon = new Corazon();
        this.corazon.position.x = this.WidthH / 2 - 30;
        this.corazon.position.y = this.HeightH / 3.5;
        this.add(this.corazon);
        this.pickeableObjects.push(this.corazon);

        this.lampara = new lampara();
        this.lampara.position.z = this.DepthH / 2 - this.lampara.RadiusBase;
        this.lampara.position.x = this.WidthH / 2 - this.lampara.RadiusBase;
        this.lampara.name = "lampara";
        this.add(this.lampara);
        this.lamparaControl = false;
        let cajaLampara = new THREE.Box3().setFromObject(this.lampara);

        this.candidates.push(cajaLampara);
        this.pickeableObjects.push(this.lampara);

        this.foco = new foco();
        this.foco.position.y = this.HeightH - 50;
        this.foco.position.x = this.WidthH / 2 - 30;
        this.add(this.foco);

        this.cama = new cama();
        this.add(this.cama);

        this.flexo = new flexo();
        this.flexo.position.set(this.WidthH / 2 - 70, this.mesa.jarronMesa.position.y + 13, -100);
        this.add(this.flexo);

        this.createTablon();

        this.globo = new Globo();
        this.globo.position.set(this.WidthH / 2 - 30, 62, 80);
        this.globo.rotateY(-Math.PI/2);

        this.add(this.globo);


        console.log(this.candidates);

        this.createLights();
        this.createBody();
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

    createCamera() {
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
        this.camera.position.set(0, this.cameraHeight, -20);
        this.CameraControl = new PointerLockControls(this.camera, this.renderer.domElement);

        this.xdir = 0; this.zdir = 0;
        this.tiempoI = Date.now(); this.velocidad = 500;

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
        var ambientLight = new THREE.AmbientLight(0xccddee, 0.3);
        // La añadimos a la escena
        this.add(ambientLight);

        // Se crea una luz focal que va a ser la luz principal de la escena
        // La luz focal, además tiene una posición, y un punto de mira
        // Si no se le da punto de mira, apuntará al (0,0,0) en coordenadas del mundo
        // En este caso se declara como   this.atributo   para que sea un atributo accesible desde otros métodos.

        this.lampara1Light = new THREE.SpotLight(0x03FA15, 1);
        this.lampara1Light.position.set(this.WidthH / 2 - this.lampara.RadiusBase, this.lampara.cabeza.position.y,
            this.DepthH / 2 - this.lampara.RadiusBase);
        this.lampara1Light.target = this.lampara;
        this.lampara1Light.penumbra = 1;

        this.spotLight = new THREE.SpotLight(0xffffff, 0.1);
        this.spotLight.position.set(this.WidthH / 2, this.HeightH, this.DepthH / 2);
        this.spotLight.target = this.model.puerta;

        this.spotLight2 = new THREE.SpotLight(0xffffff, 0.05);
        this.spotLight2.position.set(-this.WidthH / 2, this.HeightH, -this.DepthH / 2);
        this.spotLight2.target = this.lampara;

        this.LightMesa = new THREE.SpotLight(0xff0055, 0.6);
        this.LightMesa.position.set(this.foco.position.x, this.foco.position.y, this.foco.position.z);
        this.LightMesa.target = this.mesa;
        this.LightMesa.penumbra = 0.5;

        this.add(this.spotLight, this.LightMesa, this.spotLight2);
    }

    createTablon() {
        var tablonGeometry = new THREE.BoxGeometry(200, 150, 5, 100, 100);
        var texture = new THREE.TextureLoader().load('../imgs/cabecera_8.jpg');
        var tablonMaterial = new MeshPhongMaterial({ map: texture });

        this.tablon = new THREE.Mesh(tablonGeometry, tablonMaterial);
        this.tablon.position.z = -147;
        this.tablon.position.y = 75;
        this.tablon.position.x = -273;
        this.add(this.tablon);
    }

    setLightIntensity(valor) {
        this.spotLight.intensity = valor;
    }

    setAxisVisible(valor) {
        this.axis.visible = valor;
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

    onWindowResize() {
        // Este método es llamado cada vez que el usuario modifica el tamapo de la ventana de la aplicación
        // Hay que actualizar el ratio de aspecto de la cámara
        this.setCameraAspect(window.innerWidth / window.innerHeight);

        // Y también el tamaño del renderizador
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    mover(evento) {
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

            default:
                break;
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

    pick(event) {
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
                this.showAlert("Parece que la puerta está cerrada...");
            } else if (selectedObject.parent.name === "lampara" && distance < 350) {
                this.lamparaControl = !this.lamparaControl;
                this.controlLamp();
            } else if(selectedObject.name === "corazon" && distance < 350) {
                this.globo.animacion()
            }
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
        if (this.lamparaControl) {
            let textureAux = new THREE.TextureLoader().load('../imgs/base_relieve_5.jpg');
            let textureBump = new THREE.TextureLoader().load('../imgs/ladrillo.jpg');

            let newMaterial = new THREE.MeshPhongMaterial({ map: textureAux, bumpMap: textureBump, bumpScale: 1 });
            this.pared3.material = newMaterial;
            this.pared3.geometry.uvsNeedUpdate = true;
            this.add(this.lampara1Light);
        } else {
            let textureAux = new THREE.TextureLoader().load('../imgs/base_relieve.jpg');
            let textureBump = new THREE.TextureLoader().load('../imgs/ladrillo.jpg');

            let newMaterial = new THREE.MeshPhongMaterial({ map: textureAux, bumpMap: textureBump, bumpScale: 1 });
            this.pared3.material = newMaterial;
            this.pared3.geometry.uvsNeedUpdate = true;
            this.remove(this.lampara1Light);
        }

    }

    update() {
        if (this.stats) this.stats.update();
        if (this.cama.box.max.x !== -Infinity && !this.cajaAdd) {
            let cajaCama = new THREE.Box3().setFromObject(this.cama);
            this.candidates.push(cajaCama);
            this.cajaAdd = true;
        }
        // console.log(this.cama.box);
        // Se actualizan los elementos de la escena para cada frame.
        //if(this.cont == this.maxCont){
        this.body.getWorldPosition(this.previousPosition);
        this.cont = 0;
        //}
        this.cont++;
        this.tiempoF = Date.now();
        this.deltaT = (this.tiempoF - this.tiempoI) / 1000;
        this.CameraControl.moveForward(this.zdir * this.velocidad * this.deltaT);
        this.CameraControl.moveRight(this.xdir * this.velocidad * this.deltaT);
        this.tiempoI = this.tiempoF;

        this.model.update();
        this.corazon.update();
        this.flexo.update();

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
    window.addEventListener('click', (event) => scene.pick(event));

    // Que no se nos olvide, la primera visualización.
    scene.update();
});