import { Injectable, ViewChild } from '@angular/core';
import {UtilsService} from '../../services/utils.service'
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ServerVariableService } from 'src/app/services/server-variable.service';
import { Deserialize } from 'cerialize';
import { CookieService } from 'ngx-cookie-service';

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
  constructor(public http: HttpClient,public UtilsService:UtilsService, public router: Router,private route: ActivatedRoute,private cookieService:CookieService,
    public serverVariableService: ServerVariableService,) { 
    this.keyword = "name";
    this.getAllDropDownData();
    if(this.cookieService.get('employeeName')!=="undefined" && this.cookieService.get('employeeName')!==""){
      // this.arrayForLocationList.filter((item)=>{if(item.id ==this.cookieService.get("LocationID")){
      //   this.LocationID = item;
      //   this.Location=JSON.stringify(this.LocationID.name);
    
      // }});
      console.log(this.cookieService.get('employeeName').split(' - '));
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
    const apiUrl = 'http://uat.illusiondentallab.com/API_2020/api/Common/GetCommonList';
    return this.http.post(apiUrl, data).subscribe(
      (response: any) => {
        this.arrayForDepartmentList = response.data.Department_DDL;
        this.arrayForLocationList =response.data.LineLocation;
        if(this.cookieService.get('LocationID')!=="undefined" && this.cookieService.get('LocationID')!==""){
            this.arrayForLocationList.filter((item)=>{if(item.id ==this.cookieService.get("LocationID")){
              this.LocationID = item;
              this.Location=JSON.stringify(this.LocationID.name);
          
            }});
        }
        if(this.cookieService.get('DepartmentID')!=="undefined" && this.cookieService.get('DepartmentID')!==""){
          this.arrayForDepartmentList.filter((item)=>{if(item.id ==this.cookieService.get("DepartmentID")){
            this.DepartmentID = item;
            this.Department=JSON.stringify(this.DepartmentID.name);
            this.onSelectDepartment();

          }});
      }
    //   if(this.cookieService.get('ProcessID')!=="undefined" && this.cookieService.get('ProcessID')!==""){
    //     this.arrayForProcessList.filter((item)=>{if(item.id ==this.cookieService.get("ProcessID")){
    //       this.ProcessID = item;
    //       this.Process=JSON.stringify(this.ProcessID.name);

    //     }});
    // }
      },
      (error) => {
        console.error('Error:', error);
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
        'ModuleID' :!this.UtilsService.isNullUndefinedOrBlank(this.DepartmentID.id)?parseInt(this.DepartmentID.id):0
      };
     this.postProcess(param);
    }
    // }
    postProcess(data:any){
      const apiUrl = 'http://uat.illusiondentallab.com/API_2020/api/Common/GetCommonList_New';
      return this.http.post(apiUrl,data).subscribe(
        (response: any) => {
         this.arrayForProcessList =response.data.Data;
         if(this.cookieService.get('ProcessID')!=="undefined" && this.cookieService.get('ProcessID')!==""){
          this.arrayForProcessList.filter((item)=>{if(item.id ==this.cookieService.get("ProcessID")){
            this.ProcessID = item;
            this.Process=JSON.stringify(this.ProcessID.name);
  
          }});
      }
      },
        (error) => {
          console.error('Error:', error);
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
      const apiUrl = 'http://uat.illusiondentallab.com/API_2020/api/JobEntry/GetJobEntry_Customer';
      return this.http.post(apiUrl, data).subscribe(
        (response: any) => {
         this.arryforEmployee = [...response.data.Customer];
          if(id==1){
            this.employee = this.arryforEmployee[0];
          }
        },
        (error) => {
          console.error('Error:', error);
        }
      );
      
    }
    selectedEmployee :any;
    onSelectEmployee(){
  this.selectedEmployee = this.arryforEmployee.find((item: { id: number; }) =>item.id ==this.employee.id)
 console.log(this.selectedEmployee);
  
}

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
  onSubmitSettingModal(){
    this.cookieService.set("LocationID",this.LocationID.id.toString(),this.expiryCookiesDate);
    this.cookieService.set("DepartmentID",this.DepartmentID.id.toString(),this.expiryCookiesDate);
    this.cookieService.set("ProcessID",this.ProcessID.id.toString(),this.expiryCookiesDate);
    this.cookieService.set("employeeId",this.employee.id.toString(),this.expiryCookiesDate);
    this.cookieService.set("employeeName",this.employee.name.toString(),this.expiryCookiesDate);
    this.Location=JSON.stringify(this.LocationID.name);
    this.Department=JSON.stringify(this.DepartmentID.name);
    this.Process=JSON.stringify(this.ProcessID.name);
  }
}
