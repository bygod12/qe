import {Component, EventEmitter, Input, Output} from '@angular/core';
import {fabric} from 'fabric';
import {FormasComponent} from "../formas/formas.component";
import {MatDialog} from "@angular/material/dialog";
import {saveAs} from "file-saver";
import {ModalImageChangeComponent} from "../modal-image-change/modal-image-change.component";

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent {
  @Input() canvas!: fabric.Canvas;
  @Input() objects!: any[];
  @Input() background!: any;
  @Input() components!: any[];

  selectionToolActive: boolean = false;
  cropToolActive: boolean = false;
  brushToolActive: boolean = false;
  popoverVisible: boolean = false;
  private isDrawingMode: boolean = false;
  private stampMode: boolean = false;
  @Output() textAdded = new EventEmitter<fabric.IText>();
  private textMode: boolean = false;
  private cloneStampEnabled: boolean = false;
  private cloneStampSource!: any;
  // Alterando os nomes das variáveis para ficar mais claro
  private canvasStates: any[] = []; // Array de strings JSON que representam os estados do canvas
  private canvasObjects: fabric.Object[] = []; // Array de objetos que correspondem aos estados do canvas
  private currentStateIndex: number = -1; // Índice do estado atual do canvas
  private action: boolean = false; // Flag para indicar se está fazendo undo ou redo
  private refresh: boolean = true; // Flag para indicar se precisa atualizar o estado do canvas

  constructor(public dialog: MatDialog) {
  }

  ngOnInit() {
    // Configuração inicial da ferramenta de seleção
    this.canvas.isDrawingMode = false;
    this.canvas.selection = false;

    // Configuração inicial da ferramenta de corte
    this.canvas.hoverCursor = 'default';
    this.canvas.on('object:added', this.handleObjectAdded.bind(this));
    this.canvas.on('object:modified', this.handleObjectModified.bind(this));
    this.activateSelectionTool();
    // Salvando o estado inicial do canvas
    this.saveCanvasState();
    // Resto do código...
  }

  handleObjectAdded() {
    this.saveCanvasState();
  }

  handleObjectModified() {
    this.saveCanvasState();
  }

  saveCanvasState() {
    // Salva o estado atual do canvas usando toDatalessJSON()
    const json = this.canvas.toDatalessJSON();
    this.canvasStates.push((json));
    this.currentStateIndex++;
  }

  undo() {
    if (this.currentStateIndex <= 0) {
      console.log('undo');
      return;
    }
    this.currentStateIndex--;
    const json = this.canvasStates[this.currentStateIndex];
    this.canvas.loadFromJSON(json, () => {
      this.canvas.renderAll();
    });
  }

  redo() {
    if (this.currentStateIndex >= this.canvasStates.length - 1) {
      return;
    }
    this.currentStateIndex++;
    const json = this.canvasStates[this.currentStateIndex];
    this.canvas.loadFromJSON(json, () => {
      this.canvas.renderAll();
    });
  }


  textModeActive() {
    this.brushToolActive = false;
    this.selectionToolActive = false;
    this.cropToolActive = false;
    this.isDrawingMode = false;
    this.textMode = true;
    this.canvas.isDrawingMode = false;


    this.stampMode = false;
  }

  addTextToCanvas() {
    this.textModeActive();
    this.canvas.off('mouse:up');
    this.canvas.off('mouse:down');
    this.canvas.off('mouse:move');
    this.activateSelectionTool();

    var textdd = this.textAdded;
    var canvas = this.canvas;
    var objetos = this.objects;
    console.log('text');
    this.canvas.on('mouse:down', function (e) {
      var pointer = canvas.getPointer(e.e);
      const text = new fabric.IText('Digite seu texto', {
        left: pointer.x,
        top: pointer.y,
      });
      console.log(text);
      canvas.add(text);
      objetos.push(text);
      textdd.emit(text);
      canvas.off('mouse:down');

    });
  }

  addTextToCanvasCode() {
    this.textModeActive();
    this.canvas.off('mouse:up');
    this.canvas.off('mouse:down');
    this.canvas.off('mouse:move');
    this.activateSelectionTool();

    var textdd = this.textAdded;
    var canvas = this.canvas;
    var objetos = this.objects;
    console.log('text');
    this.canvas.on('mouse:down', function (e) {
      var pointer = canvas.getPointer(e.e);
      const text = new fabric.IText('<<Digite_seu_texto>>', {
        left: pointer.x,
        top: pointer.y,
      });
      console.log(text);
      canvas.add(text);
      objetos.push(text);
      textdd.emit(text);
      canvas.off('mouse:down');

    });
  }

  deleteSelectedObjects() {
    const selectedObjects = this.canvas.getActiveObjects();
    if (selectedObjects.length > 0) {
      selectedObjects.forEach(obj => {
        this.canvas.remove(obj);
      });
      this.canvas.discardActiveObject();
      this.canvas.renderAll();

    }
  }

  activateSelectionTool() {
    this.selectionToolActive = true;
    this.cropToolActive = false;
    this.brushToolActive = false;
    this.isDrawingMode = false;
    this.textMode = false;
    this.canvas.off('mouse:up');
    this.canvas.off('mouse:down');
    this.canvas.off('mouse:move');
    this.stampMode = false;
    this.canvas.isDrawingMode = false;
    this.canvas.selection = true;
    this.canvas.hoverCursor = 'move';

  }

  activateCropTool() {
    this.cropToolActive = true;
    this.selectionToolActive = false;
    this.brushToolActive = false;
    this.isDrawingMode = false;
    this.textMode = false;
    this.canvas.off('mouse:up');
    this.canvas.off('mouse:down');
    this.canvas.off('mouse:move');
    this.stampMode = false;
    this.canvas.hoverCursor = 'crop';
    this.canvas.selection = true;
    this.canvas.isDrawingMode = false;

  }


  activateBrushTool() {
    this.brushToolActive = true;
    this.selectionToolActive = false;
    this.cropToolActive = false;
    this.isDrawingMode = false;
    this.textMode = false;

    this.canvas.off('mouse:up');
    this.canvas.off('mouse:down');
    this.canvas.off('mouse:move');
    this.stampMode = false;
    this.canvas.isDrawingMode = true;
    this.canvas.selection = false;
    this.canvas.hoverCursor = 'default';
    this.canvas.isDrawingMode = true;
    this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas)

  }

  activateStampMode() {
    this.canvas.off('mouse:up');
    this.canvas.off('mouse:down');
    this.canvas.off('mouse:move');
    this.canvas.isDrawingMode = false;
    this.canvas.selection = false;
    this.stampMode = true;
    this.canvas.defaultCursor = 'crosshair';
    this.selectionRect();
  }

  selectionRect() {
    var objetos = this.objects;
    var selectionRect: fabric.Rect | null;
    var canvas = this.canvas;
// Definir uma variável para armazenar as coordenadas iniciais do mouse
    var startX = 0;
    var startY = 0;

// Adicionar um evento de mouse:down ao canvas
    canvas.on('mouse:down', function (e) {
      // Obter as coordenadas do mouse em relação ao canvas
      var pointer = canvas.getPointer(e.e);
      startX = pointer.x;
      startY = pointer.y;

      // Criar um objeto fabric.Rect e adicioná-lo ao canvas
      selectionRect = new fabric.Rect({
        left: startX,
        top: startY,
        width: 0,
        height: 0,
        fill: 'transparent',
        stroke: 'blue',
        strokeWidth: 2
      });
      canvas.add(selectionRect);
    });

// Adicionar um evento de mouse:move ao canvas
    canvas.on('mouse:move', function (e) {
      // Verificar se o retângulo de seleção existe
      if (selectionRect) {
        // Obter as coordenadas do mouse em relação ao canvas
        var pointer = canvas.getPointer(e.e);
        var endX = pointer.x;
        var endY = pointer.y;

        // Calcular a largura e a altura do retângulo de seleção
        // Calcular a largura e a altura do retângulo de seleção
        var width = endX - startX;
        var height = endY - startY;

        // Verificar se o movimento do mouse é para a esquerda ou para cima
        if (width < 0) {
          // Ajustar a propriedade left do retângulo de seleção
          selectionRect.set({left: endX});
        }
        if (height < 0) {
          // Ajustar a propriedade top do retângulo de seleção
          selectionRect.set({top: endY});
        }

        // Atualizar as propriedades width e height do retângulo de seleção
        selectionRect.set({
          width: Math.abs(width),
          height: Math.abs(height)
        });
        // Renderizar o canvas novamente para mostrar as mudanças
        canvas.renderAll();
      }
    });
    console.log("-------------------");

    // Adicionar um evento de mouse:up ao canvas
    canvas.on('mouse:up', function (e) {

      // Remover o retângulo de seleção do canvas
      if (selectionRect != null) {
        // Obter um array de todos os objetos do canvas
        var objects = canvas.getObjects();
        console.log("================================");
        // Criar um array vazio para armazenar os objetos selecionados


        console.log(objects);

        var selectedObjects: fabric.Object[] = [];

        // Iterar sobre os objetos do canvas
        objects.forEach(obj => {
          if (obj.left != selectionRect!.left &&
            obj.top != selectionRect!.top &&
            obj.width != selectionRect!.width &&
            obj.fill != selectionRect!.fill &&
            obj.stroke != selectionRect!.stroke &&
            obj.strokeWidth != selectionRect!.strokeWidth) {


            console.log(obj.left != selectionRect!.left &&
              obj.top != selectionRect!.top &&
              obj.width != selectionRect!.width &&
              obj.fill != selectionRect!.fill &&
              obj.stroke != selectionRect!.stroke &&
              obj.strokeWidth != selectionRect!.strokeWidth);
            console.log(obj);
            // Verificar se o objeto atual está na área do retângulo de seleção

            if (
              (obj!.left! >= selectionRect!.left! &&
                obj!.top! >= selectionRect!.top! &&
                obj!.left! + obj.width! <= selectionRect!.left! + selectionRect!.width! &&
                obj!.top! + obj.height! <= selectionRect!.top! + selectionRect!.height!) ||
              selectionRect!.intersectsWithObject(obj)
            ) {
              console.log(selectionRect!.intersectsWithObject(obj));
              // Adicionar o objeto atual ao array de objetos selecionados
              selectedObjects.push(obj);

              // Definir uma função para calcular a distância entre dois pontos
              function distance(x1: any, y1: any, x2: any, y2: any) {
                // Usar o teorema de Pitágoras para obter a distância
                return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
              }

              // Obter as coordenadas do centro do selectionRect
              var selectionRectCenterX = selectionRect!.left! + selectionRect!.width! / 2;
              var selectionRectCenterY = selectionRect!.top! + selectionRect!.height! / 2;

              // Obter as coordenadas do centro do objects[i]
              var objectCenterX = obj!.left! + obj!.width! / 2;
              var objectCenterY = obj!.top! + obj!.height! / 2;

              // Calcular a distância entre os centros dos objetos
              var dist = distance(selectionRectCenterX, selectionRectCenterY, objectCenterX, objectCenterY);

              // Mostrar no console a distância
              console.log(dist);
              if (obj.type == 'image' || obj.type == 'i-text') {
                objetos.push(obj)
              }


            }
          }
        })


        // Mostrar no console os objetos selecionados
        console.log(selectedObjects)

        // Remover o retângulo de seleção do canvas
        var a = canvas.remove(selectionRect);
        canvas.fxRemove(selectionRect);
        canvas._onObjectRemoved(selectionRect);
        selectionRect = null;

        canvas.renderAll();

        canvas.off('mouse:up');
        canvas.off('mouse:down');
        canvas.off('mouse:move');

        canvas.on('mouse:up', (e: fabric.IEvent) => {
          const clickX = e.pointer!.x;
          const clickY = e.pointer!.y;

          selectedObjects.forEach(obj => {
            obj.clone(function (clonedObject: any) {
              // Fazer algo com o objeto clonado
              // Por exemplo, mudar a posição e adicionar ao canvas
              const deltaX = clickX - obj.left! - obj.width! / 2;
              const deltaY = clickY - obj.top! - obj.height! / 2;

              clonedObject.set({
                left: obj.left! + deltaX,
                top: obj.top! + deltaY,
                width: obj.width! + 10.4,
                height: obj.height! + 10.4,
              });

              canvas.add(clonedObject);
            });

          });
        });
      }
    });

  }


  changeForma() {

    const dialogRef = this.dialog.open(FormasComponent, {
      width: '100px', // Defina a largura desejada para o modal
      data: {forma: ''} // Passe os dados para o modal, como o valor inicial da venda
    });

    dialogRef.afterClosed().subscribe({
      next: (result: any) => {
        if (result) {
          console.log('Valor da venda:', result.valor);
          switch (result.forma) {
            case 'Círculo':
              const circle = new fabric.Circle({
                left: 100,
                top: 100,
                radius: 50,
                fill: 'red'
              });
              this.components.push(circle);
              this.canvas.add(circle);
              break;
            case 'Elipse':
              const ellipse = new fabric.Ellipse({
                left: 100,
                top: 100,
                rx: 50,
                ry: 30,
                fill: 'red'
              });
              this.components.push(ellipse);

              this.canvas.add(ellipse);

              break;
            case 'Retângulo':
              const rect = new fabric.Rect({
                left: 100,
                top: 100,
                width: 150,
                height: 100,
                fill: 'purple'
              });
              this.components.push(rect);
              this.canvas.add(rect);
              break;
            case 'Triângulo':
              const triangle = new fabric.Triangle({
                left: 100,
                top: 100,
                width: 100,
                height: 100,
                fill: 'red'
              });
              this.components.push(triangle);

              this.canvas.add(triangle);
              break;
          }
        }
      },
      error: (e: any) => {
        console.log(e);
      }
    });
  }



  downloadPNG() {
    const dataURL = this.canvas.toDataURL({
      format: 'image/png',
      quality: 1,
    });
    const blob = this.dataURLToBlob(dataURL);
    saveAs(blob, 'canvas.png');
  }

  dataURLToBlob(dataURL: string): Blob {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type: mime});
  }

  downloadSVG() {
    const svgData = this.canvas.toSVG();
    const blob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
    saveAs(blob, 'canvas.svg');
  }

  activateBackgroundTool() {
    this.canvas.off('mouse:up');
    this.canvas.off('mouse:down');
    this.canvas.off('mouse:move');
    this.canvas.isDrawingMode = false;
    this.canvas.selection = false;
    this.stampMode = true;
    this.canvas.defaultCursor = 'crosshair';
    this.SelectBackground();
  }

  SelectBackground() {
    var canvas = this.canvas;
    this.canvas.on('mouse:down', (event: fabric.IEvent) => {
      const target = event.target;

      // Verifica se o alvo do clique é uma imagem
      if (target && target.type === 'image') {
        const clickedImage = target as fabric.Image;
// Redimensiona a imagem para o tamanho do canvas
        clickedImage.scaleToWidth(canvas.width!);
        clickedImage.scaleToHeight(canvas.height!);
        // Chama a função para definir a imagem como plano de fundo
        const centerX = canvas.width! / 2;
        const centerY = canvas.height! / 2;

// Subtrai metade da largura e da altura da imagem
        const imageWidth = clickedImage.getScaledWidth();
        const imageHeight = clickedImage.getScaledHeight();

        clickedImage.set({
          left: (centerX - imageWidth / 2),
          top: (centerY - imageHeight / 2)
        });
        this.canvas.setBackgroundImage(clickedImage, this.canvas.renderAll.bind(this.canvas));
        this.background = clickedImage;
        this.canvas.remove(clickedImage);
        this.canvas.renderAll();
        this.canvas.off('mouse:down');
        this.activateSelectionTool();
      }
    });
  }

  FormaImage() {
    const dialogRef = this.dialog.open(ModalImageChangeComponent, {
      width: '300px', // Defina a largura desejada para o modal
      data: {currentText: ''} // Passe os dados para o modal, como o valor inicial da venda
    });

    dialogRef.afterClosed().subscribe({
      next: (result: any) => {
        if (result) {
          const rect = new fabric.Rect({
            left: 100,
            top: 100,
            width: 100,
            height: 100,
            fill: 'red'
          });

          const text = new fabric.Text('<<image_'+result.value+'>>', {
            left: rect.left! + rect.width! / 2,
            top: rect.top! + rect.height! / 2,
            fontSize: 16,
            fill: 'white',
            originX: 'center',
            originY: 'center',
            selectable: false

          });

          rect.set('stroke', '#20af3e');
          rect.set('strokeWidth', 1);

          // Adicionando o texto como um objeto filho do retângulo


          const group = new fabric.Group([rect, text]);
          this.canvas.add(group);
        }

      },error: (e) =>{
        console.log(e);
      }
    });

  }

}
