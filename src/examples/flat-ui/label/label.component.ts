import { AfterViewInit, Component, Input } from "@angular/core";

import { Object3D } from "three";
import { NgtTriple } from "@angular-three/core";

import { HEIGHT_CHANGED_EVENT, LabelColor, LAYOUT_EVENT, WIDTH_CHANGED_EVENT } from "../flat-ui-utils";

@Component({
  selector: 'flat-ui-label',
  exportAs: 'flatUILabel',
  templateUrl: './label.component.html',
})
export class FlatUILabel implements AfterViewInit {
  @Input() text = '';
  @Input() color = LabelColor;
  @Input() font = ''; // for example, https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff
  @Input() fontsize = 0.1;

  private _width = 1;
  @Input()
  get width() { return this._width }
  set width(newvalue: number) {
    this._width = newvalue;
    if (this.mesh) {
      this.mesh.dispatchEvent({ type: WIDTH_CHANGED_EVENT });
    }
  }

  private _height = 0.1;
  @Input()
  get height() { return this._height }
  set height(newvalue: number) {
    this._height = newvalue;
    if (this.mesh) {
      this.mesh.dispatchEvent({ type: HEIGHT_CHANGED_EVENT });
    }
  }

  @Input() position = [0, 0, 0] as NgtTriple;
  @Input() rotation = [0, 0, 0] as NgtTriple;
  @Input() scale = [1, 1, 1] as NgtTriple;

  ngAfterViewInit(): void {
    this.mesh.addEventListener(LAYOUT_EVENT, (e: any) => {
      e.width = this.width;
      e.height = this.height;
      e.updated = true;
    });
  }

  private mesh!: Object3D;

  meshready(mesh: Object3D) {
    this.mesh = mesh;
  }
}
