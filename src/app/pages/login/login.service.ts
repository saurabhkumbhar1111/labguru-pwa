import { UtilsService } from '../../services/utils.service';
import { Deserialize, Serialize } from 'cerialize';
import { StorageListnerService } from '../../services/storage-listner.service';
import { Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Injectable } from '@angular/core';
import { User } from '../../../model/User';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  loginForm: FormGroup;
  arrayOfData: any[] = [];
  loginResponse = new User();
  flagForPasswordHideShow: boolean | undefined;
  ipAddress:any;
  hide = true;
  userOb = {
    code: undefined,
    password: undefined
  };
  Impression: string | undefined;

  constructor(private http: HttpClient, public utilsService: UtilsService, public storageService: StorageListnerService, public _formBuilder: FormBuilder, private route: ActivatedRoute,private messageService: MessageService) {
    this.flagForPasswordHideShow = true;
    this.getIp();
    // this.utilsService.getIp();
    this.loginForm = this._formBuilder.group({
      code: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])]
    });
  }

  applyValidation(): void {
    this.loginForm = this._formBuilder.group({
      code: ['', [Validators.required, Validators.compose([Validators.pattern(this.utilsService.validationService.PATTERN_FOR_ALPHANUMERIC_DIGIT_SPECIAL_ESCAPE_CHARS)])]],
      password: ['', Validators.compose([Validators.required])]
    });
  }
  getIp() {
    this.http.get<{ ip: string }>('https://api.ipify.org?format=json')
      .subscribe(data => {
        this.ipAddress = data;
        return data.ip;
      });
  }

  loginAPI() {
    if (this.loginForm.valid) {
      const params = {
        'Code': this.userOb.code,
        'Password': this.userOb.password,
        'Ip':this.ipAddress.ip
      }
      // const params = {
      //   'UserName': this.userOb.code,
      //   'Password': this.userOb.password,
      //   'SituationID': 1,
      //   'UUID': 230221
      // }
      // const formData = new FormData();
      // formData.append('Login', JSON.stringify(params));

      // this.utilsService.postMethodAPI(false, this.utilsService.serverVariableService.PostLoginAPI, formData, (response, isResponseOnPage) => {
      //   this.loginResponse = Deserialize(response['Login_Data'], User);
      //   const token = response['Token'];
      // }
      // );
      this.postData(params)
    }
  }
  
  postData(data: any) {
    this.utilsService.loaderStart--;
    return this.http.post(this.utilsService.serverVariableService.PostLoginAPI, data).subscribe(
      (response: any) => {
        const { LoginUserID, LoginUserCode, LoginUser, EmailID, Profile, LoginCompanyID, LoginRoleID, FinancialYearID, LoginReferenceID} = response?.data?.Login_Data
        const userData: any = {
          LoginUserID,
          LoginUserCode,
          LoginUser,
          EmailID,
          Profile,
          LoginCompanyID,
          LoginRoleID,
          FinancialYearID,
          LoginReferenceID
        };
        if (response?.data?.Login_Data.ValidationMsg == "") {
          this.setLocalStorage(userData)
          this.utilsService.redirectTo('/admin/work_area/home');
        } else {
          // alert("Error: " + (response?.data?.Login_Data.ValidationMsg || "Something went Wrong"));
    // this.utilsService.toaster('warn',(response?.data?.Login_Data.ValidationMsg || "Something went Wrong"));
    this.messageService.add({ severity: 'warn', summary: 'Warn', detail: (response?.data?.Login_Data.ValidationMsg || "Something went Wrong") });
        }
        this.utilsService.loaderStart = 0;
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  setLocalStorage(loginResponse: User) {
    const promise = new Promise<void>((resolve, reject) => {
      try {
        this.storageService.store('user', JSON.stringify(loginResponse));

        resolve();
      } catch (error) {
        reject();
      }
    });
    return promise;
  }

}
