import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";

import { BufferGeometry, Material, Mesh, MeshBasicMaterial, Shape, ShapeGeometry } from "three";
import { NgtEvent, NgtObjectProps } from "@angular-three/core";

import { HEIGHT_CHANGED_EVENT, LAYOUT_EVENT, roundedRect, WIDTH_CHANGED_EVENT } from "../flat-ui-utils";
import { GlobalFlatUITheme, THEME_CHANGE_EVENT } from "../flat-ui-theme";

import { InteractiveObjects } from "../interactive-objects";

@Component({
  selector: 'flat-ui-input-toggle',
  exportAs: 'flatUIInputToggle',
  templateUrl: './input-toggle.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlatUIInputToggle extends NgtObjectProps<Mesh> implements AfterViewInit {
  private _checked = false;
  @Input()
  get checked(): boolean { return this._checked }
  set checked(newvalue: boolean) {
    this._checked = newvalue;
    this.togglematerial = newvalue ? this.truematerial : this.falsematerial;

    if (this.togglemesh) {
      this.updatetoggle();
    }
  }

  @Input() enabled = true;

  private _buttoncolor?: string;
  @Input()
  get buttoncolor(): string {
    if (this._buttoncolor) return this._buttoncolor;
    return GlobalFlatUITheme.ButtonColor;
  }
  set buttoncolor(newvalue: string) {
    this._buttoncolor = newvalue;
  }

  private _hovercolor?: string;
  @Input()
  get hovercolor(): string {
    if (this._hovercolor) return this._hovercolor;
    return GlobalFlatUITheme.HoverColor;
  }
  set hovercolor(newvalue: string) {
    this._hovercolor = newvalue;
  }

  private _falsematerial!: Material
  @Input()
  get falsematerial(): Material {
    if (this._falsematerial) return this._falsematerial;
    return GlobalFlatUITheme.ToggleFalseMaterial;
  }
  set falsematerial(newvalue: Material) {
    this._falsematerial = newvalue;
  }

  private _truematerial!: Material
  @Input()
  get truematerial(): Material {
    if (this._truematerial) return this._truematerial;
    return GlobalFlatUITheme.ToggleTrueMaterial;
  }
  set truematerial(newvalue: Material) {
    this._truematerial = newvalue;
  }

  private _width = 0.2;
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

  @Input() selectable?: InteractiveObjects;

  @Output() change = new EventEmitter<boolean>();

  @Input() geometry!: BufferGeometry;
  @Input() material!: MeshBasicMaterial;

  protected togglematerial = this.falsematerial;

  override preInit() {
    super.preInit();

    if (!this.geometry) this.createToggleGeometry();
    if (!this.material) this.createToggleMaterial();
  }

  createToggleGeometry() {
    const flat = new Shape();
    roundedRect(flat, 0, 0, this.width, this.height, this.height / 2);

    this.geometry = new ShapeGeometry(flat);
    this.geometry.center();
  }

  createToggleMaterial() {
    this.material = new MeshBasicMaterial({ color: this.buttoncolor });
  }

  override ngOnDestroy() {
    super.ngOnDestroy();

    this.selectable?.remove(this.mesh);
    this.selectable?.remove(this.togglemesh);

    this.geometry.dispose();
    this.material.dispose();
  }

  ngAfterViewInit(): void {
    this.mesh.addEventListener(LAYOUT_EVENT, (e: any) => {
      e.width = this.width;
      e.height = this.height;
      e.updated = true;
    });

    GlobalFlatUITheme.addEventListener(THEME_CHANGE_EVENT, () => {
      this.material.color.setStyle(this.buttoncolor);
    })
  }

  private mesh!: Mesh;

  protected meshready(mesh: Mesh) {
    this.selectable?.add(mesh);

    mesh.addEventListener('click', (e: any) => { this.doclicked(); e.stop = true; });
    mesh.addEventListener('pointermove', (e: any) => { this.over(); e.stop = true; });
    mesh.addEventListener('pointerout', (e: any) => { this.out(); e.stop = true; });

    this.mesh = mesh;
  }


  private togglemesh!: Mesh;

  protected toggleready(mesh: Mesh) {
    this.selectable?.add(mesh);

    mesh.addEventListener('click', (e: any) => { this.doclicked(); e.stop = true; });

    this.togglemesh = mesh;

    this.updatetoggle();

  }

  private updatetoggle() {
    const offset = this.width / 4;
    this.togglemesh.position.x = this.checked ? offset : -offset;
  }

  protected clicked(mesh: Mesh, event: NgtEvent<MouseEvent>) {
    if (event.object != mesh) return;
    event.stopPropagation();

    this.doclicked();
  }

  private doclicked() {
    if (!this.enabled || !this.visible) return;

    this.checked = !this.checked;
    this.change.next(this.checked);
  }

  protected over() {
    if (!this.enabled) return;
    this.material.color.setStyle(this.hovercolor);
  }
  protected out() {
    if (!this.enabled) return;
    this.material.color.setStyle(this.buttoncolor);
  }


}
