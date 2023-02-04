import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { Box2, BufferGeometry, ExtrudeGeometry, Group, MathUtils, Shape } from "three";
import { NgtObjectProps } from "@angular-three/core";

import { LineData } from "../line-plot/line-plot.component";


@Component({
  selector: 'area-plot',
  exportAs: 'areaPlot',
  templateUrl: './area-plot.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AreaPlot extends NgtObjectProps<Group>{

  protected geometry!: BufferGeometry;

  private _data!: LineData
  @Input()
  get data(): LineData { return this._data }
  set data(newvalue: LineData) {
    this._data = newvalue;
    this.updateFlag = true;
  }

  @Input() width = 1;
  @Input() height = 1;

  private _redraw = false;
  @Input()
  get redraw(): boolean { return this._redraw }
  set redraw(newvalue: boolean) {
    this._redraw = newvalue;
    this.updateFlag = true;
  }

  private updateFlag = false;
  private box = new Box2();
  private options = { bevelEnabled: false, depth: 0.05 };

  private refresh() {

    const box = this.box;
    box.makeEmpty();

    this.data.values.forEach(value => box.expandByPoint(value));

    const shape = new Shape();
    this.data.values.forEach(value => {
      const x = MathUtils.mapLinear(value.x, box.min.x, box.max.x, 0, this.width);
      const y = MathUtils.mapLinear(value.y, box.min.y, box.max.y, 0, this.height);
      shape.lineTo(x, y);
    })
    shape.lineTo(this.width, 0)
    shape.closePath();

    if (this.geometry) this.geometry.dispose();
    this.geometry = new ExtrudeGeometry(shape, this.options);

  }

  protected tick() {
    if (this.updateFlag) {
      this.updateFlag = false;
      this.refresh();
    }
  }
}