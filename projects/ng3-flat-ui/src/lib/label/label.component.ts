import { AfterViewInit, ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { Group, Material, Object3D } from "three";
import { NgtObjectProps, NgtTriple } from "@angular-three/core";

import { HEIGHT_CHANGED_EVENT, LAYOUT_EVENT, WIDTH_CHANGED_EVENT } from "../flat-ui-utils";
import { GlobalFlatUITheme } from "../flat-ui-theme";

@Component({
  selector: 'flat-ui-label',
  exportAs: 'flatUILabel',
  templateUrl: './label.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlatUILabel extends NgtObjectProps<Group> implements AfterViewInit {
  @Input() text = '';
  @Input() font = ''; // for example, https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff
  @Input() fontsize = 0.07;

  private _labelmaterial!: Material
  @Input()
  get labelmaterial(): Material {
    if (this._labelmaterial) return this._labelmaterial;
    return GlobalFlatUITheme.LabelMaterial;
  }
  set labelmaterial(newvalue: Material) {
    this._labelmaterial = newvalue;
  }

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
    console.warn(newvalue)
    this._height = newvalue;
    if (this.mesh) {
      this.mesh.dispatchEvent({ type: HEIGHT_CHANGED_EVENT });
    }
  }

  ngAfterViewInit(): void {
    this.mesh.addEventListener(LAYOUT_EVENT, (e: any) => {
      e.width = this.width;
      e.height = Math.max(this.height, this.fontsize);
      e.updated = true;
    });
  }

  private mesh!: Object3D;

  meshready(mesh: Object3D) {
    this.mesh = mesh;
  }
}
