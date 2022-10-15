import { NgtLoader, NgtTriple } from "@angular-three/core";
import { Component, OnInit } from "@angular/core";
import { BoxGeometry, BufferGeometry, CircleBufferGeometry, Curve, DoubleSide, Path, Shape, ShapeGeometry, ShapeUtils, Side, Texture, TextureLoader, Vector2, Vector3 } from "three";
import { InteractiveObjects } from "../flat-ui/interactive-objects";
import { FlatUIInputService } from "../three-gui/flat-ui-input.service";
import { Button1Geometry } from "./button1";
import { CloseButtonGeometry } from "./close-button";
import { Dialog1Geometry } from "./dialog1";
import { DrawShape } from "./draw-shape";
import { Label1Geometry } from "./label1";
import { Label2Geometry } from "./label2";
import { RectangleGeometry } from "./rectangle";
import { RoundRectangeGeometry } from "./round-rectangle";


@Component({
  templateUrl: './shapes.component.html',
  providers: [FlatUIInputService]
})
export class ShapesExample implements OnInit {
  selectable = new InteractiveObjects()

  shape!:DrawShape;
  border!: BufferGeometry;

  scale = 1.05
  scaleborder = [this.scale, this.scale, this.scale] as NgtTriple;

  texture!: Texture;

  height = 1
  width = 1

  constructor(
    private loader: NgtLoader,
    public input: FlatUIInputService
  ) { }


  ngOnInit(): void {
    this.shape = new RectangleGeometry()
    this.border = this.shape.drawborder()

  //  const s = this.loader.use(TextureLoader, 'assets/label.png').subscribe(next => {
  //    this.texture = next; 
  //  },
  //    () => { },
  //    () => { s.unsubscribe(); }
  //  );
  }
}
