
import * as THREE from '../libs/three.module.js'

class Corazon extends THREE.Object3D {
  constructor() {
    super();

    let shape = this.crearForma();
    this.points = this.vector2dTo3d(shape.getPoints());

    let extrudeOptions = {
      depth: 1,
      bevelEnabled: true
    }

    this.material = new THREE.MeshPhongMaterial({ color: 0xFF0000 });

    // var lineGeometry = new THREE.BufferGeometry();
    // lineGeometry.setFromPoints(this.points);
    // let line = new THREE.Line(lineGeometry, this.material);
    let hearthGeometry = new THREE.ExtrudeGeometry(shape, extrudeOptions);
    this.hearth = new THREE.Mesh(hearthGeometry, this.material);
    this.hearth.position.y = -8;
    this.hearth.name = "corazon";
    //this.hearth.scale.set(0.7,0.7,0.7);

    this.add(this.hearth);
  }

  crearForma() {
    let shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(10, 6, 10, 14, 4, 16);
    shape.quadraticCurveTo(2, 16, 0, 12);
    shape.quadraticCurveTo(-2, 16, -4, 16);
    shape.bezierCurveTo(-10, 14, -10, 6, 0, 0);
    shape.closePath();
    return shape;
  }

  vector2dTo3d(vector2d) {
    let points = [];
    for (let i = 0; i < vector2d.length; i++) {
      points.push(new THREE.Vector3(vector2d[i].x, vector2d[i].y, 0));
    }
    return points;
  }


  update() {
    this.rotation.y += 0.025;
  }
}

export { Corazon }
