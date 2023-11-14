import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from 'src/app/services/utils.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {
  forgotPwdForm: FormGroup;

  constructor(private http: HttpClient, public utilsService: UtilsService, private route: ActivatedRoute, private formBuilder: FormBuilder) {
    this.forgotPwdForm = this.formBuilder.group({
      UserName: ['', [Validators.required]]
    });
  }

  forgotPassApi() {
    const userNameControl = this.forgotPwdForm.get('UserName');
    if (userNameControl?.valid) {
      const param = {
        'Code': userNameControl.value
      };
      // const formData = new FormData();
      // formData.append('ForgotPassword', JSON.stringify(param));
      this.postData(param);
    }
  }

  postData(data: any) {
    const apiUrl = 'http://uat.illusiondentallab.com/API_2020/api/Login/Profile_Forgot_Password';
    this.http.post(apiUrl, data).subscribe(
      (response: any) => {
        return alert(response?.message);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }
}
