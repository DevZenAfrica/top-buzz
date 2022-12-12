import { Injectable } from '@angular/core';
import { Utilisateur } from '../models/utilisateur';
import firebase from 'firebase';
import {Article} from "../models/article";

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {

  constructor() { }

  async getUtilisateurWitchPhoneNumber(numero: string) {
    return new Promise<Utilisateur>((resolve, reject) => {
      firebase.firestore().collection('comptes').where('phone', '==', numero).onSnapshot(
        (docRef) => {
          const result: Comment[] = [];
          docRef.forEach(function(doc) {
            result.push(doc.data() as Comment);
          });
          resolve(result.length > 0 ? result[0] as any : null);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  updateAbonneeUser(userAuthor: Utilisateur, idUserAbonnee: string) {
    return new Promise<void>((resolve, reject) => {
      // @ts-ignore
      firebase.firestore().collection('comptes').doc(userAuthor.id).update(
        {
          abonnees: userAuthor.abonnees.includes(idUserAbonnee) ? firebase.firestore.FieldValue.arrayRemove(idUserAbonnee) : firebase.firestore.FieldValue.arrayUnion(idUserAbonnee)
        }
      ).then(
        () => {
          resolve();
        }
      );
    });
  }

  async getUtilisateurWitchId(id: string) {
    return new Promise<Utilisateur>((resolve, reject) => {
      firebase.firestore().collection('comptes').doc(id).get().then(
        (docRef) => {
          resolve(docRef.data() as Utilisateur);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  updateCurrentUser(userUpdate: Utilisateur) {
    return new Promise<void>((resolve, reject) => {
      firebase.firestore().collection('comptes').doc(localStorage.getItem('id')).set(Object.assign({}, userUpdate)).then(
        () => {
          resolve();
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  async getCurrentUtilisateur() {
    return new Promise<Utilisateur>((resolve, reject) => {
      firebase.firestore().collection('comptes').doc(localStorage.getItem('id')).get().then(
        (docRef) => {
          resolve(docRef.data() as Utilisateur);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
}
