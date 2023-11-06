import { Component } from '@angular/core';
import { StorageListnerService } from '../../../services/storage-listner.service';
import { UtilsService } from 'src/app/services/utils.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  UserData: any;
  constructor(public utilsService: UtilsService, public storageListernerService: StorageListnerService, public http: HttpClient) {
    const userDataString = sessionStorage.getItem('user');
    this.UserData = userDataString ? JSON.parse(userDataString) : {};
  }
}
