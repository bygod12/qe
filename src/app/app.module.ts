import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { CanvasComponent } from './canvas/canvas.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatToolbarModule} from "@angular/material/toolbar";
import {NgForOf, NgIf} from "@angular/common";
import {PopoverModule} from "ngx-popover";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatMenuModule} from "@angular/material/menu";
import { TesteBrushComponent } from './toolbar/testes/teste-brush/teste-brush.component';
import { FormasComponent } from './formas/formas.component';
import {MatDialogModule} from "@angular/material/dialog";
import {AngularFireModule} from "@angular/fire/compat";
import {environment} from "../environments/environment";
import {AngularFireAuthModule} from "@angular/fire/compat/auth";
import {AngularFirestoreModule} from "@angular/fire/compat/firestore";
import {AngularFireStorageModule} from "@angular/fire/compat/storage";
import {AngularFireDatabaseModule} from "@angular/fire/compat/database";
import { ClienteComponent } from './cliente/cliente.component';
import {ActivatedRoute, RouterModule} from "@angular/router";
import {AppRoutingModule} from "./app-routing.module";
import { ModalImageComponent } from './modal-image/modal-image.component';
import { ModalTextComponent } from './modal-text/modal-text.component';
import { ModalColorComponent } from './modal-color/modal-color.component';
import { ModalImageChangeComponent } from './modal-image-change/modal-image-change.component';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {QuadroComponent} from "./dashboard/quadro/quadro.component";
import { CancasTesteComponent } from './canvas/cancas-teste/cancas-teste.component';
import { TableComponent } from './table/table.component';
import { ProfileComponent } from './profile/profile.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { CanvasSmallComponent } from './canvas-small/canvas-small.component';
import {MatCardModule} from "@angular/material/card";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatTableModule} from "@angular/material/table";
import {MatInputModule} from "@angular/material/input";

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    CanvasComponent,
    TesteBrushComponent,
    FormasComponent,
    ClienteComponent,
    ModalImageComponent,
    ModalTextComponent,
    ModalColorComponent,
    ModalImageChangeComponent,
    DashboardComponent,
    QuadroComponent,
    CancasTesteComponent,
    TableComponent,
    ProfileComponent,
    NavBarComponent,
    CanvasSmallComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatButtonModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    NgForOf,
    MatDialogModule,
    NgIf,
    FormsModule,
    MatMenuModule,
    FormsModule,
    MatButtonModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    AppRoutingModule,
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatCardModule,
    NgIf,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatTableModule,
    MatInputModule


  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
