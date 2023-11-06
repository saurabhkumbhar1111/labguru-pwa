import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ServerVariableService } from './server-variable.service';
import { ValidationsService } from './validations.service';
import { Deserialize, Serialize } from 'cerialize';
import { ResponseWrapperDTO } from '../../model/ResponseWrapperDTO';
import { User } from '../../model/User';

declare var $: any;

@Injectable({
    providedIn: 'root'
})
export class UtilsService {

    static URL: string;
    static FRONT_URL = 'localhost:4200';
    ipAddress: any;
    profileUrl: string | undefined;
    loaderStart = 0;

    toastConfig = {
        disableTimeOut: true,
        timeOut: 0,
        positionClass: 'toast-top-center',
        closeButton: true,
    };

    dateFormate = 'dd-MM-yyyy';

    imagePreview: any;
    blankDataMessage: any;
    //   arrayForMenu: Array<Menu> = new Array<Menu>();
    hasViewRights!: boolean;

    // Start pass data login page to forogot-password page using service.
    data: string | undefined;
    setUserName(value: string | undefined) {
        this.data = value;
    }

    getUserName() {
        return this.data;
    }
    // End

    specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];
    regex: RegExp = new RegExp(/^[0-9]{0,2}$/g);

    constructor(public http: HttpClient, public router: Router,
        public serverVariableService: ServerVariableService,
        // public toasterService: ToastrService,
        public validationService: ValidationsService) {
        const user = this.getLoginUsers();
        if (user && !this.isNullUndefinedOrBlank(user)) {
            if (user.Profile) {
                this.profileUrl = user.Profile;
            } else {
                this.profileUrl = 'assets/images/1.jpg';
            }
        }

        this.http.get('assets/API_URL/API_URL.txt', { responseType: 'text' }).subscribe(data => {
            if (data.length > 0) {
                UtilsService.URL = data;
            }
            else {
                if (this.isNullUndefinedOrBlank(UtilsService.URL)) {
                    // this.toasterService.error('API URL Not Found!', 'Error', {
                    //     positionClass: 'toast-top-center',
                    //     closeButton: true
                    // });
                    alert('Error: API URL Not Found!')
                    return;
                }
            }
        })
    }

    postMethodAPI (formData : any, apiName : string) {
        if (formData && apiName) {
            let headers = new HttpHeaders();
        }
    }

    customJsonInclude(obj: any): void {
        for (const key in obj) {
            if (typeof obj[key] === 'object') {
                if (obj[key] && obj[key].length > 0) {
                    obj[key] = this.removeEmptyElementsFromArray(obj[key]);
                }
                if (this.isEmptyObject(obj[key])) {
                    delete obj[key];
                } else {
                    this.customJsonInclude(obj[key]);
                }
            } else {
                if (obj[key] === undefined || obj[key] === null) {
                    delete obj[key];
                }
            }
        }
    }

    removeEmptyElementsFromArray(test_array: string | any[]): Array<any> {
        let index = -1;
        const arr_length = test_array ? test_array.length : 0;
        let resIndex = -1;
        const result = [];

        while (++index < arr_length) {
            const id = test_array[index];
            if (id) {
                result[++resIndex] = id;
            }
        }
        return result;
    }

    isEmptyObject(obj: {}): boolean {
        return (obj && (Object.keys(obj).length === 0));
    }

    removeDuplicateSpaceFromString(str?: string): string | undefined {
        if (str === undefined) {
            return undefined;
        }
        return str.replace(/\s+/g, ' ');
    }



    isAuthenticated(): string | undefined {
        const result = sessionStorage.getItem('isAuthenticate');
        return result !== null ? result : undefined;
    }

    isNullUndefinedOrBlank(obj: string | number | User | null | undefined): boolean {
        if (obj === null || obj === undefined) {
            return true;
        }
        if (typeof obj === 'string' && obj.trim() === '') {
            return true;
        }
        if (typeof obj === 'number' && obj === 0) {
            return true;
        }
        return false;
    }


    isEmptyObjectOrNullUndefiend(...value: any[]): boolean {
        if (value && value.length > 0) {
            for (let i = 0; i < value.length; i++) {
                if (this.isNullUndefinedOrBlank(value[i]) || this.isEmptyObject(value[i])) {
                    return true;
                }
            }
        }
        return false;
    }

    redirectTo(...route: any[]): void {
        this.router.navigate(route);
    }

    hideModal(modalId: string) {
        $('' + '#' + modalId + '').modal('hide');
    }

    openModal(modalId: string) {
        $('' + '#' + modalId + '').modal({ backdrop: 'static', keyboard: false });
    }

    getLoginUsers(): User | undefined {
        const userData = sessionStorage.getItem('user');
        if (userData) {
            const user = Serialize(JSON.parse(userData), User);
            return user;
        }
        return undefined;
    }

    getIp() {
        this.http.get<{ ip: string }>('https://api.ipify.org?format=json')
            .subscribe(data => {
                this.ipAddress = data;
                return data.ip;
            });
    }

}
