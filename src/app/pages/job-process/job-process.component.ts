import { Component } from '@angular/core';
import { JobProcessService } from './job-process.service';

@Component({
  selector: 'app-job-process',
  templateUrl: './job-process.component.html',
  styleUrls: ['./job-process.component.css'],
  // styles: [`
  //   :host { display: block; margin: .5em; }
  // `]
})
export class JobProcessComponent extends JobProcessService{
  
}
