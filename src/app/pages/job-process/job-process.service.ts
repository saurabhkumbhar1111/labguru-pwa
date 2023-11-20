import { Injectable, ViewChild } from '@angular/core';
import {UtilsService} from '../../services/utils.service'
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ServerVariableService } from 'src/app/services/server-variable.service';
import { Deserialize } from 'cerialize';
import { CookieService } from 'ngx-cookie-service';
import { ThisReceiver } from '@angular/compiler';
import { BarcodeFormat } from '@zxing/library';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { Result } from '@zxing/library';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class JobProcessService {
  scanImp: boolean= true;
  @ViewChild('scanner') scanner: ZXingScannerComponent = new ZXingScannerComponent;
  isScannerEnabled = false;
  allowedFormats = [ BarcodeFormat.QR_CODE, BarcodeFormat.CODE_128, BarcodeFormat.DATA_MATRIX ];
  Location:string='';
  Department:string='';
  Process:string='';
  isNextEnabled : boolean = false;
  isSettingEnabled :boolean = true;
  isFooterEnabled :boolean = true;
   Donemessage : string = "Process Success";
  OrganizationUnitID: any;
  EmployeeID : any ; 
  DepartmentID: any;
  ProcessID: any;
  LocationID: any;
  arrayForDepartmentList: any[] = [];
  arrayForProcessList: any[] = [];
  arrayForLocationList: any[] = [];
  processJob: boolean =false;
  impressionNo :string ='';
  arrayOfImpNo : any =[];
  cities:any=[];
  selectedCity: string='';
  selectedDepartment: string='';
  selectedProcess: string='';
  arryforEmployee: any = [];
  employee: any;
  keyword: string;
  expiryCookiesDate: any;
  processing:string='';

  constructor(public http: HttpClient,public utilsService:UtilsService, public router: Router,private route: ActivatedRoute,private cookieService:CookieService,
    public serverVariableService: ServerVariableService,private messageService: MessageService) { 
    this.keyword = "name";
    this.getAllDropDownData();
    if(this.cookieService.get('employeeName')!=="undefined" && this.cookieService.get('employeeName')!==""){
      //console.log(this.cookieService.get('employeeName').split(' - '));
      this.getMockEmployee(this.cookieService.get('employeeName').split(' - ')[0],1);
      this.employee = this.arryforEmployee[0];
  }
  }
  getAllDropDownData() {
    const param ={
      'FinancialYearID' :166,
      'LoginCompanyID':1,
      'LoginReferenceID' :864,
      'LoginRoleID':1,
      'LoginUserID' : 1,
      'ModuleID' :0,
      'OrganizationUnitID':0,
      'SSCID':3033,
      'SituationID':1,
      'UserID':1
    }
 this.postDropdownData(param);

  }
  postDropdownData(data:any){
    return this.http.post(this.utilsService.serverVariableService.GetCommonList, data).subscribe(
      (response: any) => {
        this.arrayForDepartmentList = response.data.Department_DDL;
        this.arrayForLocationList =response.data.LineLocation;
        if(this.cookieService.get('LocationID')!=="undefined" && this.cookieService.get('LocationID')!==""){
            this.arrayForLocationList.filter((item)=>{if(item.id ==this.cookieService.get("LocationID")){
              this.LocationID = item;
              this.Location=JSON.stringify(this.LocationID.name).replace(/"/g, '');
            }});
        }
        if(this.cookieService.get('DepartmentID')!=="undefined" && this.cookieService.get('DepartmentID')!==""){
          this.arrayForDepartmentList.filter((item)=>{if(item.id ==this.cookieService.get("DepartmentID")){
            this.DepartmentID = item;
            this.Department=JSON.stringify(this.DepartmentID.name).replace(/"/g, '');
            this.onSelectDepartment();

          }});
      }
      },
      (error) => {
        //console.error('Error:', error);
      }
    );
  }
  onSelectDepartment() {
    this.ProcessID = null;
    this.processJob =true;
    // if(this.DepartmentID){
      const param = {
        'SSCID': 3033,
        'OrganizationUnitID': 0,
        'LoginUserID':1 ,
        'LoginReferenceID': 864,
        'LoginRoleID': 1,
        'LoginCompanyID': 1,
        'innerSituationID': 40,
        'ModuleID' :!this.utilsService.isNullUndefinedOrBlank(this.DepartmentID.id)?parseInt(this.DepartmentID.id):0
      };
     this.postProcess(param);
    }
    // }
    postProcess(data:any){
      return this.http.post(this.utilsService.serverVariableService.getAllDropDownDataAPI_new,data).subscribe(
        (response: any) => {
         this.arrayForProcessList =response.data.Data;
         if(this.cookieService.get('ProcessID')!=="undefined" && this.cookieService.get('ProcessID')!==""){
          this.arrayForProcessList.filter((item)=>{if(item.id ==this.cookieService.get("ProcessID")){
            this.ProcessID = item;
            this.Process=JSON.stringify(this.ProcessID.name).replace(/"/g, '');
  
          }});
      }
      },
        (error) => {
          //console.error('Error:', error);
        }
      );
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
  
  search(search :any) {
    this.getMockEmployee(search.query,0);
    }

    getMockEmployee(term:any,id:number){
      const param = {
        'Keyword': term,
        'SSCID': 9006,
        'OrganizationUnitID': 0,
        'LoginCompanyID':1,
        'LoginUserID':1,
        'LoginReferenceID':864, 
        'innerSituationID': 46
      };
      this.postData(param,id)
    }
    postData(data: any,id:number) {
      return this.http.post(this.utilsService.serverVariableService.GetJobEntry_CustomerAPI, data).subscribe(
        (response: any) => {
         this.arryforEmployee = [...response.data.Customer];
          if(id==1){
            this.employee = this.arryforEmployee[0];
          }
        },
        (error) => {
          //console.error('Error:', error);
        }
      );
      
    }
    selectedEmployee :any;
    onSelectEmployee(){
  this.selectedEmployee = this.arryforEmployee.find((item: { id: number; }) =>item.id ==this.employee.id)
 //console.log(this.selectedEmployee);
  
}

  addImpressionNo(){
   this.arrayOfImpNo.push(this.impressionNo);
   this.impressionNo = '';
   //console.log(this.arrayOfImpNo);
  }

  clearArray(){
    this.arrayOfImpNo = [];
    this.isSettingEnabled  = true;
    this.isFooterEnabled = true;
    this.isNextEnabled =false;
    this.SkipProcessListColln=[];
    this.AllValidationArrayColln=[];
    this.paramarray=[];
    this.impressionNo='';
    this.reworkProcessColln =[];
  }

  deleteModal(){}
  onSubmitSettingModal(){
    this.cookieService.set("LocationID",this.LocationID.id.toString(),this.expiryCookiesDate);
    this.cookieService.set("DepartmentID",this.DepartmentID.id.toString(),this.expiryCookiesDate);
    this.cookieService.set("ProcessID",this.ProcessID.id.toString(),this.expiryCookiesDate);
    !this.utilsService.isNullUndefinedOrBlank(this.employee) ? this.cookieService.set("employeeId",this.employee.id.toString(),this.expiryCookiesDate):'';
    !this.utilsService.isNullUndefinedOrBlank(this.employee) ?this.cookieService.set("employeeName",this.employee.name.toString(),this.expiryCookiesDate):'';
    this.Location=JSON.stringify(this.LocationID.name);
    this.Department=JSON.stringify(this.DepartmentID.name);
    this.Process=JSON.stringify(this.ProcessID.name);
  }

  validateProcess(){
    let ImpAdded = this.arrayOfImpNo.filter((item: string)=>item==this.impressionNo);
    if(ImpAdded.length>0){
      this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Impression already added' });
      return;
    }
    const param = {
      'SituationID': 0,
      'TransactionNumber': this.impressionNo,
      'ProcessID': !this.utilsService.isNullUndefinedOrBlank(this.ProcessID.id) ? this.ProcessID.id : 0
    };
    const formData = new FormData();
    formData.set('AutoProcess', JSON.stringify(param));
      return this.http.post(this.utilsService.serverVariableService.Validate_Process, formData).subscribe(
        (response: any) => {
          if(response.data.AutoProcess[0].Illigible){
            this.allValidation();
          }else{
            // alert('Not Illigible '+this.impressionNo);
            this.messageService.add({ severity: 'warn', summary: 'Warn', detail: ('Not Illigible '+this.impressionNo)});
            this.impressionNo = '';
          }
        },
        (error) => {
          //console.error('Error:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
        }
      );

  }

  ProductID:number=0;
  AllValidationArrayColln:any=[];
  AllValidationArray:any=[];
  allValidation(){
    const param = {
      'SituationID': 1,
      'TransactionNumber': this.impressionNo,
      'DepartmentID': !this.utilsService.isNullUndefinedOrBlank(this.DepartmentID.id) ? this.DepartmentID.id : 0
    };
    const formData = new FormData();
    formData.set('AutoProcess', JSON.stringify(param));
      return this.http.post(this.utilsService.serverVariableService.Validate_Process, formData).subscribe(
        (response: any) => {
          // //console.log(response.data.AutoProcess[0]);
          this.AllValidationArray = response.data.AutoProcess;
          for(let item of this.AllValidationArray){
            this.AllValidationArrayColln.push(item);
            // this.AllValidationArrayColln.length>0 ? this.AllValidationArrayColln[0].push(response.data.AutoProcess) : this.AllValidationArrayColln.push(response.data.AutoProcess)
          }
          //console.log('array1: ',this.AllValidationArray);
          //console.log('array2: ',this.AllValidationArrayColln);
          var AlertMsg = response.data.AutoProcess[0].AlertMsg;
          this.ProductID = response.data.AutoProcess[0].ProductID;
          if(AlertMsg.length<1){
            if(this.arrayOfImpNo.length>0){
              let ImpAdded = this.arrayOfImpNo.filter((item: string)=>item==this.impressionNo);
              if(ImpAdded.length>0){
                this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Impression already added' })
              }
              else{
                this.arrayOfImpNo.push(this.impressionNo);
                this.GetSkipProcess(); //next api call made
              }
            }else{
              this.arrayOfImpNo.push(this.impressionNo);
              this.GetSkipProcess(); //next api call made
            }
          }else{
            this.messageService.add({ severity: 'warn', summary: 'Warn', detail: AlertMsg });
            this.impressionNo = '';
          }
        },
        (error) => {
          //console.error('Error:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
        }
      );
  }

  ListOfSkipProcess:any=[];
  SkipProcessListColln:any=[];
  oldImpNo:string='';
  GetSkipProcess(){
    this.ListOfSkipProcess=[];
    const param = {
      'SituationID': 2,
      'TransactionNumber': this.impressionNo,
      'DepartmentID': !this.utilsService.isNullUndefinedOrBlank(this.DepartmentID.id) ? this.DepartmentID.id : 0,
      'ProcessID': !this.utilsService.isNullUndefinedOrBlank(this.ProcessID.id) ? this.ProcessID.id : 0,
      'ProductID': !this.utilsService.isNullUndefinedOrBlank(this.ProductID) ? this.ProductID : 0
    };
    const formData = new FormData();
    formData.set('AutoProcess', JSON.stringify(param));
    return this.http.post(this.utilsService.serverVariableService.Validate_Process, formData).subscribe(
      (response: any) => {
        //console.log(response.data);
        var SkipList = [];
        SkipList = response.data.AutoProcess;
        if(SkipList.length>0){
          for(let item of SkipList){
            this.SkipProcessListColln.push(item);
          }
          //console.log('skipcolln: ',this.SkipProcessListColln);
          SkipList.filter((item: { Process: any; })=> this.ListOfSkipProcess.push(item.Process));
          this.ListOfSkipProcess.pop();
          if(SkipList.length>1){
            this.openModal('messageModal');
          }else{
            this.openModal('confirmModal');
          }
          this.oldImpNo=this.impressionNo;
          this.impressionNo = '';
        }else{
          this.reworkProcessColln.push(...this.AllValidationArray);
          //console.log('reworkProcessColln:',this.reworkProcessColln);
          this.openModal('confirmModal');
          this.impressionNo = '';
        }
      },
      (error) => {
        //console.error('Error:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
      }
    );
  }

  paramarray:any=[];
  reworkProcessColln:any=[];
  async syncSubmit() {
    this.utilsService.loaderStart--;
    for(let item of this.AllValidationArrayColln){
      let temploop = this.SkipProcessListColln.filter((a: { Transactionnumber: any; })=>a.Transactionnumber==item.Transactionnumber);
      for(let item1 of temploop){
        await this.submit(item,item1);
      }
      this.utilsService.loaderStart = 0;
    }
    if(this.reworkProcessColln.length>0){
      this.submitReworkProcess();
    }
    //console.log('paramarray:',this.paramarray);
    this.messageService.add({ severity: 'success', summary: 'Success', detail: "Job Process Successfull ."});
    this.processing ='';
  }

  async submit(item:any,item1:any){
    const param = {
      'SituationID': 3,
      'TransactionNumber': item.Transactionnumber,
      'DepartmentID': item1.DepartmentID,
      'ProcessID': item1.ProcessID,
      'ProductID': item.ProductID,
      'JobDesignID': item.JobDesignID,
      'LoginUserID': this.utilsService.getLoginUsers()?.LoginUserID,
      'EmployeeCode': this.employee.name.toString().split(' - ')[0],
      'LocationID': this.LocationID.id ? this.LocationID.id : 0
    };
    this.paramarray.push(param);
    const formData = new FormData();
    formData.set('AutoProcess', JSON.stringify(param));
    await new Promise((resolve)=>{
      this.http.post(this.utilsService.serverVariableService.Validate_Process, formData).subscribe(
        (response: any) => {
          if(response.data.AutoProcess[0].Result=='Job Process Successfull'){
            // this.messageService.add({ severity: 'success', summary: 'Success', detail: response.data.AutoProcess[0].Result });
            resolve('');
            // alert(response.data.AutoProcess[0].Result);
          }else{
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something wrong' });
            this.impressionNo = '';
          }
        },
        (error) => {
          //console.error('Error:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
        }
      );
    })
  }
  submitReworkProcess(){
    this.paramarray=[];
    for (let item of this.reworkProcessColln) {
      const param = {
        'SituationID': 3,
        'TransactionNumber': item.Transactionnumber,
        'DepartmentID': this.DepartmentID.id,
        'ProcessID': this.ProcessID.id,
        'ProductID': item.ProductID,
        'JobDesignID': item.JobDesignID,
        'LoginUserID': this.utilsService.getLoginUsers()?.LoginUserID,
        'EmployeeCode': this.employee.name.toString().split(' - ')[0],
        'LocationID': this.LocationID.id ? this.LocationID.id : 0
      };
      this.paramarray.push(param);
      const formData = new FormData();
      formData.set('AutoProcess', JSON.stringify(param));
      // const apiUrl = 'https://uat.illusiondentallab.com/API_2020/';
      this.http.post(this.utilsService.serverVariableService.Validate_Process, formData).subscribe(
        (response: any) => {
          if (response.data.AutoProcess[0].Result == 'Job Process Successfull') {
            // this.messageService.add({ severity: 'success', summary: 'Success', detail: response.data.AutoProcess[0].Result });
            // alert(response.data.AutoProcess[0].Result);
          } else {
            // alert('Something wrong.');
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something wrong' });
            this.impressionNo = '';
          }
        },
        (error) => {
          //console.error('Error:', error);
        }
      );
    }
    //console.log('rework:',this.paramarray);
  }
  // submit1(){
  //   for(let item of this.AllValidationArrayColln){
  //     let temploop = this.SkipProcessListColln.filter((a: { Transactionnumber: any; })=>a.Transactionnumber==item.Transactionnumber);
  //     for(let item1 of temploop){
  //       const param = {
  //         'SituationID': 3,
  //         'TransactionNumber': item.Transactionnumber,
  //         'DepartmentID': item1.DepartmentID,
  //         'ProcessID': item1.ProcessID,
  //         'ProductID': item.ProductID,
  //         'JobDesignID': item.JobDesignID,
  //         'LoginUserID': this.utilsService.getLoginUsers()?.LoginUserID,
  //         'EmployeeCode': this.employee.name.toString().split(' - ')[0],
  //         'LocationID': this.LocationID.id ? this.LocationID.id : 0
  //       };
  //       this.paramarray.push(param);
  //       const formData = new FormData();
  //       formData.set('AutoProcess', JSON.stringify(param));
  //         this.http.post(this.utilsService.serverVariableService.Validate_Process, formData).subscribe(
  //           (response: any) => {
  //             if(response.data.AutoProcess[0].Result=='Job Process Successfull'){
  //               this.processing = 'Process Subbmitting...';
  //               // alert(response.data.AutoProcess[0].Result);
  //             }else{
  //               alert('Something wrong.');
  //               this.impressionNo = '';
  //             }
  //           },
  //           (error) => {
  //             //console.error('Error:', error);
  //           }
  //         );
  //     }
  //     // let processid,departmentid;
  //     // this.SkipProcessListColln.filter((data: { Transactionnumber: any; ProcessID: any; DepartmentID: any; })=>{if(data.Transactionnumber==item.TransactionNumber){processid=data.ProcessID; departmentid = data.DepartmentID;}});
  //   }
  //   //console.log('paramarray:',this.paramarray);
  //   this.processing ='';
  // }

  cancelSkip(){
    this.SkipProcessListColln = this.SkipProcessListColln.filter((item: { Transactionnumber: string; })=>item.Transactionnumber!=this.oldImpNo);
    this.AllValidationArrayColln = this.AllValidationArrayColln.filter((item: { Transactionnumber: string; })=>item.Transactionnumber!=this.oldImpNo);
    this.arrayOfImpNo = this.arrayOfImpNo.filter((item: string)=> item != this.oldImpNo);
    // //console.log('cancel:',this.SkipProcessListColln);
  }

  scannedData: string ='';
  selectedDevice: MediaDeviceInfo | undefined;
  camerasFoundHandler(devices: MediaDeviceInfo[]): void {
    this.selectedDevice = devices[0];
  }

  handleScanImpression(result:any):void{
    if (result) {
      this.scannedData = result;
      this.impressionNo = this.scannedData;
      this.stopScanner(); 
      this.validateProcess();
    }
  }

  handleScanEmployee(result:any):void{
    if (result) {
      this.scannedData = result;
      console.log(this.scannedData);
      this.getMockEmployee(this.scannedData,1);
      this.stopScanner(); 
    }
  }

  handleScanError(error: any): void {
    //console.error('Error during scan:', error);
    this.stopScanner(); 
  }
 
  stopScanner() {
    this.isScannerEnabled = false;
    this.scanImp = true;
  }

  startScanner() {
    this.isScannerEnabled = true;
    this.scanImp = false;
    setTimeout(() => {
      this.stopScanner();
    }, 15000);
  }
}
