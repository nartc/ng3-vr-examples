import { Component } from "@angular/core";

import { NgtTriple } from "@angular-three/core";

import GUI from "lil-gui";

import { CameraService } from "../../app/camera.service";

import { TwoArmSpiroComponent } from "./two-arm-spiro/two-arm-spiro.component";

import { Exporter } from "./export";
import { Mesh } from "three";

@Component({
  templateUrl: './spirograph.component.html'
})
export class SpirographExample {
  position = [0.5, 1.5, -1] as NgtTriple;

  twoarm!: TwoArmSpiroComponent;
  filename = 'model';

  constructor(
    private cameraService: CameraService,
  ) {
    this.cameraService.position = [0, 1.5, 1];
    this.cameraService.lookAt = [0, 1.5, 0];
    this.cameraService.fov = 45;
  }

  public gui!: GUI;
  public meshes: Array<Mesh> = [];

  private _changex = 1;
  get changex(): number { return this._changex }
  set changex(newvalue: number) {
    this._changex = newvalue;
    this.twoarm.changex = newvalue == 1;
  }

  private _changey = 0;
  get changey(): number { return this._changey }
  set changey(newvalue: number) {
    this._changey = newvalue;
    this.twoarm.changey = newvalue == 1;
  }

  private _changez = 1;
  get changez(): number { return this._changez }
  set changez(newvalue: number) {
    this._changez = newvalue;
    this.twoarm.changez = newvalue == 1;
  }

  private _animate = 1;
  get animate(): number { return this._animate }
  set animate(newvalue: number) {
    this._animate = newvalue;
    this.twoarm.animate = newvalue == 1;
    if (!this.twoarm.animate)
      this.twoarm.tubemesh.instance.value.rotation.y = 0;
  }

  private count = 0;
  saveobj() {
    const save = new Exporter()
    save.exportOBJ(this.twoarm.tubemesh.inst, this.filename + this.count);
    this.count++;
  }
  saveglft() {
    const save = new Exporter()
    save.exportGLTF(this.twoarm.tubemesh.inst, this.filename + this.count);
    this.count++;
  }
  saveply() {
    const save = new Exporter()
    save.exportPLY(this.twoarm.tubemesh.inst, this.filename + this.count);
    this.count++;
  }

  ready(twoarm: TwoArmSpiroComponent): void {
    this.twoarm = twoarm;

    const gui = new GUI({ width: 300 }).title('Draw Settings');
    gui.add(this, 'saveobj').name('Save to OBJ');
    gui.add(this, 'saveply').name('Save to PLY');
    //gui.add(this, 'savegltf').name('Save to GLFT');
    gui.add(this.twoarm, 'radius', 0.001, 0.02, 0.001).name('Tube Radius');
    gui.add(this.twoarm, 'arm1length', 0.1, 1.0, 0.1).name('Arm 1 Length');
    gui.add(this.twoarm, 'arm2length', 0.03, 0.4, 0.01).name('Arm 2 Length');
    gui.add(this, 'changey', 0, 1, 1).name('Arm1 change along Y');
    gui.add(this.twoarm, 'arm1factory', 0, 90, 1).name('Rotations along Y');
    gui.add(this, 'changex', 0, 1, 1).name('Arm2 change along X');
    gui.add(this.twoarm, 'arm2factorx', 0, 90, 1).name('Rotations along X');
    gui.add(this, 'changez', 0, 1, 1).name('Arm2 change along Z');
    gui.add(this.twoarm, 'arm2factorz', 0, 90, 1).name('Rotations along Z');
    gui.add(this.twoarm, 'speed', 1, 90, 1).name('Draw Speed');
    gui.addColor(this.twoarm, 'tubecolor').name('Tube Color');
    gui.add(this, 'animate', 0, 1, 1).name('Rotate Model');
    gui.add(this.twoarm, 'redraw').name('Redraw');
    this.gui = gui;

    setTimeout(() => {
      twoarm.redraw();
    }, 500);
  }
}