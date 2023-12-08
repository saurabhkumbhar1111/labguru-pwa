import { ElementRef, EventEmitter, Injectable, Output, ViewChild } from '@angular/core';
import {UtilsService} from '../../services/utils.service'
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ServerVariableService } from 'src/app/services/server-variable.service';
import { CookieService } from 'ngx-cookie-service';
import { BarcodeFormat } from '@zxing/library';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { MessageService } from 'primeng/api';
import { map, Observable } from 'rxjs';
import { WizardComponent } from 'angular-archwizard';

@Injectable({
  providedIn: 'root'
})
export class JobProcessService {
  scanImp: boolean= true;
  @ViewChild('wizard') wizard!: WizardComponent;
  @ViewChild('scanner') scanner: ZXingScannerComponent = new ZXingScannerComponent;
  isScannerEnabled = false;
  allowedFormats = [ BarcodeFormat.CODE_128,BarcodeFormat.QR_CODE];
  Location:string='';
  Department:string='';
  Process:string='';
  isNextEnabled : boolean = false;
  isSettingEnabled :boolean = true;
  isFooterEnabled :boolean = true;
   Donemessage : string = "Process Success";
  OrganizationUnitID: any;
  EmployeeID : any ; 
  DepartmentID!: number;
  ProcessID!: number;
  LocationID!: number;
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
  impressionNoList :boolean = false;
  newArrayOfImp:any=[];
  autoComplete: any;
  currentStep = 1;
  employeeSelected!:boolean;
  autofocusEnabled :boolean = true;
  Privilege:any;
  isAuthorizeDisable:boolean = false;
  constructor(public http: HttpClient,public utilsService:UtilsService, public router: Router,private route: ActivatedRoute,private cookieService:CookieService,
    public serverVariableService: ServerVariableService,private messageService: MessageService) { 
    this.keyword = "name";
    this.getAllDropDownData();
    if(this.cookieService.get('employeeName')!=="undefined" && this.cookieService.get('employeeName')!==""){
      this.getMockEmployee(this.cookieService.get('employeeName').split(' - ')[0],1);
      this.employee = this.arryforEmployee[0];
      this.employeeSelected=true;
    }
  }
  getAllDropDownData() {
    const param ={
      'FinancialYearID' :this.utilsService.getLoginUsers()?.FinancialYearID,
      'LoginCompanyID':this.utilsService.getLoginUsers()?.LoginCompanyID,
      'LoginReferenceID' :this.utilsService.getLoginUsers()?.LoginReferenceID,
      'LoginRoleID':this.utilsService.getLoginUsers()?.LoginRoleID,
      'LoginUserID' : this.utilsService.getLoginUsers()?.LoginUserID,
      'ModuleID' :0,
      'OrganizationUnitID':0,
      'SSCID':3035,
      'SituationID':1,
    }
    this.postDropdownData(param);
  }
  postDropdownData(data:any){
    return this.http.post(this.utilsService.serverVariableService.GetCommonList, data).subscribe(
      (response: any) => {
        this.arrayForDepartmentList = response.data.Department_DDL;
        this.arrayForLocationList =response.data.LineLocation;
        this.Privilege = response.data.Privilege;
        const idAuthorize = this.Privilege.filter((item: { name: string; }) => item.name === "AUTHORIZE");
        if (idAuthorize[0]['id'] === 0) {
          this.isAuthorizeDisable = true;
        }
        if(this.cookieService.get('LocationID')!=="undefined" && this.cookieService.get('LocationID')!==""){
            this.LocationID = parseInt(this.cookieService.get('LocationID'));
        }
        if(this.cookieService.get('DepartmentID')!=="undefined" && this.cookieService.get('DepartmentID')!==""){
          this.DepartmentID =parseInt(this.cookieService.get("DepartmentID"))
          this.onSelectDepartment();
        }
        if(this.utilsService.isNullUndefinedOrBlank(this.LocationID) || this.utilsService.isNullUndefinedOrBlank(this.DepartmentID)){
          this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please set values.',sticky: true });
        }
      },
      (error) => {
        //console.error('Error:', error);
      }
    );
  }
  onSelectDepartment() {
    this.employee=null;
    this.ProcessID = 0;
    this.processJob =true;
    // if(this.DepartmentID){
      const param = {
        'SSCID': 3033,
        'OrganizationUnitID': 0,
        'LoginUserID':this.utilsService.getLoginUsers()?.LoginUserID ,
        'LoginReferenceID': this.utilsService.getLoginUsers()?.LoginReferenceID,
        'LoginRoleID': this.utilsService.getLoginUsers()?.LoginRoleID,
        'LoginCompanyID': this.utilsService.getLoginUsers()?.LoginCompanyID,
        'innerSituationID': 40,
        'ModuleID' :!this.utilsService.isNullUndefinedOrBlank(this.DepartmentID)?(this.DepartmentID):0
      };
     this.postProcess(param);
    }
    // }
    postProcess(data:any){
      return this.http.post(this.utilsService.serverVariableService.getAllDropDownDataAPI_new,data).subscribe(
        (response: any) => {
         this.arrayForProcessList =response.data.Data;
         if(this.cookieService.get('ProcessID')!=="undefined" && this.cookieService.get('ProcessID')!==""){
          // this.arrayForProcessList.filter((item)=>{if(item.id ==this.cookieService.get("ProcessID")){
          //   this.ProcessID = item;
          //   this.Process=JSON.stringify(this.ProcessID.name).replace(/"/g, '');
          // }});
          this.ProcessID =parseInt(this.cookieService.get('ProcessID'))
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
    this.employeeSelected=false;
    if(search.length>=4){
      this.getMockEmployee(search.query,0);
    }
  }

    getMockEmployee(term:any,id:number){
      const param = {
        'Keyword': term,
        'SSCID': 9006,
        'OrganizationUnitID': 0,
        'LoginCompanyID':this.utilsService.getLoginUsers()?.LoginCompanyID,
        'LoginUserID':this.utilsService.getLoginUsers()?.LoginUserID,
        'LoginReferenceID':this.utilsService.getLoginUsers()?.LoginReferenceID, 
        'innerSituationID': 69
      };
      this.postData(param,id)
    }
    postData(data: any,id:number) {
      return this.http.post(this.utilsService.serverVariableService.GetJobEntry_CustomerAPI, data).subscribe(
        (response: any) => {
         this.arryforEmployee = [...response.data.Customer];
          if(id==1){
            if(this.arryforEmployee.length>0){
              this.employee = this.arryforEmployee[0];
              this.employeeSelected = true;
            }
            else{
              this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'No Record Found.' });
            }
          }
        },
        (error) => {
          //console.error('Error:', error);
        }
      );
      
    }
  selectedEmployee :any;
  onSelectEmployee(data:any){
    if(this.utilsService.isNullUndefinedOrBlank(this.LocationID) || this.utilsService.isNullUndefinedOrBlank(this.DepartmentID)){
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please set values.',sticky: true });
      return;
    }
    this.employee = data;
    this.employeeSelected=true;
    // this.selectedEmployee = data.name.split(' - ')[0]
    this.validateEmployee();    
  }


  validateEmployee(){
    const param = {
      'SituationID': 4,
      'EmployeeCode': this.employee.name.toString().split(' - ')[0],
      'DepartmentID': !this.utilsService.isNullUndefinedOrBlank(this.DepartmentID) ? this.DepartmentID: 0,
      'ProcessID': !this.utilsService.isNullUndefinedOrBlank(this.ProcessID) ? this.ProcessID : 0,
      'LoginUserID': this.utilsService.getLoginUsers()?.LoginUserID,
      'EmployeeID': this.employee.id ? this.employee.id : 0 ,
      'LocationID': this.LocationID ? this.LocationID : 0
    };
    const formData = new FormData();
    formData.set('AutoProcess', JSON.stringify(param));
      return this.http.post(this.utilsService.serverVariableService.Validate_Process, formData).subscribe(
        (response: any) => {
          if(this.utilsService.isNullUndefinedOrBlank(response.data.AutoProcess[0])){
            this.employee='';
            this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'No Record Found.' });
          }
        },
        (error) => {
          //console.error('Error:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
        }
      );
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
    this.impressionNoList =false;
    this.newArrayOfImp = [];
  }

  onSubmitSettingModal(){
    this.cookieService.set("LocationID",this.LocationID.toString(),this.expiryCookiesDate);
    this.cookieService.set("DepartmentID",this.DepartmentID.toString(),this.expiryCookiesDate);
    this.cookieService.set("ProcessID",this.ProcessID.toString(),this.expiryCookiesDate);
    // this.cookieService.set("employeeId",this.employee.id.toString(),this.expiryCookiesDate);
    // this.cookieService.set("employeeName",this.employee.name.toString(),this.expiryCookiesDate);
    !this.utilsService.isNullUndefinedOrBlank(this.employee) ? this.cookieService.set("employeeId",this.employee.id.toString(),this.expiryCookiesDate):this.cookieService.set("employeeId",'',this.expiryCookiesDate);
    !this.utilsService.isNullUndefinedOrBlank(this.employee) ?this.cookieService.set("employeeName",this.employee.name.toString(),this.expiryCookiesDate):this.cookieService.set("employeeName",'',this.expiryCookiesDate);
  }

  OUArray:any=[];
  validateProcess(){
    this.impressionNo = this.impressionNo.trim();
    let ImpAdded = this.newArrayOfImp.filter((item: { JobEntryNo: any; })=>item.JobEntryNo.toLowerCase() == this.impressionNo.toLowerCase());
    // this.impressionNoList = true;
    if(ImpAdded.length>0){
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Impression already added' });
      return;
    }
    this.oldImpNo=this.impressionNo;
    const param = {
      'SituationID': 0,
      'TransactionNumber': this.impressionNo,
      'LoginUserID': this.utilsService.getLoginUsers()?.LoginUserID,
      'ProcessID': !this.utilsService.isNullUndefinedOrBlank(this.ProcessID) ? this.ProcessID : 0
    };
    const formData = new FormData();
    formData.set('AutoProcess', JSON.stringify(param));
      return this.http.post(this.utilsService.serverVariableService.Validate_Process, formData).subscribe(
        (response: any) => {
          console.log(JSON.parse(response.data.AutoProcess));
          let arrayOfvalidateProcess = JSON.parse(response.data.AutoProcess)
          if(arrayOfvalidateProcess.ResultSets[0].Result1.length>0){
            this.OrganizationUnitID = arrayOfvalidateProcess.ResultSets[0].Result1[0].OrganizationUnitID;
            this.OUArray.push(arrayOfvalidateProcess.ResultSets[0].Result1[0]);
            if(arrayOfvalidateProcess.ResultSets[1].Result2[0].Illigible){
              this.allValidation();
            }else{
              // alert('Not Illigible '+this.impressionNo);
              this.messageService.add({ severity: 'warn', summary: 'Warning', detail: ('This case is not eligible for this process.')});
              this.impressionNo = '';
            }
          }
          else{
            this.messageService.add({ severity: 'warn', summary: 'Warning', detail: ('Case is not in system.')});
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
      'DepartmentID': !this.utilsService.isNullUndefinedOrBlank(this.DepartmentID) ? this.DepartmentID : 0,
      'LoginUserID': this.utilsService.getLoginUsers()?.LoginUserID
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
          console.log('array1: ',this.AllValidationArray);
          //console.log('array2: ',this.AllValidationArrayColln);
          var AlertMsg = response.data.AutoProcess[0].AlertMsg;
          this.ProductID = response.data.AutoProcess[0].ProductID;
          if(AlertMsg.length<1){
            this.restrictedSkipProcess().subscribe((isValid: boolean) => {
              if (isValid) {
                this.arrayOfImpNo.push(this.impressionNo);
                this.GetSkipProcess(); //next api call made
              }
            });
          }else{
            this.messageService.add({ severity: 'warn', summary: 'Warning', detail: AlertMsg,sticky: true });
            this.impressionNo = '';
          }
        },
        (error) => {
          //console.error('Error:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
        }
      );
  }

  restrictedSkipProcess(): Observable<boolean> {
    const param = {
      'SituationID': 6,
      'TransactionNumber': this.impressionNo,
      'ProcessID': !this.utilsService.isNullUndefinedOrBlank(this.ProcessID) ? this.ProcessID : 0,
      'DepartmentID': !this.utilsService.isNullUndefinedOrBlank(this.DepartmentID) ? this.DepartmentID : 0
    };
  
    const formData = new FormData();
    formData.set('AutoProcess', JSON.stringify(param));
  
    return this.http.post(this.utilsService.serverVariableService.Validate_Process, formData).pipe(
      map((response: any) => {
        let arrayOfRistrictProcess = JSON.parse(response.data.AutoProcess);
        if (!this.utilsService.isNullUndefinedOrBlank(arrayOfRistrictProcess.ResultSets[0]?.Result1[0][""])) {
          this.messageService.add({ severity: 'warn', summary: 'Warning', detail: arrayOfRistrictProcess.ResultSets[0].Result1[0][""],sticky: true });
          this.impressionNo='';
          return false;
        } else {
          return true;
        }
      })
    );
  }

  ListOfSkipProcess:any=[];
  SkipProcessListColln:any=[];
  oldImpNo:string='';
  tempFlag:boolean=false;
  GetSkipProcess(){
    this.ListOfSkipProcess=[];
    for(let item of this.AllValidationArray){
      const param = {
        'SituationID': 2,
        'TransactionNumber': this.oldImpNo,
        'DepartmentID': !this.utilsService.isNullUndefinedOrBlank(this.DepartmentID) ? this.DepartmentID : 0,
        'ProcessID': !this.utilsService.isNullUndefinedOrBlank(this.ProcessID) ? this.ProcessID : 0,
        'ProductID': !this.utilsService.isNullUndefinedOrBlank(item.ProductID) ? item.ProductID : 0
      };
      const formData = new FormData();
      formData.set('AutoProcess', JSON.stringify(param));
      this.http.post(this.utilsService.serverVariableService.Validate_Process, formData).subscribe(
        async (response: any) => {
          //console.log(response.data);
          var SkipList = [];
          this.tempFlag = false;
          SkipList = response.data.AutoProcess;
          if(SkipList.length>0){

            for(let item1 of SkipList){
              if(item1.IsMandatory == true){
                this.cancelSkip();
                this.tempFlag=true;
                SkipList=[];
                this.messageService.add({ severity: 'warn', summary: 'Warning', detail: ' Process is mandatory to Process .it cannot be skipped',sticky: true});
                break;
              }
              else{
                let dublicateSkip = this.SkipProcessListColln.filter((skipitem: { Transactionnumber: any, Process: any, ProductID: any; })=>skipitem.Transactionnumber == item1.Transactionnumber && skipitem.Process == item1.Process && skipitem.ProductID == item1.ProductID)
                if(dublicateSkip.length==0){
                  this.SkipProcessListColln.push(item1);
                }
              }
            }
            if(!this.tempFlag){
              console.log('skipcolln: ',this.SkipProcessListColln);
              SkipList.filter((item: { Process: any; })=> this.ListOfSkipProcess.includes(item.Process) ? '' : this.ListOfSkipProcess.push(item.Process));
              this.ListOfSkipProcess.pop();
              if(this.ListOfSkipProcess.length>0){
                const dublicateData = this.newArrayOfImp.filter((item: { JobEntryNo: any; })=>item.JobEntryNo == this.oldImpNo);
                let ImpArray=[
                  {
                    "JobEntryNo": this.oldImpNo,
                    "Units": 0,
                    "Rework1GivenTime": null,
                    "Rework2GivenTime": null,
                    "Rework3GivenTime": null,
                    "Rework4GivenTime": null,
                    "NextStep":"Skip"
                  }
                ];
                dublicateData.length>0 ? '' : this.newArrayOfImp.push(...ImpArray);
                this.ListOfSkipProcess.length>0 ? this.openModal('messageModal') : '';
              }
              else{
                await this.getMainGridData(item);
              }
            }
          }
          else{
            this.reworkProcessColln.push(item);
            await this.getMainGridData(item);
          }
        },
        (error) => {
          //console.error('Error:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
        }
      );
    }
    this.impressionNo='';
    // this.openModal('confirmModal');
    // return;
  }

  async getMainGridData(data:any){
    const param = {
      'SituationID': 5,
      'TransactionNumber': data.Transactionnumber,
      'DepartmentID': !this.utilsService.isNullUndefinedOrBlank(this.DepartmentID) ? this.DepartmentID : 0,
      'ProcessID': !this.utilsService.isNullUndefinedOrBlank(this.ProcessID) ? this.ProcessID : 0,
      'ProductID': !this.utilsService.isNullUndefinedOrBlank(data.ProductID) ? data.ProductID : 0,
      'OrganizationUnitID' : this.OrganizationUnitID
    };
    const formData = new FormData();
    formData.set('AutoProcess', JSON.stringify(param));
    await new Promise((resolve)=>{
      this.http.post(this.utilsService.serverVariableService.Validate_Process, formData).subscribe(
        (response: any) => {
          if(response.data.AutoProcess.length==0){
            this.impressionNo = '';
            this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Previous process is not Complete or it require doctor confirmation or case is discarded or case is delivered.' });
          }
          else{
            let count = response.data.AutoProcess.length;
            const fetchdublicateData = this.newArrayOfImp.filter((item: { JobEntryNo: any; })=>item.JobEntryNo.toLowerCase() == data.Transactionnumber.toLowerCase());
            if(fetchdublicateData.length>0){
              return;
            }
            for(let item1 of response.data.AutoProcess){
              count--
              if(item1.Rework4GivenTime==null){
                let JobEntryNo = item1.JobEntryNo;
                let Units = item1.Units;
                const dublicateData = this.newArrayOfImp.filter((item: { JobEntryNo: any; })=>item.JobEntryNo.toLowerCase() == JobEntryNo.toLowerCase());
                if(dublicateData.length>0){
                  this.newArrayOfImp.filter((item: { JobEntryNo: any,Units:any; })=>{if(item.JobEntryNo == JobEntryNo){item.Units+=Units}});
                }else{
                  this.newArrayOfImp.length>0 ? this.newArrayOfImp.push(item1) : this.newArrayOfImp.push(item1);
                  this.newArrayOfImp.filter((a: { JobEntryNo: any, NextStep:any; })=>{if(a.JobEntryNo.toLowerCase() == this.oldImpNo.toLowerCase())
                    {
                      console.log(a.JobEntryNo.toLowerCase());
                      // a.NextStep = a.NextStep.split('(').length == 1 ? a.NextStep.split('(')[1].toString().slice(0,6) : a.NextStep == 'Job Received From Process' ? 'Job Recd' : a.NextStep == 'Job Issued For Process' ? 'Job Issd' : a.NextStep
                      a.NextStep = 
                      (a.NextStep === "Job Received From Process (Redo 1)") ? 'Redo 1 OUT' : 
                      (a.NextStep === "Job Received From Process (Redo 2)") ? 'Redo 2 OUT' : 
                      (a.NextStep === "Job Received From Process (Redo 3)") ? 'Redo 3 OUT' : 
                      (a.NextStep === "Job Received From Process (Redo 4)") ? 'Redo 4 OUT' : 
                      (a.NextStep === "Job Issued For Process (Redo 1)") ? 'Redo 1 IN' : 
                      (a.NextStep === "Job Issued For Process (Redo 2)") ? 'Redo 2 IN' : 
                      (a.NextStep === "Job Issued For Process (Redo 3)") ? 'Redo 3 IN' : 
                      (a.NextStep === "Job Issued For Process (Redo 4)") ? 'Redo 4 IN' : 
                      (a.NextStep === "Job Received From Process") ? 'Job OUT' : 
                      (a.NextStep === "Job Issued For Process") ? 'Job IN' : 
                      a.NextStep
                    }
                  })
                }
                 setTimeout(() => {
                  console.log(this.newArrayOfImp);
                  }, 2000);
                this.impressionNo = '';
              }
              else{
                count == 0 ? this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Job Process Redo Limit Exceeds of '+this.oldImpNo+ '!',sticky: true}):'';
              }
            }
          }
          resolve('');
        },
        (error) => {
          //console.error('Error:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
        }
      );
    })
  }

  paramarray:any=[];
  reworkProcessColln:any=[];
  async syncSubmit() {
    const AllValidationArray = this.AllValidationArrayColln
    const SkipProcessList = this.SkipProcessListColln
    this.utilsService.loaderStart--;
    if(this.reworkProcessColln.length>0){
      this.submitReworkProcess();
    }
    for(let item of AllValidationArray){
      let temploop = SkipProcessList.filter((a: { Transactionnumber: any,ProductID:any})=>a.Transactionnumber==item.Transactionnumber && a.ProductID == item.ProductID);
      // for(let item1 of temploop){
      //   await this.submit(item,item1);
      // }
      for (let item1 of temploop) {
        try {
          await this.submit(item, item1);
        } catch (error) {
          // Handle errors here
          console.error('Error during submit:', error);
        }
      }
      this.utilsService.loaderStart = 0;
    }
    this.messageService.add({ severity: 'success', summary: 'Success', detail: "Job Process Successfull ."});
    if(this.cookieService.get('employeeName')=="undefined" || this.cookieService.get('employeeName')==""){
      this.employee = null;
      this.employeeSelected=false;
      this.searchClearedEmployee();
    }
    this.clearArray();
  }

  async submit(item:any,item1:any){
    let OU = this.OUArray.filter((a: { TransactionNumber: any; })=>a.TransactionNumber == item.Transactionnumber);
    const param = {
      'SituationID': 3,
      'TransactionNumber': item.Transactionnumber,
      'DepartmentID': item1.DepartmentID,
      'ProcessID': item1.ProcessID,
      'ProductID': item1.ProductID,
      'JobDesignID': item.JobDesignID,
      'LoginUserID': this.utilsService.getLoginUsers()?.LoginUserID,
      'EmployeeCode': this.employee.name.toString().split(' - ')[0],
      'LocationID': this.LocationID ? this.LocationID : 0,
      'OrganizationUnitID': OU[0].OrganizationUnitID ? OU[0].OrganizationUnitID : 0,
      'FinalProcessID' : this.ProcessID
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
      let OU = this.OUArray.filter((a: { TransactionNumber: any; })=>a.TransactionNumber == item.Transactionnumber);
      const param = {
        'SituationID': 3,
        'TransactionNumber': item.Transactionnumber,
        'DepartmentID': this.DepartmentID,
        'ProcessID': this.ProcessID,
        'ProductID': item.ProductID,
        'JobDesignID': item.JobDesignID,
        'LoginUserID': this.utilsService.getLoginUsers()?.LoginUserID,
        'EmployeeCode': this.employee.name.toString().split(' - ')[0],
        'LocationID': this.LocationID ? this.LocationID : 0,
        'OrganizationUnitID': OU[0].OrganizationUnitID ? OU[0].OrganizationUnitID : 0,
        'FinalProcessID' : this.ProcessID
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
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
        }
      );
    }
    //console.log('rework:',this.paramarray);
  }

  cancelSkip(){
    // this.ListOfSkipProcess=[];
    this.SkipProcessListColln = this.SkipProcessListColln.filter((item: { Transactionnumber: string; })=>item.Transactionnumber!=this.oldImpNo);
    this.AllValidationArrayColln = this.AllValidationArrayColln.filter((item: { Transactionnumber: string; })=>item.Transactionnumber!=this.oldImpNo);
    this.arrayOfImpNo = this.arrayOfImpNo.filter((item: string)=> item != this.oldImpNo);
    this.newArrayOfImp = this.newArrayOfImp.filter((item: {JobEntryNo : any})=> item.JobEntryNo != this.oldImpNo);
    this.impressionNo='';
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
    this.stopScanner();
    if (result) {
      this.scannedData = result;
      console.log(this.scannedData);
      this.getMockEmployee(this.scannedData,1);
      this.validateEmployee();
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
    // setTimeout(() => {
    //   this.stopScanner();
    // }, 15000);
  }

  removeItem(impNo: any): void {
    this.SkipProcessListColln = this.SkipProcessListColln.filter((item: { Transactionnumber: string; })=>item.Transactionnumber!=impNo);
    this.AllValidationArrayColln = this.AllValidationArrayColln.filter((item: { Transactionnumber: string; })=>item.Transactionnumber!=impNo);
    this.arrayOfImpNo = this.arrayOfImpNo.filter((item: string)=> item != impNo);
    this.newArrayOfImp = this.newArrayOfImp.filter((item: {JobEntryNo : any})=> item.JobEntryNo != impNo);
    this.reworkProcessColln = this.reworkProcessColln.filter((item: { Transactionnumber: string; })=>item.Transactionnumber!=impNo);
  }

  onFocused(event:any){
    // this.selectedEmployee=false;
    // console.log(this.selectedEmployee);
  }
  searchClearedEmployee(){
    this.arryforEmployee =[];
    this.EmployeeID =null;
    this.employeeSelected=false;
    // this.autoComplete.notFound = false;
    // this.autoComplete.query = '';
  }
  clear(event:any){
    if (event.key === "Enter" || event.key === "Tab" ) {
      if(this.arryforEmployee.length==0)
      {
          this.employee =null;
      }
    }
  }

  department:string='';
  process:string='';
  location:string='';
  setLabel(){
    var departmentItem = this.arrayForDepartmentList.find(item => item.id === this.DepartmentID);
    this.department = departmentItem ? departmentItem.name : '';

    var processtItem = this.arrayForProcessList.find(item => item.id === this.ProcessID);
    this.process = processtItem ? processtItem.name : '';

    var locationItem = this.arrayForLocationList.find(item => item.id === this.LocationID);
    this.location = locationItem ? locationItem.name : '';
  }

  nextStep() {
    this.currentStep++;
  }
  prevStep() {
    this.currentStep--;
  }
}
