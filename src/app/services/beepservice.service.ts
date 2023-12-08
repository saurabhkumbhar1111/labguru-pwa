import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BeepserviceService {

  playBeepSound(): void {
    const beep = new Audio('assets/sound/beep.mp3'); 
    beep.play();
  }  
}
