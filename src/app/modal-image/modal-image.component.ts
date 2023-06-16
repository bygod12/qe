import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-modal-image',
  templateUrl: './modal-image.component.html',
  styleUrls: ['./modal-image.component.css']
})
export class ModalImageComponent {
  newImageSrc: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { currentImageSrc: string },
    public dialogRef: MatDialogRef<ModalImageComponent>
  ) {
    this.newImageSrc = data.currentImageSrc;
  }

  save(): void {
    // Aqui você pode adicionar a lógica para salvar a nova imagem
    this.dialogRef.close(this.newImageSrc);
  }

}
