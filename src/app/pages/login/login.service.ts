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


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  loginForm: FormGroup;
  arrayOfData: any[] = [];
  loginResponse = new User();
  flagForPasswordHideShow: boolean | undefined;
  hide = true;
  userOb = {
    code: undefined,
    password: undefined
  };
  Impression: string | undefined;

  constructor(private http: HttpClient, public utilsService: UtilsService, public storageService: StorageListnerService, public _formBuilder: FormBuilder, private route: ActivatedRoute) {
    this.flagForPasswordHideShow = true;
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

  loginAPI() {
    if (this.loginForm.valid) {
      const params = {
        'UserName': this.userOb.code,
        'Password': this.userOb.password,
        'SituationID': 1,
        'UUID': 230221
      }
      const formData = new FormData();
      formData.append('Login', JSON.stringify(params));

      // this.utilsService.postMethodAPI(false, this.utilsService.serverVariableService.PostLoginAPI, formData, (response, isResponseOnPage) => {
      //   this.loginResponse = Deserialize(response['Login_Data'], User);
      //   const token = response['Token'];
      // }
      // );
      this.postData(formData)
    }
  }

  postData(data: any) {
    const apiUrl = 'http://uat.illusiondentallab.com/API_2020/api/MobileApp/Login';
    return this.http.post(apiUrl, data).subscribe(
      (response: any) => {
        const { LoginUserID, LoginUserCode, LoginUser, EmailID, DisplayName} = response?.data?.Login[0]
        const userData: any = {
          LoginUserID,
          LoginUserCode,
          LoginUser,
          EmailID,
          DisplayName
        };
        if (response?.data?.Login[0].Message === "Success") {
          this.setLocalStorage(userData)
          this.utilsService.redirectTo('/admin/work_area/home');
        } else {
          alert("Error: " + (response?.data?.Login[0]?.Message || "Something went Wrong"));
        }
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
