import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanvasComponent } from "./canvas/canvas.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import {ProfileComponent} from "./profile/profile.component";
import {TableComponent} from "./table/table.component";

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: '', component: DashboardComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'table', component: TableComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
