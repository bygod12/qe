import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { fabric } from 'fabric';
import {ImageService} from "./image.service";
import {getDownloadURL, getStorage, ref, uploadBytes} from "firebase/storage";
import {ActivatedRoute, Router} from "@angular/router";
import { MatDialog } from '@angular/material/dialog';
import {ModalTextComponent} from "../modal-text/modal-text.component";
import {FormasComponent} from "../formas/formas.component";
import {ModalColorComponent} from "../modal-color/modal-color.component";
import {Gradient, Pattern} from "fabric/fabric-impl";
import { AngularFirestore, QuerySnapshot } from '@angular/fire/compat/firestore';
import {saveAs} from "file-saver";

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css'],
})
export class CanvasComponent implements OnInit {
  deleteIcon: string = "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";
  img!: HTMLImageElement;
  @Input() canvasselect!: Canvas;
  objects: any[] = [];
  public loadedImages: Array<string | ArrayBuffer> = [];
  public canvas!: fabric.Canvas;
  public loadedBackground: Array<string | ArrayBuffer> = [];
  components: any[] = [];
  height:string = "800";
  width:string = "600";
  background!:string;
  Componentes:Components[] = [];


  constructor(private firestore: AngularFirestore,public is: ImageService, public router: Router,public route:ActivatedRoute, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.img = new Image();
    this.img.src = this.deleteIcon;

    (fabric.Object.prototype.controls as any).deleteControl = new fabric.Control({
      x: 0.5,
      y: -0.5,
      offsetY: 16,
      cursorStyle: 'pointer',
      mouseUpHandler: this.deleteObject.bind(this),
      render: this.renderIcon.bind(this)
    } as CustomControl);
    this.canvas = new fabric.Canvas('canvas');
    this.canvas.selection = false; // Desativa a seleção padrão do Fabric.js


    this.buildCanvas(this.canvasselect);
    this.listarImagens();
    this.listarBackground();
    this.canvas.renderAll();
  }


// Função para montar um canvas a partir de um objeto do tipo Canvas
  buildCanvas(canvasData: Canvas): fabric.Canvas {
    this.canvas = new fabric.Canvas('canvas');

  const canvas = this.canvas;

  canvasData.components!.forEach(componentData => {
    let component: fabric.Object | null = null;
    console.log(componentData);

    switch (componentData.name) {
      case 'circle':
        component = new fabric.Circle({
          left: componentData.left,
          top: componentData.top,
          radius: componentData.radius,
          fill: componentData.fill,
          strokeWidth: componentData.strokeWidth,
          stroke: componentData.stroke,
          scaleX: componentData.scaleX,
          scaleY: componentData.scaleY
        });
        break;
      case 'ellipse':
        component = new fabric.Ellipse({
          left: componentData.left,
          top: componentData.top,
          rx: componentData.rx,
          ry: componentData.ry,
          fill: componentData.fill,
          strokeWidth: componentData.strokeWidth,
          stroke: componentData.stroke,
          scaleX: componentData.scaleX,
          scaleY: componentData.scaleY
        });
        break;
      case 'rect':
        component = new fabric.Rect({
          left: componentData.left,
          top: componentData.top,
          width: componentData.width,
          height: componentData.height,
          fill: componentData.fill,
          strokeWidth: componentData.strokeWidth,
          stroke: componentData.stroke,
        });
        break;
      case 'triangle':
        component = new fabric.Triangle({
          left: componentData.left,
          top: componentData.top,
          width: componentData.width,
          height: componentData.height,
          fill: componentData.fill,
          strokeWidth: componentData.strokeWidth,
          stroke: componentData.stroke,
          scaleX: componentData.scaleX,
          scaleY: componentData.scaleY
        });
        break;
      case 'image':
        fabric.Image.fromURL(componentData.image_url!, (img) => {
          img.set({
            left: componentData.left,
            top: componentData.top,
            scaleX: componentData.scaleX,
            scaleY: componentData.scaleY
          });
          canvas.add(img);
        });
        break;
      case 'textbox'|| 'i-text' ||'text':
        component = new fabric.Textbox(componentData.text!, {
          left: componentData.left,
          top: componentData.top,
          width: componentData.width,
          height: componentData.height,
          fill: componentData.fill,
          fontSize: componentData.fontSize,
          fontFamily: componentData.fontFamily,
          strokeWidth: componentData.strokeWidth,
          stroke: componentData.stroke,
          scaleX: componentData.scaleX,
          scaleY: componentData.scaleY
        });
        break;
      case 'textbox':
        component = new fabric.Textbox(componentData.text!, {
          left: componentData.left,
          top: componentData.top,
          width: componentData.width,
          height: componentData.height,
          fill: componentData.fill,
          fontSize: componentData.fontSize,
          fontFamily: componentData.fontFamily,
          strokeWidth: componentData.strokeWidth,
          stroke: componentData.stroke,
          scaleX: componentData.scaleX,
          scaleY: componentData.scaleY,
        });
        break;
      case 'i-text':
        component = new fabric.IText(componentData.text!, {
          left: componentData.left,
          top: componentData.top,
          width: componentData.width,
          height: componentData.height,
          fill: componentData.fill,
          fontSize: componentData.fontSize,
          fontFamily: componentData.fontFamily,
          strokeWidth: componentData.strokeWidth,
          stroke: componentData.stroke,
          scaleX: componentData.scaleX,
          scaleY: componentData.scaleY,
        });
        console.log(component);
        console.log(componentData);
        break;
      case 'text':
        component = new fabric.Text(componentData.text!, {
          left: componentData.left,
          top: componentData.top,
          width: componentData.width,
          height: componentData.height,
          fill: componentData.fill,
          fontSize: componentData.fontSize,
          fontFamily: componentData.fontFamily,
          strokeWidth: componentData.strokeWidth,
          stroke: componentData.stroke,
          scaleX: componentData.scaleX,
          scaleY: componentData.scaleY,
        });
        break;
      case 'group':
        const groupComponents: fabric.Object[] = [];
        componentData.group?.forEach(groupComponentData => {
          let groupComponent: fabric.Object | null = null;
          let rectHeigth!: number;
          // Crie o componente interno do grupo
          switch (groupComponentData.name) {
            case 'rect':
              groupComponent = new fabric.Rect({
                left: groupComponentData.left,
                top: groupComponentData.top,
                width: groupComponentData.width,
                height: groupComponentData.height,
                fill: groupComponentData.fill,
                strokeWidth: groupComponentData.strokeWidth,
                stroke: groupComponentData.stroke,
              });
              rectHeigth = groupComponentData.height!;
              break;
            case 'image':
              groupComponent = new fabric.Image(groupComponentData.image_url!, {
                left: groupComponentData.left,
                top: groupComponentData.top,
                scaleX: groupComponentData.scaleX,
                scaleY: groupComponentData.scaleY
              });
              break;
            case 'textbox':
              groupComponent = new fabric.Textbox(groupComponentData.text!, {
                left: groupComponentData.left,
                top: groupComponentData.top,
                width: groupComponentData.width,
                height: groupComponentData.height,
                fill: groupComponentData.fill,
                fontSize: groupComponentData.fontSize,
                fontFamily: groupComponentData.fontFamily,
                strokeWidth: groupComponentData.strokeWidth,
                stroke: groupComponentData.stroke,
                scaleX: groupComponentData.scaleX,
                scaleY: groupComponentData.scaleY,
                selectable: false,
                selected: false
              });
              break;
            case 'i-text':
              groupComponent = new fabric.IText(groupComponentData.text!, {
                left: groupComponentData.left,
                top: groupComponentData.top,
                width: groupComponentData.width,
                height: groupComponentData.height,
                fill: groupComponentData.fill,
                fontSize: groupComponentData.fontSize,
                fontFamily: groupComponentData.fontFamily,
                strokeWidth: groupComponentData.strokeWidth,
                stroke: groupComponentData.stroke,
                scaleX: groupComponentData.scaleX,
                scaleY: groupComponentData.scaleY,
                selectable: false,
                selected: false
              });

              break;
            case 'text':
              groupComponent = new fabric.Text(groupComponentData.text!, {
                left: groupComponentData.left,
                top: groupComponentData.top,
                width: groupComponentData.width,
                height: groupComponentData.height,
                fill: groupComponentData.fill,
                fontSize: groupComponentData.fontSize,
                fontFamily: groupComponentData.fontFamily,
                strokeWidth: groupComponentData.strokeWidth,
                stroke: groupComponentData.stroke,
                scaleX: groupComponentData.scaleX,
                scaleY: groupComponentData.scaleY,
                selectable: false,
              });
              break;
          }

          if (groupComponent) {
            groupComponents.push(groupComponent);
          }
        });

        // Crie o grupo com os componentes internos
        if (groupComponents.length > 0) {
          component = new fabric.Group(groupComponents);
        }
        break;
    }


    if (component) {
      if (component.type != 'i-text' && component.type!= 'textbox'&& component.type!= 'group' && component.type!= 'image'){
        this.components.push(component);
      }
      canvas.add(component);
    }
  });
  if(this.canvasselect.background!=''){
    if (this.isColor(this.canvasselect.background)){
      this.onColorChangeBuild(this.canvasselect.background);
    }else if(this.canvasselect.background == 'marca'){
      this.SelectColorPadron()
    }else{
      this.SelectBackground(this.canvasselect.background);
    }
  }
  return canvas;
}
  isColor(value: any): boolean {
    // Verifica se o valor corresponde a um formato hexadecimal (#RRGGBB)
    const hexRegex = /^#([0-9A-Fa-f]{6})$/;
    if (hexRegex.test(value)) {
      return true;
    }

    // Verifica se o valor corresponde a um nome de cor pré-definido
    const predefinedColors = [
      'black', 'silver', 'gray', 'white', 'maroon', 'red', 'purple', 'fuchsia',
      'green', 'lime', 'olive', 'yellow', 'navy', 'blue', 'teal', 'aqua'
    ];
    if (predefinedColors.includes(value.toLowerCase())) {
      return true;
    }

    return false;
  }

  protected readonly JSON = JSON;
  addImageToCanvas(imageUrl: any) {
    fabric.Image.fromURL(imageUrl, (img) => {
      // img.scaleToWidth(200); // Ajuste a largura da imagem conforme necessário
      // const image: Components = {
      //   name: 'Imagem',
      //   left: img.left,
      //   top: img.top,
      //   radius: 0,
      //   rx: 0,
      //   ry: 0,
      //   fill: '',
      //   image_url: img
      // };
      // this.compoentes.push(image);
      this.canvas.add(img);
      this.objects.push(img);
    })
  };


  async saveImage(event: any): Promise<void> {
    const file = event.target.files[0];



    const downloadUrl = await this.is.uploadImage(file, this.canvasselect.id);
    this.loadedImages.push(downloadUrl);
  }
  async listarImagens(): Promise<void> {
    if (this.canvasselect.id) {
      this.loadedImages = await this.is.getImagesByClient(this.canvasselect.id);
    }
  }
  async saveBackground(event: any): Promise<void> {
    const file = event.target.files[0];



    const downloadUrl = await this.is.uploadBackground(file, this.canvasselect.id);
      this.loadedBackground.push(downloadUrl);

  }

  async listarBackground(): Promise<void> {
    if (this.canvasselect.id) {
      this.loadedBackground = await this.is.getBackgroundByClient(this.canvasselect.id);
    }
  }

  SelectBackground(imageUrl: any){
    var canvas = this.canvas;
    var background = this.background;
    fabric.Image.fromURL(imageUrl, function(img) {
      // add background image
      canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
        scaleX: canvas.width! / img.width!,
        scaleY: canvas.height! / img.height!
      });
      background = imageUrl;
    });
    this.background = imageUrl;
  }
  onColorChange(event: any) {

    const color = event.target.value;
    this.canvas.setBackgroundImage(undefined!, this.canvas.renderAll.bind(this.canvas));
    this.canvas.backgroundImage = undefined;
    this.canvas.renderAll();
    this.canvas.setBackgroundColor(color, this.canvas.renderAll.bind(this.canvas));
    this.canvas.renderAll();
    console.log(color);
    this.background = color;
  }
  onColorChangeBuild(color: any) {

    this.canvas.setBackgroundImage(undefined!, this.canvas.renderAll.bind(this.canvas));
    this.canvas.backgroundImage = undefined;
    this.canvas.renderAll();
    this.canvas.setBackgroundColor(color, this.canvas.renderAll.bind(this.canvas));
    this.canvas.renderAll();
    console.log(color);
    this.background = color;
  }
  SelectColorPadron(){
    var canvas = this.canvas;
    const imageUrl = '../assets/img.png'
    var background = this.background;

    fabric.Image.fromURL(imageUrl, function(img) {
      // add background image
      canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
        scaleX: canvas.width! / img.width!,
        scaleY: canvas.height! / img.height!
      });
      background = imageUrl;
    });
    this.background = 'marca';

  }

  changeColor(obj:any){

    const dialogRef = this.dialog.open(ModalColorComponent, {
      width: '400px', // Defina a largura desejada para o modal
      data: { color: '' } // Passe os dados para o modal, como o valor inicial da venda
    });

    dialogRef.afterClosed().subscribe({
      next: (result:any) => {
        if (result) {
          if(result.color == "marca"){
            const imageUrl = '../assets/img.png';

            obj.set('fill', '');
            // Definindo a cor da borda
            obj.set('stroke', '#20af3e'); // Vermelho

            // Definindo a largura da borda
            obj.set('strokeWidth', 1); // Largura de 2 pixels            this.canvas.renderAll();

          }if(result.color == "nenhuma"){

            obj.set('fill', '');
            // Definindo a cor da borda
            obj.set('stroke', '#000000'); // Vermelho

            // Definindo a largura da borda
            obj.set('strokeWidth', 1); // Largura de 2 pixels
            this.canvas.renderAll();

          }else{
            obj.set('fill', result.color);
            this.canvas.renderAll();

          }
        }
      },
      error: (e:any) =>{
        console.log(e);
      }
    });
  }

  afterSave(){
     this.GetdPNG().then((r)=>{
      this.salvarCanvas(r);
    }).catch((e)=>{
      console.log(e);
     });

  }
  salvarCanvas(url:string): void {
    const savedCanvas: Canvas = {
      id: this.canvasselect.id,
      name: this.canvasselect.name || 'teste',
      description: this.canvasselect.description || 'teste',
      width: this.canvasselect.width || 0,
      height: this.canvasselect.height || 0,
      background: this.background || '',
      components: [],
    };

    this.canvas.getObjects().forEach(obj => {
      let component: Components = {
        name: obj.type || '',
        left: obj.left || 0,
        top: obj.top || 0,
        radius: obj instanceof fabric.Circle ? obj.radius : 0,
        rx: obj instanceof fabric.Ellipse ? obj.rx : 0,
        ry: obj instanceof fabric.Ellipse ? obj.ry : 0,
        fill: obj.fill || '',
        image_url: obj instanceof fabric.Image ? obj.getSrc() : '',
        stroke: obj.stroke || '',
        strokeWidth: obj.strokeWidth || 0,
        scaleY: obj.scaleY || 0,
        scaleX: obj.scaleX || 0,
        imageUrl: obj instanceof fabric.Image ? obj.getSrc() : '',
        fontFamily: obj instanceof fabric.Text ? obj.fontFamily : '',
        fontSize: obj instanceof fabric.Text ? obj.fontSize : 0,
        text: obj instanceof fabric.Text ? obj.text : '',
        width: obj.width || 0,
        height: obj.height || 0,
        group: [] // Inicialize a propriedade do grupo como um array vazio
      };

      if (obj instanceof fabric.Group) {
        const groupObjects: Components[] = [];

        obj._objects.forEach(groupObj => {
          console.log(obj);
          console.log(obj._objects);
          console.log(groupObj.top);
          console.log(groupObj.left);





          // Crie um componente para cada objeto do grupo e adicione-o ao array do grupo
          const groupComponent: Components = {
            name: groupObj.type || '',
            left: obj.left || 0,
            top: obj.top || 0,
            radius: groupObj instanceof fabric.Circle ? groupObj.radius : 0,
            rx: groupObj instanceof fabric.Ellipse ? groupObj.rx : 0,
            ry: groupObj instanceof fabric.Ellipse ? groupObj.ry : 0,
            fill: groupObj.fill || '',
            image_url: groupObj instanceof fabric.Image ? groupObj.getSrc() : '',
            stroke: groupObj.stroke || '',
            strokeWidth: groupObj.strokeWidth || 0,
            scaleY: groupObj.scaleY || 0,
            scaleX: groupObj.scaleX || 0,
            imageUrl: groupObj instanceof fabric.Image ? groupObj.getSrc() : '',
            fontFamily: groupObj instanceof fabric.Text ? groupObj.fontFamily : '',
            fontSize: groupObj instanceof fabric.Text ? groupObj.fontSize : 0,
            text: groupObj instanceof fabric.Text ? groupObj.text : '',
            width: groupObj.width || 0,
            height: groupObj.height || 0,
            group: [] // Inicialize a propriedade do grupo como um array vazio (caso haja grupos aninhados)

          };

          groupObjects.push(groupComponent);
        });

        // Atribua o array de componentes do grupo à propriedade do grupo no componente atual
        component.group = groupObjects;
      }

      savedCanvas.components!.push(component);
    });

    console.log(savedCanvas);
    this.saveCanvas(savedCanvas);
  }

  saveCanvas(canvas: Canvas): void {
    if (canvas.id) {
      this.checkCanvasExists(canvas.id)
        .then((exist) => {
          if (exist) {
            console.log('Canvas already exists. Updating...');
            this.updateCanvas(canvas);
          } else {
            console.log('Canvas does not exist. Creating...');
            this.createCanvas(canvas);
          }
        })
        .catch((error:any) => {
          console.error('Error checking canvas existence:', error);
        });
    } else {
      console.log('Canvas ID not provided. Creating...');
      this.createCanvas(canvas);
    }
  }

  createCanvas(canvas: Canvas): void {
    this.firestore.collection('canvas').add(canvas)
      .then((docRef) => {
        console.log('Canvas created successfully! Document ID:', docRef.id);
        this.saveComponents(docRef.id, canvas.components!);
      })
      .catch((error) => {
        console.error('Error creating canvas:', error);
      });
  }

  updateCanvas(canvas: Canvas): void {
    this.firestore.collection('canvas').doc(canvas.id!).set(canvas)
      .then(() => {
        console.log('Canvas updated successfully!');
        this.saveComponents(canvas.id!, canvas.components!);
      })
      .catch((error) => {
        console.error('Error updating canvas:', error);
      });
  }

  saveComponents(canvasId: string, components: Components[]): void {
    const componentsData = components.map((component) => ({ ...component }));

    this.firestore.collection('canvas').doc(canvasId).update({ components: componentsData })
      .then(() => {
        console.log('Components saved successfully!');
      })
      .catch((error) => {
        console.error('Error saving components:', error);
      });
  }

  async checkCanvasExists(canvasId: string):Promise<any> {
    console.log('verificando...')
    try {
      const docSnapshot = await this.firestore.collection('canvas').doc(canvasId).get().toPromise();
      return docSnapshot!.exists; // Canvas exists if the document snapshot exists
    } catch (error) {
      console.error('Error checking canvas existence:', error);
      throw error;
    }
  }

  deleteObject(eventData: any, transform: any, x:any, y:any) {
    const target = transform.target;
    const canvas = target.canvas;
    canvas.remove(target);
    canvas.requestRenderAll();
    return true;
  }

  renderIcon(
    ctx: CanvasRenderingContext2D,
    left: number,
    top: number,
    styleOverride: any,
    fabricObject: fabric.Object
  ): void {
    const size = fabricObject.cornerSize || 24;
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle!));
    ctx.drawImage(this.img, -size / 2, -size / 2, size, size);
    ctx.restore();
  }


  async GetdPNG(): Promise<string> {
    try {
      const dataURL = this.canvas.toDataURL({
        format: 'image/png',
        quality: 1,
      });
      const blob = await this.dataURLtoBlob(dataURL);
      const downloadUrl = await this.is.uploadUrlImage(blob, this.canvasselect.id);
      console.log('URL de download da imagem:', downloadUrl);
      return downloadUrl;
    } catch (error) {
      console.error('Erro ao gerar ou fazer upload da imagem:', error);
      throw error;
    }
  }

// Função auxiliar para converter data URL em blob
  async dataURLtoBlob(dataurl: string): Promise<Blob> {
    const response = await fetch(dataurl);
    const blob = await response.blob();
    return blob;
  }




  dataURLtoFile(dataURL: string): File {
    const parts = dataURL.split(',');
    const mimeType = parts[0].match(/:(.*?);/)![1];
    const b64Data = atob(parts[1]);
    let n = b64Data.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = b64Data.charCodeAt(n);
    }
     const fileName = `image_${Date.now()}.png`;

     return new File([u8arr], fileName, { type: mimeType });
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

