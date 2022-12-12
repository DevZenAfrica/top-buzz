import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ToolsService } from './tools.service';
import { UtilisateurService } from './utilisateur.service';
import {ApiService} from './api.service';
import firebase from 'firebase';
import {Utilisateur} from '../models/utilisateur';
import {PaysService} from './pays.service';
import {environment} from '../../environments/environment';
import {TranslateService} from '@ngx-translate/core';

declare function getURLParameter(sParam: any): any;
declare function getMsisdn(): any;
declare function getCountry(): any;
declare const globalUserName: any;
declare const avatarUser: any;

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  constructor(private translate: TranslateService, private sanitizer: DomSanitizer, private apiService: ApiService, private toolsService: ToolsService, private userService: UtilisateurService, private paysService: PaysService) { }

  signInUser(email: string, password: string) {
    return new Promise<void>((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(email, password).then(
        () => {
          resolve();
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  async numberAuth(numberPhone, windowRef) { //Make sure phone number in e164 format
    const appVerifier = windowRef.recaptchaVerifier;
    return new Promise<any>((resolve, reject) => {
      firebase.auth().signInWithPhoneNumber(numberPhone, appVerifier)
        .then(
          (result) => {
            resolve(result);
          }, (error) => {
            reject(error);
          });
    });
  }

  getAnonymeId() {
    if(localStorage.getItem('guestId')) {
      return localStorage.getItem('guestId');
    } else {
      localStorage.setItem('guestId', 'guest_' + this.toolsService.generateId(17));
      return localStorage.getItem('guestId');
    }
  }

  async googleAuth() {
    return new Promise<void>((resolve, reject) => {
      firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(
        (data) => {
          localStorage.setItem('id', data.user.email);
          const tmpInfo: any = data.additionalUserInfo ? data.additionalUserInfo.profile : null;
          this.isRegister(tmpInfo.email).then(
            (rep) => {
              if (!rep) {
                const tmpUser = new Utilisateur(tmpInfo.name, '', tmpInfo.email, 1, '0000', 'google');
                tmpUser.photo = tmpInfo.picture;
                this.saveToDataBase(tmpUser).then(
                  () => {
                    resolve();
                  }, (error) => {
                    reject(error);
                  }
                );
              } else {
                resolve();
              }
            },
            (error) => {
              reject(error);
            }
          );
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  isRegister(info: string) {
    return new Promise<Utilisateur>((resolve, reject) => {
      firebase.firestore().collection('comptes').doc(info).get().then(
        (docRef) => {
          resolve(docRef.exists ? docRef.data() as any : null);
        },
        (error) => {
          console.log(error);
        }
      );
    });
  }

  async saveToDataBase(user: Utilisateur) {
    return new Promise<void>((resolve, reject) => {
      if(user.phone) { user.id = user.phone; } else { user.id = user.email; }
      this.apiService.getDataWitchApi(environment.apiGetIpAdress + environment.keyGetIpAdress, 'json').then(
        (data) => {
          user.ipAdressInfo = JSON.stringify(data);
          firebase.firestore().collection('comptes').doc(user.id).set(Object.assign({}, user)).then(
            () => {
              resolve();
            },
            (error) => {
              reject(error);
            }
          );
        }, (error) => {
          firebase.firestore().collection('comptes').doc(user.id).set(Object.assign({}, user)).then(
            () => {
              resolve();
            },
            (error0) => {
              reject(error0);
            }
          );
        });
    });
  }

  async isAuthenticated() {
    return new Promise<boolean>((resolve, reject) => {
      if(localStorage.getItem('id')) {
        this.userService.getCurrentUtilisateur().then(
          (data) => {
            localStorage.setItem('paysSelect', data.idCountry);
            localStorage.setItem('language', data.language);
            if(data.language) { this.translate.setDefaultLang(data.language); }
            resolve(true);
          }
        );
      } else {
        if(getMsisdn()) {
          localStorage.setItem('id', getMsisdn());
          this.isRegister(getMsisdn()).then(
            (rep) => {
              if (!rep) {
                const tmpUser: Utilisateur = new Utilisateur(globalUserName ? globalUserName.slice(0, 10) : null, getMsisdn(), '', 1, '0000', 'ayoba');
                tmpUser.idCountry = getCountry();
                //tmpUser.jidAyoba = getURLParameter('jid');  // A remettre s'il y'a pas d'erreur dans ayoba
                //tmpUser.photo = avatarUser;
                localStorage.setItem('paysSelect', getCountry());
                this.saveToDataBase(tmpUser).then(
                  () => {
                    resolve(true);
                  }, (error) => {
                    reject(error);
                  }
                );
              } else {
                resolve(true);
              }
            },
            (error) => {
              reject(error);
            }
          );
        } else {
          firebase.auth().onAuthStateChanged((user) => {
            if (user) {
              resolve(true);
            } else {
              resolve(false);
            }
          });
        }
      }
    });
  }

  async signOut() {
    return new Promise<void>((resolve, reject) => {
      firebase.auth().signOut().then(
        () => {
          resolve();
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  async isSignUp(phone: string) {
    return new Promise<boolean>((resolve, reject) => {
      firebase.firestore().collection('comptes').where('phone', '==', phone).onSnapshot(
        (doc) => {
          resolve(!doc.empty);
        });
    });
  }
}
