import { Injectable } from '@angular/core';
import { Pays } from '../models/pays';
import firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class PaysService {

  constructor() { }

  async getPays() {
    return new Promise<Pays[]>((resolve, reject) => {
      // @ts-ignore
      firebase.firestore().collection('pays').onSnapshot(
        (docRef) => {
          const result: Pays[] = [];
          docRef.forEach(function(doc) {
            result.push(doc.data() as Pays);
          });
          resolve(result as any);
        }, (error) => {
          reject(error);
        }
      );
    });
  }

  addCountry(country: Pays) {
    return new Promise<void>((resolve, reject) => {
      firebase.firestore().collection('pays').doc(country.id).set(Object.assign({}, country)).then(
        () => {
          resolve();
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  async getPaysWitchId(idPays: string) {
    return new Promise<Pays>((resolve, reject) => {
      firebase.firestore().collection('pays').where('id', '==', idPays).onSnapshot(
        (docRef) => {
          let result: Pays;
          docRef.forEach(function(doc) {
            result = doc.data() as Pays;
          });
          resolve(result as Pays);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
}
