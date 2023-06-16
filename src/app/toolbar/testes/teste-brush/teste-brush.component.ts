import { Component } from '@angular/core';
import { fabric } from 'fabric';

@Component({
  selector: 'app-teste-brush',
  templateUrl: './teste-brush.component.html',
  styleUrls: ['./teste-brush.component.css']
})
export class TesteBrushComponent {
  canvas!: fabric.Canvas;
  constructor() { }

  ngOnInit(): void {
    this.canvas = new fabric.Canvas('c');
    // Criar um retângulo


  }
  //canvas
  // brushes
  isDrawingMode: boolean = false;
  selectedMode: string = 'Pencil';
  lineWidth: number = 30;
  lineColor: string = '#005E7A';
  shadowColor: string = '#005E7A';
  shadowWidth: number = 0;
  shadowOffset: number = 0;

  toggleDrawingMode() {

    if (this.isDrawingMode) {
      this.canvas.isDrawingMode = false;
      this.isDrawingMode = false;
    } else {
      this.canvas.isDrawingMode = true;
      this.canvas.freeDrawingBrush = this.createBrush();
      this.isDrawingMode = true;
    }
  }

  clearCanvas() {
    this.canvas.clear();
  }

  changeBrush() {
    if (this.isDrawingMode) {
      this.canvas.freeDrawingBrush = this.createBrush();
    }
  }

  createBrush(): fabric.BaseBrush {
    switch (this.selectedMode) {
      case 'Pencil':
        return new fabric.PencilBrush(this.canvas);
        break;
      case 'Circle':
        return new fabric.CircleBrush();
        break;
      case 'Spray':
        return new fabric.SprayBrush();
        break;
      default:
        return new fabric.PencilBrush(this.canvas);
      break;
    }
  }


}
