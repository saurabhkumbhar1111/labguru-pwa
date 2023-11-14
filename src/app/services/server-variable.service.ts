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

  // PATH For API

  PATH_FOR_API = 'api/';

  // API for Login and Logout

  PostLoginAPI = this.PATH_FOR_API + 'MobileApp/Login';
  PostForgotPasswordAPI = this.PATH_FOR_API + 'MobileApp/ForgotPassword';
  getAllDropDownDataAPI = this.PATH_FOR_API + 'Common/GetCommonList';
  getAllDropDownDataAPI_new = this.PATH_FOR_API + 'Common/GetCommonList_New';
  GetJobEntry_CustomerAPI = this.PATH_FOR_API + 'JobEntry/GetJobEntry_Customer';
  Validate_Process = this.PATH_FOR_API + 'JobProcess/AutoProcess';
}
