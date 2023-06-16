import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-modal-image-change',
  templateUrl: './modal-image-change.component.html',
  styleUrls: ['./modal-image-change.component.css']
})
export class ModalImageChangeComponent {
  newText: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { currentText: string },
    public dialogRef: MatDialogRef<ModalImageChangeComponent>
  ) {
    this.newText = data.currentText;
  }

  save(): void {
    // Aqui você pode adicionar a lógica para salvar o novo texto
    this.dialogRef.close({value: this.newText});
  }
}
