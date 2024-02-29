import { Injectable, ViewChild } from '@angular/core';
import { UtilsService} from '../../services/utils.service'
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ServerVariableService } from 'src/app/services/server-variable.service';
import { CookieService } from 'ngx-cookie-service';
import { BarcodeFormat } from '@zxing/library';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { MessageService } from 'primeng/api';
import { map, Observable } from 'rxjs';
import { WizardComponent } from 'angular-archwizard';
import { BeepserviceService } from 'src/app/services/beepservice.service';
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
  LocationID: any;
  arrayForDepartmentList: any[] = [];
  arrayForProcessList: any[] = [];
  arrayForLocationList: any[] = [];
  processJob: boolean =false;
  impressionNo :string ='';
  arrayOfImpNo : any =[];
  paramarray:any=[];
  reworkProcessColln:any=[];
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
    public serverVariableService: ServerVariableService,private messageService: MessageService,private beepService:BeepserviceService) {
    this.keyword = "name";
    this.getAllDropDownData();
    // if(this.cookieService.get('employeeName')!=="undefined" && this.cookieService.get('employeeName')!==""){
    //   this.getMockEmployee(this.cookieService.get('employeeName').split(' - ')[0],1);
    //   this.employee = this.arryforEmployee[0];
    //   // this.employeeSelected=true;
    // }
    this.LocationID = this.utilsService.getLoginUsers()?.LocationID;
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
        this.arrayForDepartmentList = response.data.Department_Process;
        this.arrayForLocationList = response.data.LineLocation;
        this.Privilege = response.data.Privilege;
        const idAuthorize = this.Privilege.filter((item: { name: string; }) => item.name === "AUTHORIZE");
        if (idAuthorize[0]['id'] === 0) {
          this.isAuthorizeDisable = true;
        }
        // if(this.cookieService.get('LocationID')!=="undefined" && this.cookieService.get('LocationID')!==""){
        //     this.LocationID = parseInt(this.cookieService.get('LocationID'));
        // }
        // if(this.cookieService.get('DepartmentID')!=="undefined" && this.cookieService.get('DepartmentID')!==""){
        //   this.DepartmentID =parseInt(this.cookieService.get("DepartmentID"))
        //   this.onSelectDepartment();
        // }
        if(this.arrayForDepartmentList.length == 1){
          this.DepartmentID = this.arrayForDepartmentList[0].id;
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
        'innerSituationID': 70,
        'ModuleID' :!this.utilsService.isNullUndefinedOrBlank(this.DepartmentID)?(this.DepartmentID):0
      };
     this.postProcess(param);
    }
    // }
    postProcess(data:any){
      return this.http.post(this.utilsService.serverVariableService.getAllDropDownDataAPI_new,data).subscribe(
        (response: any) => {
         this.arrayForProcessList =response.data.Data;
        // if(this.cookieService.get('ProcessID')!=="undefined" && this.cookieService.get('ProcessID')!==""){
        //   this.ProcessID =parseInt(this.cookieService.get('ProcessID'))
        // }
        if(this.arrayForProcessList.length == 1){
          this.ProcessID = this.arrayForProcessList[0].id;
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
    if(search.length==4){
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
    this.employeeSelected=false;
    // this.selectedEmployee = data.name.split(' - ')[0]
    this.validateEmployee();
  }


  validateEmployee(){
    if(!this.utilsService.isNullUndefinedOrBlank(this.employee)){
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
        this.http.post(this.utilsService.serverVariableService.Validate_Process, formData).subscribe(
          (response: any) => {
            if(this.utilsService.isNullUndefinedOrBlank(response.data.AutoProcess[0])){
              this.employee='';
              this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'No Record Found.' });
            }
            else{
              this.employeeSelected=true;
            }
          },
          (error) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
          }
        );
    }
  }

  addImpressionNo(){
   this.arrayOfImpNo.push(this.impressionNo);
   this.impressionNo = '';
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
    // this.cookieService.set("LocationID",this.LocationID.toString(),this.expiryCookiesDate);
    this.cookieService.set("DepartmentID",this.DepartmentID.toString(),this.expiryCookiesDate);
    this.cookieService.set("ProcessID",this.ProcessID.toString(),this.expiryCookiesDate);
    !this.utilsService.isNullUndefinedOrBlank(this.employee) ? this.cookieService.set("employeeId",this.employee.id.toString(),this.expiryCookiesDate):this.cookieService.set("employeeId",'',this.expiryCookiesDate);
    !this.utilsService.isNullUndefinedOrBlank(this.employee) ?this.cookieService.set("employeeName",this.employee.name.toString(),this.expiryCookiesDate):this.cookieService.set("employeeName",'',this.expiryCookiesDate);
  }

  OUArray:any=[];
  validateProcess(){
    this.impressionNo = this.impressionNo.trim();
    let ImpAdded = this.newArrayOfImp.filter((item: { JobEntryNo: any; })=>item.JobEntryNo.toLowerCase() == this.impressionNo.toLowerCase());
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
          // console.log(JSON.parse(response.data.AutoProcess));
          let arrayOfvalidateProcess = JSON.parse(response.data.AutoProcess)
          if(arrayOfvalidateProcess.ResultSets[0].Result1.length>0){
            this.OrganizationUnitID = arrayOfvalidateProcess.ResultSets[0].Result1[0].OrganizationUnitID;
            this.OUArray.push(arrayOfvalidateProcess.ResultSets[0].Result1[0]);
            if(arrayOfvalidateProcess.ResultSets[1].Result2[0].Illigible){
              this.allValidation();
            }else{
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
      'LoginUserID': this.utilsService.getLoginUsers()?.LoginUserID,
      'ProcessID' : !this.utilsService.isNullUndefinedOrBlank(this.ProcessID) ? this.ProcessID : 0
    };
    const formData = new FormData();
    formData.set('AutoProcess', JSON.stringify(param));
      return this.http.post(this.utilsService.serverVariableService.Validate_Process, formData).subscribe(
        (response: any) => {
          this.AllValidationArray = response.data.AutoProcess;
          for(let item of this.AllValidationArray){
            this.AllValidationArrayColln.push(item);
            // this.AllValidationArrayColln.length>0 ? this.AllValidationArrayColln[0].push(response.data.AutoProcess) : this.AllValidationArrayColln.push(response.data.AutoProcess)
          }
          // console.log('array1: ',this.AllValidationArray);
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
  ProductList:any=[];
  oldImpNo:string='';
  tempFlag:boolean=false;
  unitCount:number = 0;
  async GetSkipProcess(){
    this.unitCount = 0;
    this.ListOfSkipProcess=[];
    this.ProductList = [];
    this.ProductList1 = [];
    // let unitCount = 0;
    // var tempAllValidationArray = this.AllValidationArray.filter()
    let tempAllValidationArray = [];

    for (const obj of this.AllValidationArray) {
      tempAllValidationArray.length==0 ? tempAllValidationArray.push(obj) : '';
      let checkdublicate = tempAllValidationArray.filter(p=>p.ProductID == obj.ProductID && p.JobDesignID == obj.JobDesignID);
      if (checkdublicate.length == 0 && tempAllValidationArray.length>0) {
        tempAllValidationArray.push(obj);
      }
    }

    for(let item of tempAllValidationArray){
      // var checkDublicateProd = ProductList.filter(p=>p.ProductID == item.ProductID);
      // ProductList.push(...[{"ProductID":item.ProductID}]);
      // if(checkDublicateProd.length==0){
        const param = {
          'SituationID': 2,
          'TransactionNumber': this.oldImpNo,
          'DepartmentID': !this.utilsService.isNullUndefinedOrBlank(this.DepartmentID) ? this.DepartmentID : 0,
          'ProcessID': !this.utilsService.isNullUndefinedOrBlank(this.ProcessID) ? this.ProcessID : 0,
          'ProductID': !this.utilsService.isNullUndefinedOrBlank(item.ProductID) ? item.ProductID : 0
        };
        const formData = new FormData();
        formData.set('AutoProcess', JSON.stringify(param));
        // return new Promise<void>((resolve, reject) => {
          await this.getDataNew(formData,item)
        // });
      }
      this.impressionNo='';
      // this.openModal('confirmModal');
      // return;
    // }
  }

  async getDataNew(formData: any,item: any){

    return new Promise<void>((resolve, reject) => {
    this.http.post(this.utilsService.serverVariableService.Validate_Process, formData).subscribe(
      async (response: any) => {
        resolve()
        //console.log(response.data);
        var SkipList = [];
        this.tempFlag = false;
        SkipList = response.data.AutoProcess;
        if(SkipList.length>0){

          for(let item1 of SkipList){
            if(item1.IsMandatory == true && SkipList.length!=1){
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
            var checkDublicateProd = this.ProductList.filter((p: { ProductID: any; })=>p.ProductID == item.ProductID);
            this.ProductList.push(...[{"ProductID":item.ProductID}]);
            if(checkDublicateProd.length==0){
              for(let addUnit of SkipList){
                this.unitCount = this.unitCount + addUnit.Units;
              }
            }
            SkipList.filter((item: { Process: any; })=> this.ListOfSkipProcess.includes(item.Process) ? '' : this.ListOfSkipProcess.push(item.Process));
            this.ListOfSkipProcess.pop();
            if(this.ListOfSkipProcess.length>0){
              const dublicateData = this.newArrayOfImp.filter((item: { JobEntryNo: any; })=>item.JobEntryNo == this.oldImpNo);
              let ImpArray=[
                {
                  "JobEntryNo": this.oldImpNo,
                  "Units": this.unitCount,
                  "Rework1GivenTime": null,
                  "Rework2GivenTime": null,
                  "Rework3GivenTime": null,
                  "Rework4GivenTime": null,
                  "NextStep":"Skip"
                }
              ];
              dublicateData.length>0 ? this.newArrayOfImp.filter((u: { JobEntryNo: any, Units: any; })=>{if(u.JobEntryNo == this.oldImpNo){u.Units = this.unitCount}}) : this.newArrayOfImp.push(...ImpArray);
              this.ListOfSkipProcess.length>0 ? this.openModal('messageModal') : '';
            }
            else{
              await this.getMainGridData(item);
              // resolve();
            }
          }
        }
        else{
          this.reworkProcessColln.push(item);
          await this.getMainGridData(item);
          // resolve();
        }
      },
      (error) => {
        //console.error('Error:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
      }
    );
    });
  }

  ProductList1:any=[];
  async getMainGridData(data:any){
    // this.ProductList1 = [];
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
    return new Promise<void>((resolve, reject) => {
      this.http.post(this.utilsService.serverVariableService.Validate_Process, formData).subscribe(
        (response: any) => {
          if(response.data.AutoProcess.length==0){
            this.impressionNo = '';
            if(this.AllValidationArray.length==1){
              this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Previous process is not Complete or it require doctor confirmation or case is discarded or case is delivered.' });
            }
          }
          else{
            let count = response.data.AutoProcess.length;
            const fetchdublicateData = this.newArrayOfImp.filter((item: { JobEntryNo: any; })=>item.JobEntryNo.toLowerCase() == data.Transactionnumber.toLowerCase());
            // if(fetchdublicateData.length>0){
            //   for(let unit of response.data.AutoProcess){
            //     this.newArrayOfImp.filter((item: { JobEntryNo: any,Units:any,ProductID:any })=>{if(item.JobEntryNo == unit.JobEntryNo && item.ProductID != unit.ProductID){item.Units+=unit.Units}});
            //   }
            //   return;
            // }
            let abc = structuredClone(response.data.AutoProcess)
            for(let item1 of response.data.AutoProcess){
              count--
              if(item1.Rework4GivenTime==null){
                let JobEntryNo = item1.JobEntryNo;
                let Units = item1.Units;
                const dublicateData = this.newArrayOfImp.filter((item: { JobEntryNo: any; })=>item.JobEntryNo.toLowerCase() == JobEntryNo.toLowerCase());
                var checkDublicateProd = this.ProductList1.filter((p: { ProductID: any; })=>p.ProductID == item1.ProductID && p.ProductID == item1.ProductID);
                // console.log('imp array:',this.newArrayOfImp);
                if(dublicateData.length>0){
                  this.ProductList1.push(item1);
                  // this.newArrayOfImp.filter((u: { JobEntryNo: string; Units: number; })=>{if(u.JobEntryNo.toLowerCase() == this.oldImpNo.toLowerCase())(u.Units=0)})
                  if(checkDublicateProd.length == 0){
                    for(let unit of abc){
                      this.newArrayOfImp.filter((item: { JobEntryNo: any,Units:any; })=>{if(item.JobEntryNo == JobEntryNo){item.Units+=unit.Units}});
                    }
                  }
                }else{
                  this.newArrayOfImp.length>0 ?  this.newArrayOfImp.push(item1) : this.newArrayOfImp.push(item1);
                  if(response.data.AutoProcess.length>1){
                    // this.newArrayOfImp.filter((u: { JobEntryNo: string; Units: number; })=>{if(u.JobEntryNo.toLowerCase() == this.oldImpNo.toLowerCase()){u.Units=0}})
                    this.newArrayOfImp.map((data: any)=>{
                      if(data.JobEntryNo.toLowerCase() == this.oldImpNo.toLowerCase()){
                        data.Units = 0
                      }
                    })
                  }
                  this.newArrayOfImp.filter((a: { JobEntryNo: any, NextStep:any; })=>{if(a.JobEntryNo.toLowerCase() == this.oldImpNo.toLowerCase())
                    {
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
                      a.NextStep;
                    }
                  })
                }
                this.impressionNo = '';
              }
              else{
                count == 0 ? this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Job Process Redo Limit Exceeds of '+this.oldImpNo+ '!',sticky: true}):'';
              }
            }
          }
          resolve();
        },
        (error) => {
          //console.error('Error:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
        }
      );
    })
  }

  async syncSubmit() {
    const AllValidationArray = this.AllValidationArrayColln;
    const SkipProcessList = this.SkipProcessListColln;
    // const rework = this.reworkProcessColln;
    this.utilsService.loaderStart--;
    if(this.reworkProcessColln.length>0){
      this.submitReworkProcess();
      // console.log('reworkProcessColln:',this.reworkProcessColln);
    }
    for(let item of AllValidationArray){
      let temploop = SkipProcessList.filter((a: { Transactionnumber: any,ProductID:any})=>a.Transactionnumber==item.Transactionnumber && a.ProductID == item.ProductID);
      for (let item1 of temploop) {
        try {
          await this.submit(item, item1);
        } catch (error) {
          console.error('Error during submit:', error);
        }
      }
      this.utilsService.loaderStart = 0;
    }
    this.messageService.add({ severity: 'success', summary: 'Success', detail: "Job Process Successfull ."});
    // if(this.cookieService.get('employeeName')=="undefined" || this.cookieService.get('employeeName')==""){
    //   this.employee = null;
    //   // this.employeeSelected=false;
    //   this.searchClearedEmployee();
    // }
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
      'EmployeeCode': this.ProcessID == item1.ProcessID ? this.employee.name.toString().split(' - ')[0] : '',
      'LocationID': this.LocationID ? this.LocationID : 0,
      'OrganizationUnitID': OU[0].OrganizationUnitID ? OU[0].OrganizationUnitID : 0,
      'FinalProcessID' : this.ProcessID,
      'IssueReceipt' : item1.IssueReceipt ? item1.IssueReceipt : ''
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
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
        }
      );
    })
  }
  // submitReworkProcess(){
  //   this.paramarray=[];
  //   for (let item of this.reworkProcessColln) {
  //     let OU = this.OUArray.filter((a: { TransactionNumber: any; })=>a.TransactionNumber == item.Transactionnumber);
  //     const param = {
  //       'SituationID': 3,
  //       'TransactionNumber': item.Transactionnumber,
  //       'DepartmentID': this.DepartmentID,
  //       'ProcessID': this.ProcessID,
  //       'ProductID': item.ProductID,
  //       'JobDesignID': item.JobDesignID,
  //       'LoginUserID': this.utilsService.getLoginUsers()?.LoginUserID,
  //       'EmployeeCode': this.employee.name.toString().split(' - ')[0],
  //       'LocationID': this.LocationID ? this.LocationID : 0,
  //       'OrganizationUnitID': OU[0].OrganizationUnitID ? OU[0].OrganizationUnitID : 0,
  //       'FinalProcessID' : this.ProcessID
  //     };
  //     this.paramarray.push(param);
  //     const formData = new FormData();
  //     formData.set('AutoProcess', JSON.stringify(param));
  //     this.http.post(this.utilsService.serverVariableService.Validate_Process, formData).subscribe(
  //       (response: any) => {
  //         if (response.data.AutoProcess[0].Result == 'Job Process Successfull') {
  //         } else {
  //           this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something wrong' });
  //           this.impressionNo = '';
  //         }
  //       },
  //       (error) => {
  //         this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
  //       }
  //     );
  //   }
  // }

  async submitReworkProcess() {
    this.paramarray = [];
    for (let item of this.reworkProcessColln) {
        let OU = this.OUArray.filter((a: { TransactionNumber: any; }) => a.TransactionNumber == item.Transactionnumber);
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
            'FinalProcessID': this.ProcessID
        };
        this.paramarray.push(param);
        const formData = new FormData();
        formData.set('AutoProcess', JSON.stringify(param));
        await this.sendRequest(formData);
    }
  }

  async sendRequest(formData: FormData) {
      return new Promise<void>((resolve, reject) => {
          this.http.post(this.utilsService.serverVariableService.Validate_Process, formData).subscribe(
              (response: any) => {
                  if (response.data.AutoProcess[0].Result == 'Job Process Successfull') {
                      resolve();
                  } else {
                      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something wrong' });
                      this.impressionNo = '';
                      reject('Something wrong');
                  }
              },
              (error) => {
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
                  reject(error);
              }
          );
      });
  }

  cancelSkip(){
    this.SkipProcessListColln = this.SkipProcessListColln.filter((item: { Transactionnumber: string; })=>item.Transactionnumber!=this.oldImpNo);
    this.AllValidationArrayColln = this.AllValidationArrayColln.filter((item: { Transactionnumber: string; })=>item.Transactionnumber!=this.oldImpNo);
    this.arrayOfImpNo = this.arrayOfImpNo.filter((item: string)=> item != this.oldImpNo);
    this.newArrayOfImp = this.newArrayOfImp.filter((item: {JobEntryNo : any})=> item.JobEntryNo != this.oldImpNo);
    this.impressionNo='';
  }

  scannedData: string ='';
  selectedDevice: MediaDeviceInfo | undefined;
  camerasFoundHandler(devices: MediaDeviceInfo[]): void {
    this.selectedDevice = devices[0];
  }

  handleScanImpression(result:any):void{
    this.stopScanner();
    this.beepService.playBeepSound();
    if (result) {
      this.scannedData = result;
      this.impressionNo = this.scannedData;
      // this.stopScanner();
      this.validateProcess();
    }
  }

  handleScanEmployee(result:any):void{
    this.stopScanner();
    this.beepService.playBeepSound();
    if (result) {
      this.scannedData = result;
      this.getMockEmployee(this.scannedData,1);
      this.validateEmployee();
    }
  }
  handleScanError(error: any): void {
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
