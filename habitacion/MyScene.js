// Clases de la biblioteca

import * as THREE from '../libs/three.module.js'
import { GUI } from '../libs/dat.gui.module.js'
import { Stats } from '../libs/stats.module.js'
import { FirstPersonControls } from '../libs/FirstPersonControls.js';
import { PointerLockControls } from '../libs/PointerLockControls.js';


// Clases de mi proyecto

import { mesa } from '../mesa/mesa.js'
import { habitacion } from './habitacion.js'
import { Corazon } from '../corazon/Corazon.js'
import { lampara } from './lampara.js'


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
        this.previousPosition = new THREE.Vector3();
        this.cont = this.maxCont;

        // Lo primero, crear el visualizador, pasándole el lienzo sobre el que realizar los renderizados.
        this.renderer = this.createRenderer(myCanvas);

        // Se añade a la gui los controles para manipular los elementos de esta clase
        this.gui = this.createGUI();

        this.initStats();

        // Construimos los distintos elementos que tendremos en la escena

        // Todo elemento que se desee sea tenido en cuenta en el renderizado de la escena debe pertenecer a esta.
        //  Bien como hijo de la escena (this en esta clase) o como hijo de un elemento que ya esté en la escena.
        // Tras crear cada elemento se añadirá a la escena con   this.add(variable)


        // Tendremos una cámara con un control de movimiento con el ratón.
        this.createCamera();

        // Un suelo
        // this.createGround ();

        // Y unos ejes. Imprescindibles para orientarnos sobre dónde están las cosas
        this.axis = new THREE.AxesHelper(5);
        this.add(this.axis);

        // Por último creamos el modelo.
        // El modelo puede incluir su parte de la interfaz gráfica de usuario. Le pasamos la referencia a
        // la gui y el texto bajo el que se agruparán los controles de la interfaz que añada el modelo.
        this.candidates = [];
        this.model = new habitacion();
        // this.model.scale.y = 1.3;
        this.add(this.model);
        let numParedes = 4;
        for (let i = 1; i <= numParedes; i++) {
            let name = "pared" + i.toString();
            let cajaHabitacion = new THREE.Box3().setFromObject(this.model.getObjectByName(name));
            this.candidates.push(cajaHabitacion);
        }

        this.cajaHabitacion = new THREE.Box3().setFromObject(this.model);

        console.log(this.model);
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

        this.lampara = new lampara();
        this.lampara.position.z = this.DepthH / 2 - this.lampara.RadiusBase;
        this.lampara.position.x = this.WidthH / 2 - this.lampara.RadiusBase;
        this.add(this.lampara);
        let cajaLampara = new THREE.Box3().setFromObject(this.lampara);

        this.candidates.push(cajaLampara);

        this.createLights();
        this.createBody();
        console.log(this.candidates);
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
        this.camera.position.set(-300, this.cameraHeight, -20);
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
                console.log("colisiona");
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

    createGUI() {
        // Se crea la interfaz gráfica de usuario
        var gui = new GUI();

        // La escena le va a añadir sus propios controles.
        // Se definen mediante un objeto de control
        // En este caso la intensidad de la luz y si se muestran o no los ejes
        this.guiControls = {
            // En el contexto de una función   this   alude a la función
            lightIntensity: 0.5,
            axisOnOff: true
        }

        // Se crea una sección para los controles de esta clase
        var folder = gui.addFolder('Luz y Ejes');

        // Se le añade un control para la intensidad de la luz
        folder.add(this.guiControls, 'lightIntensity', 0, 1, 0.1)
            .name('Intensidad de la Luz: ')
            .onChange((value) => this.setLightIntensity(value));

        // Y otro para mostrar u ocultar los ejes
        folder.add(this.guiControls, 'axisOnOff')
            .name('Mostrar ejes : ')
            .onChange((value) => this.setAxisVisible(value));

        return gui;
    }

    createLights() {
        // Se crea una luz ambiental, evita que se vean completamente negras las zonas donde no incide de manera directa una fuente de luz
        // La luz ambiental solo tiene un color y una intensidad
        // Se declara como var y va a ser una variable local a este método
        //    se hace así puesto que no va a ser accedida desde otros métodos
        var ambientLight = new THREE.AmbientLight(0xccddee, 0.15);
        // La añadimos a la escena
        this.add(ambientLight);

        // Se crea una luz focal que va a ser la luz principal de la escena
        // La luz focal, además tiene una posición, y un punto de mira
        // Si no se le da punto de mira, apuntará al (0,0,0) en coordenadas del mundo
        // En este caso se declara como   this.atributo   para que sea un atributo accesible desde otros métodos.
        this.lampara1Light = new THREE.SpotLight(0x03FA15, 0.6);
        this.lampara1Light.position.set(this.WidthH / 2 - this.lampara.RadiusBase, this.lampara.cabeza.position.y, this.DepthH / 2 - this.lampara.RadiusBase);
        this.lampara1Light.target = this.lampara;
        this.lampara1Light.penumbra = 1;

        this.spotLight = new THREE.SpotLight(0xffffff, 0.1);
        this.spotLight.position.set(this.WidthH, this.HeightH, 0);

        this.add(this.spotLight, this.lampara1Light);
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

    update() {
        if (this.stats) this.stats.update();

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
        
        this.changeBodyPosition();
        this.checkColisiones();

        // Se actualiza el resto del modelo.

        // Le decimos al renderizador "visualiza la escena que te indico usando la cámara que te estoy pasando"
        this.renderer.render(this, this.getCamera());

        // Este método debe ser llamado cada vez que queramos visualizar la escena de nuevo.
        // Literalmente le decimos al navegador: "La próxima vez que haya que refrescar la pantalla, llama al método que te indico".
        // Si no existiera esta línea,  update()  se ejecutaría solo la primera vez.
        requestAnimationFrame(() => this.update());
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

    // Que no se nos olvide, la primera visualización.
    scene.update();
});