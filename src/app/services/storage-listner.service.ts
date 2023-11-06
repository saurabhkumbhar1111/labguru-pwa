declare var chatlogout: Function;

import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { UtilsService } from './utils.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class StorageListnerService implements OnDestroy {

  private onSubject = new Subject<{ key: string, value: any }>();
  public changes = this.onSubject.asObservable();
  key = 'user';

  constructor(public router: Router, public utilsService: UtilsService) {
    this.start();
  }
  ngOnDestroy() {
    this.stop();
  }

  public store(key: string, data: any): void {

    sessionStorage.setItem(key, data);
    this.onSubject.next({ key: key, value: data });

  }
  public clear(): void {
    this.logoutAPI();
    const key = 'user';
    sessionStorage.clear();
    localStorage.clear();

    this.router.navigate(['/login']);

    this.onSubject.next({ key: key, value: null });
  }

  private start(): void {
    window.addEventListener('storage', this.storageEventListener.bind(this));
  }

  private storageEventListener(event: StorageEvent) {

    if (event.storageArea === sessionStorage) {

      let v: any;
      if (event.newValue !== null) {
        try {
          v = JSON.parse(event.newValue);
        } catch (e) {
          v = event.newValue;
        }
      } else {
        v = null;
      }
      const key = event.key || '';

      if (event.key === this.key) {
        if (!v) {

          this.router.navigate(['/kurate/login']);
        } else {
          this.utilsService.redirectTo('admin/work_area/Labguru');
        }
      }
      this.onSubject.next({ key, value: v });
    }
  }

  private stop(): void {
    window.removeEventListener('storage', this.storageEventListener.bind(this));
    this.onSubject.complete();
  }
  logoutAPI() {
    const user = this.utilsService.getLoginUsers();
    if (user) {
      sessionStorage.clear();
      localStorage.clear();
      this.utilsService.redirectTo('/login');
    }
  }
}
