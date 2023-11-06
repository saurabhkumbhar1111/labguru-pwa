import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SidebarComponent } from 'src/app/shared/components/sidebar/sidebar.component';

const routes: Routes = [
  { path: '', redirectTo: 'work_area', pathMatch: "full" },
  {
    path: 'work_area', component: AdminComponent, children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: DashboardComponent }
    ],
  },
];

@NgModule({
  declarations: [AdminComponent, DashboardComponent, SidebarComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class AdminModule { }
