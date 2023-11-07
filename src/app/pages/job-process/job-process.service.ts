import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JobProcessService {
  Location:string='';
  Department:string='';
  Process:string='';
  message:string='Die Cutting Model Checking Ditching Die Preparation';
  isNextEnabled : boolean = false;
  isSettingEnabled :boolean = true;
  isFooterEnabled :boolean = true;
   Donemessage : string = "Process Success";
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
  cities:any=[];
  selectedCity: string='';
  selectedDepartment: string='';
  selectedProcess: string='';

  ngOnInit() {
      this.cities = [
          { name: 'New York', code: 'NY' },
          { name: 'Rome', code: 'RM' },
          { name: 'London', code: 'LDN' },
          { name: 'Istanbul', code: 'IST' },
          { name: 'Paris', code: 'PRS' }
      ];
  }

  items:any=[];
  selectedItem: any;
  suggestions: any=[];

  search(event: any) {
      this.suggestions = [...Array(10).keys()].map(item => event.query + '-' + item);
  }
  impressionNo :string ='';
  arrayOfImpNo : any =[];
  addImpressionNo(){
   this.arrayOfImpNo.push(this.impressionNo);
   this.impressionNo = '';
   console.log(this.arrayOfImpNo);
  }

  clearArray(){
    this.arrayOfImpNo = [];
    this.isSettingEnabled  = true;
    this.isFooterEnabled = true;
    this.isNextEnabled =false;

  }

  deleteModal(){}
  step1:boolean=true ;
  step2:boolean=false;
  step3: boolean =false;
  nextStep(stepnumber:any){
  if (stepnumber=='1') {
    this.step1=true;
    this.step2 =false;
  } else if(stepnumber=='2') {
      this.step2=true;
      this.step1= false;
  }else if(stepnumber=='3'){
   this.step3==true;
  }
  }
}
