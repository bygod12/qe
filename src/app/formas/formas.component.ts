import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-formas',
  templateUrl: './formas.component.html',
  styleUrls: ['./formas.component.css']
})
export class FormasComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { forma:string },    public dialogRef: MatDialogRef<FormasComponent>,) {}
  save(forma:string): void {
    // Aqui você pode adicionar a lógica para registrar o valor da venda

    this.dialogRef.close({ forma: forma});
  }


}
