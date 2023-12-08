import { Component } from '@angular/core';
import { JobProcessService } from './job-process.service';
import { MessageService } from 'primeng/api';
import { BeepserviceService } from 'src/app/services/beepservice.service';
@Component({
  selector: 'app-job-process',
  templateUrl: './job-process.component.html',
  styleUrls: ['./job-process.component.css'],
  providers :[MessageService,BeepserviceService]
  // styles: [`
  //   :host { display: block; margin: .5em; }
  // `]
})
export class JobProcessComponent extends JobProcessService{
  
}
