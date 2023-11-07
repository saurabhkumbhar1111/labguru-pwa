import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobProcessComponent } from './job-process.component';
import { RouterModule, Routes } from '@angular/router';
import { ArchwizardModule } from 'angular-archwizard';

const routes: Routes = [
  {
    path: '',
    component: JobProcessComponent
  }
];

@NgModule({
  declarations: [JobProcessComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ArchwizardModule
  ]
})
export class JobProcessModule { }
