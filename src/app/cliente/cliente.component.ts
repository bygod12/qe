import {AfterViewInit, Component, OnInit} from '@angular/core';
import {fabric} from "fabric";
import {ActivatedRoute} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements AfterViewInit {

  public loadedImages: Array<string | ArrayBuffer> = [];
  public canvas!: fabric.Canvas;
  objects!: fabric.Object[];
  background: any;

  objectsMake!:any[];
  images!: any[];

  constructor(private route: ActivatedRoute) {

    try{

      this.route.params.subscribe(params => {



        let encoded = params['objects'];
        let decoded = decodeURIComponent(encoded);
        // Não usa JSON.parse no encoded
        // this.json = JSON.parse(encoded);
        this.objects = JSON.parse(decoded) as fabric.Object[];
        console.log(this.objects);
        let objectsMakeencoded = params['objectsMake'];
        let objectsMakedecoded = decodeURIComponent(objectsMakeencoded);
        this.objectsMake = JSON.parse(objectsMakedecoded);
        console.log(this.objectsMake);


        let imagesencoded = params['images'];
        let imagesdecoded = decodeURIComponent(imagesencoded);
        this.images = JSON.parse(imagesdecoded);
        console.log(this.images);
        let backgroundencoded = params['objectsMake'];
        let backgrounddecoded = decodeURIComponent(backgroundencoded);
        this.background = JSON.parse(backgrounddecoded);
        console.log(this.objectsMake);


      });
    }catch (e){
      console.log(e)
    }
  }


  ngOnInit(): void {




  }

  ngAfterViewInit(): void {
    this.canvas = new fabric.Canvas('canvas');

    this.objects.forEach((obj: any) => {
      obj.canvas = this.canvas;
      if (obj.type === 'image') {
        const image = new fabric.Image(obj);
        this.canvas.add(image);
        this.canvas.renderAll();
        console.log(this.canvas);
        console.log(this.canvas.getObjects());

      } else {
        switch (obj.type) {
          case 'circle':

            const circle = new fabric.Circle(obj);
            this.canvas.add(circle);
            this.canvas.renderAll();
            console.log(this.canvas);
            console.log(this.canvas.getObjects());

            break;
          case 'line':
            const line = new fabric.Line(obj.path, obj);
            this.canvas.add(line);
            this.canvas.renderAll();
            console.log(this.canvas);
            console.log(this.canvas.getObjects());

            break;
          case 'ellipse':
            const ellipse = new fabric.Ellipse(obj);
            this.canvas.add(ellipse);
            this.canvas.renderAll();
            console.log(this.canvas);
            console.log(this.canvas.getObjects());

            break;
          case 'polygon':
            const polygon = new fabric.Polygon(obj.points, obj);
            this.canvas.add(polygon);
            this.canvas.renderAll();
            console.log(this.canvas);
            console.log(this.canvas.getObjects());

            break;
          case 'polyline':
            const polyline = new fabric.Polyline(obj.points, obj);
            this.canvas.add(polyline);
            this.canvas.renderAll();
            console.log(this.canvas);
            console.log(this.canvas.getObjects());

            break;
          case 'rect':
            const rect = new fabric.Rect(obj);
            this.canvas.add(rect);
            this.canvas.renderAll();
            console.log(this.canvas);
            console.log(this.canvas.getObjects());

            break;
          case 'triangle':
            const triangle = new fabric.Triangle(obj);
            this.canvas.add(triangle);
            this.canvas.renderAll();
            console.log(this.canvas);
            console.log(this.canvas.getObjects());

            break;
        }
      }
    });
  }
  }
