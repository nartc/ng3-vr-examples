import { Component, EventEmitter, Input, Output } from "@angular/core";

import { BufferGeometry, DoubleSide, MathUtils, Mesh, MeshBasicMaterial, Object3D, Shape, ShapeGeometry, Vector3 } from "three";
import { NgtObjectProps } from "@angular-three/core";

import { ButtonColor, HoverColor, NumberColor, roundedRect, UIInput } from "../flat-ui-utils";

import { InteractiveObjects } from "../interactive-objects";

@Component({
  selector: 'flat-ui-input-number',
  exportAs: 'flatUIInputNumber',
  templateUrl: './input-number.component.html',
})
export class FlatUIInputNumber extends NgtObjectProps<Mesh> implements UIInput {
private _text = '';
  @Input()
  get text(): string { return this._text }
  set text(newvalue: string) {
    if (newvalue == '.' || newvalue == '-' || newvalue == '-.') {
      this._text = newvalue;
    }
    else {
      let value = +newvalue;
      if (!isNaN(value)) {
        value = MathUtils.clamp(value, this.min, this.max);
        this.change.next(value);

        this._text = newvalue;
      }
    }
  }
  @Input() overflow = 6; 

  @Input() min = -Infinity;
  @Input() max = Infinity;

  @Input() enabled = true;
  @Input() width = 0.5;
  @Input() numbercolor = NumberColor;

  @Input() selectable?: InteractiveObjects;

  @Input() buttoncolor = ButtonColor;
  @Input() hovercolor = HoverColor;

  inputopen = false;
  @Output() openinput = new EventEmitter<Object3D>();
  @Output() change = new EventEmitter<number>();

  geometry!: BufferGeometry;
  material!: MeshBasicMaterial;

  height = 0.1

  get textvalue(): string {
    let text = this.text.substring(this.text.length - this.overflow);
    if (this.inputopen && this.enabled) text += '_'
    return text;
  }

  override preInit() {
    super.preInit();

    if (!this.geometry) {
      const flat = new Shape();
      roundedRect(flat, 0, 0, this.width, this.height, 0.02);

      this.geometry = new ShapeGeometry(flat);
      this.geometry.center();
    }
    if (!this.material) {
      this.material = new MeshBasicMaterial({ color: this.buttoncolor, side: DoubleSide, opacity: 0.5, transparent: true });
    }
  }

  override ngOnDestroy() {
    super.ngOnDestroy();

    this.selectable?.remove(this.mesh);

    this.geometry.dispose();
    this.material.dispose();
  }

  private mesh!: Mesh;

  meshready(mesh: Mesh) {
    this.selectable?.add(mesh);

    mesh.addEventListener('click', (e: any) => { this.enableinput(mesh); e.stop = true; })
    mesh.addEventListener('pointermove', (e: any) => { this.over(); e.stop = true; });
    mesh.addEventListener('pointerout', (e: any) => { this.out(); e.stop = true; });

    this.mesh = mesh;
  }


  enableinput(mesh: Mesh) {
    if (!this.enabled || !this.visible) return;

    this.inputopen = true;
    this.openinput.next(mesh);
  }

  isover = false;
  over() {
    if (this.isover) return;
    this.material.color.setStyle(this.hovercolor);
    this.isover = true;
  }
  out() {
    this.material.color.setStyle(this.buttoncolor);
    this.isover = false;
  }

}
