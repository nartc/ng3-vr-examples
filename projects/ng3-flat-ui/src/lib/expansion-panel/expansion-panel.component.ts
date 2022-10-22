import { AfterViewInit, Component, ContentChild, Input, TemplateRef } from "@angular/core";

import { Group, Mesh, MeshBasicMaterial, Object3D } from "three";
import { NgtObjectProps } from "@angular-three/core";

import { HEIGHT_CHANGED_EVENT, LAYOUT_EVENT, WIDTH_CHANGED_EVENT } from "../flat-ui-utils";
import { GlobalFlatUITheme } from "../flat-ui-theme";

import { InteractiveObjects } from "../interactive-objects";


@Component({
  selector: 'flat-ui-expansion-panel',
  exportAs: 'flatUIIconExpansionPanel',
  templateUrl: './expansion-panel.component.html',
})
export class FlatUIExpansionPanel extends NgtObjectProps<Mesh> implements AfterViewInit {
  @Input() title = '';
  @Input() overflow = 24;

  titleheight = 0.1;

  private _width = 1;
  @Input()
  get width() { return this._width }
  set width(newvalue: number) {
    this._width = newvalue;
    if (this.mesh) {
      this.mesh.dispatchEvent({ type: WIDTH_CHANGED_EVENT });
    }
  }

  private _height = 1;
  @Input()
  get height() {
    let height = this.titleheight;
    if (this.expanded) height += this._height;
    return height
  }

  set height(newvalue: number) {
    this._height = newvalue;
    if (this.mesh) {
      this.mesh.dispatchEvent({ type: HEIGHT_CHANGED_EVENT });
    }
  }

  private _expanded = true;
  @Input()
  get expanded(): boolean { return this._expanded }
  set expanded(newvalue: boolean) {
    this._expanded = newvalue;
    if (this.mesh) {
      this.mesh.dispatchEvent({ type: HEIGHT_CHANGED_EVENT });
    }

    // hide the group when expanding.  Visbable when layout called
    if (this.group && newvalue) {
      this.group.visible = false;
      const timer = setTimeout(() => {
        this.group.visible = true;
        clearTimeout(timer);
      }, 100)

    }

    if (this.panel) this.panel.scale.y = newvalue ? 1 : 0;
  }

  private _panelcolor?: string;
  @Input()
  get panelcolor(): string {
    if (this._panelcolor) return this._panelcolor;
    return GlobalFlatUITheme.PanelColor;
  }
  set panelcolor(newvalue: string) {
    this._panelcolor = newvalue;
  }

  private _labelcolor?: string;
  @Input()
  get labelcolor(): string {
    if (this._labelcolor) return this._labelcolor;
    return GlobalFlatUITheme.LabelColor;
  }
  set labelcolor(newvalue: string) {
    this._labelcolor = newvalue;
  }


  @Input() selectable?: InteractiveObjects;

  titlematerial!: MeshBasicMaterial;

  get displaytitle(): string { return this.title.slice(0, this.overflow * this.width); }

  @ContentChild(TemplateRef) templateRef?: TemplateRef<unknown>;


  override preInit() {
    super.preInit();

    this.titlematerial = new MeshBasicMaterial({ color: this.panelcolor, transparent: true, opacity: 0.1 });
  }
  override ngOnDestroy() {
    super.ngOnDestroy();

    this.selectable?.remove(this.mesh);

    this.titlematerial.dispose();
  }

  ngAfterViewInit(): void {
    this.mesh.addEventListener(LAYOUT_EVENT, (e: any) => {
      e.width = this.width;
      e.height = this.height;
      e.updated = true;
    });
  }

  group!: Group;
  panel!: Mesh;

  private mesh!: Object3D;

  meshready(mesh: Object3D) {
    this.selectable?.add(mesh);

    this.mesh = mesh;
  }
}