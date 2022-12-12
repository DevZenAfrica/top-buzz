import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import firebase from 'firebase';
import {AuthentificationService} from './authentification.service';

declare function getMsisdn(): any;

@Injectable({
  providedIn: 'root'
})
export class LogCaptureService {

  constructor(private router: Router, private authService: AuthentificationService) { }

  getLogEvent(event) {
    this.saveLogInDataBase({ zoneClick :  event.target.textContent, linkOpen: this.router.url, idUser: localStorage.getItem('id') ? localStorage.getItem('id') : this.authService.getAnonymeId(), ayobaApp: getMsisdn() ? true : false, date: (new Date()).toString()});
  }

  saveLogInDataBase(data) {
    firebase.firestore().collection('logs-events').doc().set(Object.assign({}, data));
  }
}
