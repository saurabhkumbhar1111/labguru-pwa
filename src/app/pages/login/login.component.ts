import { Component, OnInit } from '@angular/core';
import { LoginService } from './login.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers :[MessageService]
})
export class LoginComponent extends LoginService implements OnInit {
  ngOnInit() {
    // this.applyValidation();
  }

}
