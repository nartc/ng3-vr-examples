import { ChangeDetectorRef, Component, EventEmitter, HostListener, Input, Output } from "@angular/core";
import { NgIf } from "@angular/common";

import { Material, Mesh } from "three";
import { NgtObjectProps } from "@angular-three/core";
import { NgtMesh } from "@angular-three/core/meshes";
import { NgtPlaneGeometry } from "@angular-three/core/geometries";
import { NgtObjectPassThrough } from "@angular-three/core";

import { GlobalFlatUITheme } from "../flat-ui-theme";

import { FlatUILabel } from "../label/label.component";
import { InteractiveObjects } from "../interactive-objects";
import { FlatUIButton } from "../button/button.component";

@Component({
  selector: 'flat-ui-confirm',
  exportAs: 'flatUIConfirm',
  templateUrl: './confirm.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgtMesh,
    NgtObjectPassThrough,
    NgtPlaneGeometry,
    FlatUILabel,
    FlatUIButton,
  ]
})
export class FlatUIConfirm extends NgtObjectProps<Mesh> {
  @Input() title = '';

  private _width = 1;
  @Input()
  get width(): number { return this._width }
  set width(newvalue: number) {
    this._width = Math.max(0.8, newvalue);
  }

  @Input() selectable?: InteractiveObjects;

  private _popupmaterial!: Material
  @Input()
  get popupmaterial(): Material {
    if (this._popupmaterial) return this._popupmaterial;
    return GlobalFlatUITheme.PopupMaterial;
  }
  set popupmaterial(newvalue: Material | undefined) {
    if (newvalue)
      this._popupmaterial = newvalue;
  }

  @Output() result = new EventEmitter<boolean>();

  private _height = 0; // calculated from height of title

  protected get height(): number { return this._height }
  protected set height(newvalue: number) {
    this._height = newvalue;
    this.cd.detectChanges();
  }

  constructor(private cd: ChangeDetectorRef) { super(); }

  @HostListener('document:keydown', ['$event'])
  private onKeyUp(event: KeyboardEvent) {
    if (event.key == 'Escape')
      this.result.next(false)
  }

}
