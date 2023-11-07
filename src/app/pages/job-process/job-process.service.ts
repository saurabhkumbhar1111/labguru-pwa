import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JobProcessService {
  Location:string='';
  Department:string='';
  Process:string='';
  message:string='Die Cutting Model Checking Ditching Die Preparation';

  constructor() { 
    this.Location='Mumbai';
    this.Department='Crown & Bridge';
    this.Process='Die cutting';
  }

  finishFunction(){}  // wizardSteps: Array<Object>;
  openModal(modelid:string){
    const modelDiv = document.getElementById(modelid);
    if(modelDiv != null){
      modelDiv.style.display = 'block';
    }
  }
  closeModal(modelid:string){
    const modelDiv = document.getElementById(modelid);
    if(modelDiv != null){
      modelDiv.style.display = 'none';
    }
  }
}
