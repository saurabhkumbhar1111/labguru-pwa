import { Component } from '@angular/core';
import { JobProcessService } from './job-process.service';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-job-process',
  templateUrl: './job-process.component.html',
  styleUrls: ['./job-process.component.css'],
  providers :[MessageService]
  // styles: [`
  //   :host { display: block; margin: .5em; }
  // `]
})
export class JobProcessComponent extends JobProcessService{
  
}
