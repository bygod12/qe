import { Component } from '@angular/core';
import {fabric} from "fabric";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'untitled9';
  canvass:boolean = false;
  canvasselect!:Canvas;

  constructor() {
  }
}
interface Canvas {

  id?:string;
  name?: string;
  description?:string;
  width?:number;
  height?:number;
  background?:string;
  image?:string;
  components?: Components[];
  images?: string[];
  backgrounds?: string[];

}

interface Components {
  id?: string;
  name?: string;
  description?: string;
  left?: number;
  top?: number;
  radius?: number;
  rx?: number;
  ry?: number;
  fill?: string | fabric.Pattern | fabric.Gradient;
  image_url?: string;
  stroke?: string;
  strokeWidth?: number;
  scaleY?: number;
  scaleX?: number;
  imageUrl?: string;
  fontFamily?: string;
  fontSize?: number;
  text?: string;
  width?: number;
  height?: number;
  group?: Components[]; // Adicione a propriedade objects para armazenar os elementos do grupo
}


interface CustomControl extends fabric.Control {
  cornerSize?: number;
}
