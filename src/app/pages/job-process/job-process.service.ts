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
  constructor(public http: HttpClient, public router: Router,private route: ActivatedRoute,private cookieService:CookieService,
    public serverVariableService: ServerVariableService,) { 
    this.keyword = "name";
    this.getAllDropDownData();
    
    if(this.cookieService.get('LocationID')!=="undefined" && this.cookieService.get('LocationID')!==""){
      // this.LocationID = JSON.parse(this.cookieService.get("LocationID"));
      // console.log(typeof(this.cookieService.get("LocationID")));
      this.LocationID = this.arrayForLocationList.filter(item=>item.id==parseInt(this.cookieService.get("LocationID")));
      console.log(parseInt(this.cookieService.get("LocationID")));
    }
    // if(this.cookieService.get('EmployeeID')!=="undefined" && this.cookieService.get('EmployeeID')!==""){
    //   this.LocationID = JSON.parse(this.cookieService.get("EmployeeID"));
    // }
    // if(this.cookieService.get('DepartmentID')!=="undefined" && this.cookieService.get('DepartmentID')!==""){
    //   this.LocationID = JSON.parse(this.cookieService.get("DepartmentID"));
    // }
    // if(this.cookieService.get('ProcessID')!=="undefined" && this.cookieService.get('ProcessID')!==""){
    //   this.LocationID = JSON.parse(this.cookieService.get("ProcessID"));
    // }
    // this.cookieService.get('locationID')
    
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
       },
      (error) => {
        console.error('Error:', error);
      }
    );
  }
  onSelectDepartment() {
    this.ProcessID = null;
    this.processJob =true;
      const param = {
        'SSCID': 3033,
        'OrganizationUnitID': 0,
        'LoginUserID':1 ,
        'LoginReferenceID': 864,
        'LoginRoleID': 1,
        'LoginCompanyID': 1,
        'innerSituationID': 40,
        'ModuleID' : 2
      };
     this.postProcess(param);
  
    }
    postProcess(data:any){
      const apiUrl = 'http://uat.illusiondentallab.com/API_2020/api/Common/GetCommonList_New';
      return this.http.post(apiUrl,data).subscribe(
        (response: any) => {
         this.arrayForProcessList =response.data.Data;
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
    this.getMockEmployee(search.query);
    }

    getMockEmployee(term:any){
      const param = {
        'Keyword': term,
        'SSCID': 9006,
        'OrganizationUnitID': 0,
        'LoginCompanyID':1,
        'LoginUserID':1,
        'LoginReferenceID':864, 
        'innerSituationID': 46
      };
      this.postData(param)
    }
    postData(data: any) {
      const apiUrl = 'http://uat.illusiondentallab.com/API_2020/api/JobEntry/GetJobEntry_Customer';
      return this.http.post(apiUrl, data).subscribe(
        (response: any) => {
         this.arryforEmployee = [...response.data.Customer]
      },
        (error) => {
          console.error('Error:', error);
        }
      );
    }
    
    onSelectEmployee(){
  console.log(this.employee);
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
  expiryCookiesDate: any;
  onSubmitSettingModal(){
    
  //  let location =this.LocationID.id;
    // this.cookieService.set('LocationID', JSON.stringify(location), 365000);
    this.cookieService.set("LocationID",this.LocationID.id.toString(),this.expiryCookiesDate);

     console.log(this.LocationID);
    //  this.cookieService.set('DepartmentID', JSON.stringify(this.DepartmentID), 365000);
    //  this.cookieService.set('ProcessID', JSON.stringify(this.ProcessID), 365000);
    //  this.cookieService.set('employee', JSON.stringify(this.employee), 365000);
     this.Location=JSON.stringify(this.LocationID.name);
     this.Department=JSON.stringify(this.DepartmentID.name);
     this.Process=JSON.stringify(this.ProcessID.name);

  }
}
