import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobProcessComponent } from './job-process.component';
import { RouterModule, Routes } from '@angular/router';
import { ArchwizardModule } from 'angular-archwizard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
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
    ArchwizardModule,
    ArchwizardModule,
    ReactiveFormsModule,
    FormsModule,
    DropdownModule,
    ConfirmDialogModule,
    ToastModule,
    AutoCompleteModule,
    ZXingScannerModule
  ]
})
export class JobProcessModule { }
