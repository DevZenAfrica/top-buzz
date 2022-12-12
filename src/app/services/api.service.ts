import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import firebase from 'firebase';
import {SafeResourceUrl} from "@angular/platform-browser";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getDataWitchApi(link, type: any = 'text') {
    const headers = new HttpHeaders()
      .set('Access-Control-Allow-Origin', '*')
      .set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    return new Promise<void>((resolve, reject) => {
        this.http.get(link, {headers, responseType: type}).subscribe({
          next: (res: any) => {
            resolve(res);
          },
          error: (err: any) => {
            reject(err);
          }
        });
      });
    }

  async putFileInServer(fileInBase64: string, extension: string) {

    const newFile: string = fileInBase64 ? fileInBase64.toString().substring(fileInBase64.toString().indexOf('base64,') + 7, fileInBase64.toString().indexOf('(see ') - 1) : '';

    const encodedParams = new URLSearchParams();
    encodedParams.append('extention', extension);
    encodedParams.append('fichier', newFile);

    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');

    return new Promise<any>((resolve, reject) => {
      if(fileInBase64 === '') {
        resolve('');
      } else {
        this.http.post(environment.apiCors + '/' + environment.apiServerFile, { extention: extension, fichier: newFile }, { headers, responseType: 'text'}).subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
      }
    });
  }

  async addMovieForAdresseId(name: string, adresse: string, image: SafeResourceUrl ) {
    // @ts-ignore
    return new Promise<string>((resolve, reject) => {
      if(image === '') {
        resolve('');
      } else {
        const imgStorageRef = firebase.storage().ref(adresse + '/' + name + '.mp4');
        const newPhoto: string = image.toString().substring(image.toString().indexOf('base64,') + 7, image.toString().indexOf('(see ') - 1);
        return imgStorageRef.putString(newPhoto, 'base64', {contentType: 'video/mp4'}).then(
          () => {
            return imgStorageRef.getDownloadURL().then(downloadUrl => {
              resolve(downloadUrl);
            });
          },
          (error) => {
            reject(error);
          }
        );
      }
    });
  }

  async addImageForAdresseId(name: string, adresse: string, image: SafeResourceUrl ) {
    // @ts-ignore
    return new Promise<string>((resolve, reject) => {
      if(image === '') {
        resolve('');
      } else {
        const imgStorageRef = firebase.storage().ref(adresse + '/' + name + '.png');
        const newPhoto: string = image.toString().substring(image.toString().indexOf('base64,') + 7, image.toString().indexOf('(see ') - 1);
        return imgStorageRef.putString(newPhoto, 'base64', {contentType: 'image/png'}).then(
          () => {
            return imgStorageRef.getDownloadURL().then(downloadUrl => {
              resolve(downloadUrl);
            });
          },
          (error) => {
            reject(error);
          }
        );
      }
    });
  }
}
