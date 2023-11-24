import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServerVariableService {
  constructor() { }

  // Drop Down Keys
  static RX_TYPE = 'RxType';
  static OU = 'OU';
  static LOCATION = 'Location';
  

  //URL
  // URL = 'https://uat.illusiondentallab.com/API_2020/';
  URL = 'https://localhost:44354/';
  // PATH For API

  PATH_FOR_API = this.URL+'api/';

  // API for Login and Logout

  PostLoginAPI = this.PATH_FOR_API + 'Login/PostLogin';
  PostForgotPasswordAPI = this.PATH_FOR_API + 'Login/Profile_Forgot_Password';
  GetCommonList = this.PATH_FOR_API + 'Common/GetCommonList';
  getAllDropDownDataAPI_new = this.PATH_FOR_API + 'Common/GetCommonList_New';
  GetJobEntry_CustomerAPI = this.PATH_FOR_API + 'JobEntry/GetJobEntry_Customer';
  Validate_Process = this.PATH_FOR_API + 'JobProcess/AutoProcess';
}
