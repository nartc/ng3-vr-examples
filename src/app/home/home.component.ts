import { Component, NgZone, OnInit } from '@angular/core';

import { NgtTriple } from '@angular-three/core';
import { CameraService } from '../camera.service';
import { Intersection, Object3D } from 'three';
import { ActivatedRoute, Router } from '@angular/router';

class PanelSetting {
  constructor(public position: NgtTriple, public rotation: number, public asset: string, public text: string) { }
}

@Component({
  templateUrl: 'home.component.html',
})
export class HomeComponent implements OnInit {
  examples = [
    { asset: 'ballshooter', text: 'Ball Shooter' },
    { asset: 'dragging', text: 'Dragging' },
    { asset: 'handinput', text: 'Hand input' },
    { asset: 'teleport', text: 'Teleport' },
    { asset: 'bat', text: 'Physics Bat' },
    { asset: 'inspect', text: 'Grab / Inspect' },
    { asset: 'drumstick', text: 'Drumstick / Keyboard' },
    { asset: 'touchpad', text: 'Touchpad Movement' },
    { asset: 'joystick', text: 'Joystick Movement' },
    { asset: 'behaviors', text: 'Toggle Controller Behaviors' },
    { asset: 'studio', text: 'Lights, Camera, Action' },
    { asset: 'paint', text: 'Paint' },
    { asset: 'htmlgui', text: 'HTML Mesh GUI' },
    { asset: 'scale', text: 'World Scale' },
    { asset: 'buttons', text: 'Buttons' },
    { asset: 'morphwall', text: 'Morphing Wall' },
    { asset: 'forcelayout', text: 'Force Layout' },
    { asset: 'spirograph', text: 'Spirograph' },
    { asset: 'artlife', text: 'Particle Life' },
    { asset: 'svg', text: 'SVG Icons' },
  ]

  panels: Array<PanelSetting> = [];

  selectable: Array<Object3D> = [];


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private zone: NgZone,
    private camera: CameraService,
  ) {
    // restore defaults in case they changed
    this.camera.position = [0, 2, 4];
    this.camera.fov = 55;

    const angle = 360 / this.examples.length;

    this.examples.forEach((item, index) => {
      const position = [0, 0, 0] as NgtTriple;
      const rotation = angle * index;

      const panel = new PanelSetting(position, rotation, item.asset, item.text)
      this.panels.push(panel);
    });
  }

  ngOnInit(): void {
    const example = this.route.snapshot.queryParams['example'];
    if (example) {
      const timer = setTimeout(() => {
        this.router.navigate(['/' + example]);
        clearTimeout(timer);
      }, 1000);
    }
  }

  intersected(intersect: Intersection) {
    this.selected(intersect.object);
  }

  selected(object: Object3D) {
    const asset = object.userData['asset'];
    if (asset) {
      this.zone.run(() => {
        this.router.navigate([asset]);
      });
    }
  }


  highlight(intersect: Intersection) {
    intersect.object.scale.multiplyScalar(1.02)
  }

  unhighlight(intersect: Intersection) {
    intersect.object.scale.multiplyScalar(0.98)
  }
}
