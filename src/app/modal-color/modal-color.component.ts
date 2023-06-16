import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-modal-color',
  templateUrl: './modal-color.component.html',
  styleUrls: ['./modal-color.component.css']
})
export class ModalColorComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { color:string },
              public dialogRef: MatDialogRef<ModalColorComponent>,) {}
  save(color:string): void {
    // Aqui você pode adicionar a lógica para registrar o valor da venda

    this.dialogRef.close({ color: color});
  }
  saveevent(event:any): void {
    // Aqui você pode adicionar a lógica para registrar o valor da venda
    const color = event.target.value;

    this.dialogRef.close({ color: color});
  }
}
