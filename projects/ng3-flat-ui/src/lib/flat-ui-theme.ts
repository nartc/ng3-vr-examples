import { Material, MeshBasicMaterial, Object3D } from "three";

export const THEME_CHANGE_EVENT = 'themechanged';

export interface FlatUITheme {
  LabelColor: string,
  ButtonColor: string,
  HoverColor: string,
  ClickColor: string,
  ButtonLabelColor: string,
  NumberColor: string,
  StringColor: string,
  CheckColor: string,
  SlideColor: string,
  ToggleFalseColor: string,
  ToggleTrueColor: string,
  RadioFalseColor: string,
  RadioTrueColor: string,
  IconColor: string,
  PanelColor: string,
  PopupColor: string,
  SelectColor: string,
  ProgressColor: string,
  DisabledColor: string,
}
// just in case you want to add to the scheme when saving to GLTF

export class FlatUIThemeObject extends Object3D implements FlatUITheme {
  LabelColor = 'white';
  ButtonColor = '#505050';
  HoverColor = 'blue';
  ClickColor = 'cornflowerblue';
  ButtonLabelColor = 'white';
  NumberColor = 'cornflowerblue';
  StringColor = 'lime';
  CheckColor = 'cornflowerblue';
  SlideColor = 'yellow';
  ToggleFalseColor = 'white';
  ToggleTrueColor = 'cornflowerblue';
  RadioFalseColor = '#505050';
  RadioTrueColor = 'cornflowerblue';
  IconColor = 'white';
  PanelColor = 'black';
  PopupColor = 'gray';
  SelectColor = 'white';
  ProgressColor = 'green';
  DisabledColor = '#666666'

  // notify any object using the theme that it changed
  notify() {
    this.dispatchEvent({ type: THEME_CHANGE_EVENT })
  }

  changeTheme(newtheme: FlatUITheme) {
    this.LabelColor = newtheme.LabelColor
    this.ButtonColor = newtheme.ButtonColor
    this.HoverColor = newtheme.HoverColor
    this.ClickColor = newtheme.ClickColor
    this.ButtonLabelColor = newtheme.ButtonLabelColor
    this.NumberColor = newtheme.NumberColor
    this.StringColor = newtheme.StringColor
    this.CheckColor = newtheme.CheckColor
    this.SlideColor = newtheme.SlideColor
    this.ToggleFalseColor = newtheme.ToggleFalseColor
    this.ToggleTrueColor = newtheme.ToggleTrueColor
    this.RadioFalseColor = newtheme.RadioFalseColor
    this.RadioTrueColor = newtheme.RadioTrueColor
    this.IconColor = newtheme.IconColor
    this.PanelColor = newtheme.PanelColor
    this.PopupColor = newtheme.PopupColor
    this.SelectColor = newtheme.SelectColor
    this.ProgressColor = newtheme.ProgressColor
    this.DisabledColor = newtheme.DisabledColor;

    (this.LabelMaterial as MeshBasicMaterial).color.setStyle(newtheme.LabelColor);
    (this.NumberMaterial as MeshBasicMaterial).color.setStyle(newtheme.NumberColor);
    (this.StringMaterial as MeshBasicMaterial).color.setStyle(newtheme.StringColor);


    this.notify();
  }

  LabelMaterial !: Material;
  ButtonMaterial !: Material;
  HoverMaterial !: Material;
  ClickMaterial !: Material;
  ButtonLabelMaterial !: Material;
  NumberMaterial !: Material;
  StringMaterial !: Material;
  CheckMaterial !: Material;
  SlideMaterial !: Material;
  ToggleFalseMaterial !: Material;
  ToggleTrueMaterial !: Material;
  RadioFalseMaterial !: Material;
  RadioTrueMaterial !: Material;
  IconMaterial !: Material;
  PanelMaterial !: Material;
  PopupMaterial !: Material;
  SelectMaterial !: Material;
  ProgressMaterial !: Material;
  DisabledMaterial !: Material

  constructor() {
    super();

    this.LabelMaterial = new MeshBasicMaterial({ color: this.LabelColor });
    this.NumberMaterial = new MeshBasicMaterial({ color: this.NumberColor });
    this.StringMaterial = new MeshBasicMaterial({ color: this.StringColor });

    this.ButtonMaterial = new MeshBasicMaterial({ color: this.ButtonColor });
    
  }


}

export const GlobalFlatUITheme = new FlatUIThemeObject();
