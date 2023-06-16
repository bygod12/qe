import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";

@Injectable({
  providedIn: 'root'
})
export class CanvasService {
  private canvasCollection: AngularFirestoreCollection<Canvas>;

  constructor(private firestore: AngularFirestore) {
    this.canvasCollection = this.firestore.collection<Canvas>('canvas');
  }

  getCanvas(id: string): Observable<Canvas | undefined> {
    return this.canvasCollection.doc<Canvas>(id).valueChanges();
  }

  getCanvasList(): Observable<Canvas[]> {
    return this.canvasCollection.valueChanges({ idField: 'id' });
  }

  createCanvas(canvas: Canvas): Promise<void> {
    const id = this.firestore.createId();
    canvas.id = id;
    return this.canvasCollection.doc(id).set(canvas);
  }

  updateCanvas(canvas: Canvas): Promise<void> {
    return this.canvasCollection.doc(canvas.id).update(canvas);
  }

  deleteCanvas(id: string): Promise<void> {
    return this.canvasCollection.doc(id).delete();
  }
}
