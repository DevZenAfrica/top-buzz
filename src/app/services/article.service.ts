import { Injectable } from '@angular/core';
import { Article } from '../models/article';
import firebase from 'firebase';
import {Report} from "../models/report";
import {StorageService} from "./storage.service";
import {QuickPoll} from "../models/quickPoll";

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(private storageService: StorageService) { }

  async getArticleMostView() {
    return new Promise<Article[]>((resolve, reject) => {
      // @ts-ignore
      firebase.firestore().collection('articles')
        .orderBy('vues', 'asc')
        .onSnapshot(
        (docRef) => {
          const result: Article[] = [];
          const pointe = this;
          docRef.forEach(function(doc) {
            if((doc.data() as Article).status !== 0) {
              if((doc.data() as Article).idCountry.length === 0 || ((doc.data() as Article).idCountry.length > 0 && (doc.data() as Article).idCountry.includes(pointe.storageService.getItem('paysSelect'))))
              {result.push(doc.data() as Article);}
            }
          });
          resolve(result as any);
        }, (error) => {
          reject(error);
        }
      );
    });
  }

  async getQuickPollWitchArticle(idArticle: string) {
    return new Promise<QuickPoll>((resolve, reject) => {
      // @ts-ignore
      firebase.firestore().collection('quick-poll').where('idArticle', '==', idArticle).onSnapshot(
        (docRef) => {
          let result: QuickPoll;
          docRef.forEach(function(doc) {
            result = doc.data() as any;
          });
          resolve(result as any);
        }, (error) => {
          reject(error);
        }
      );
    });
  }

  async getArticleHaveTag() {
    return new Promise<Article[]>((resolve, reject) => {
      // @ts-ignore
      firebase.firestore().collection('articles')
        .orderBy('tags', 'asc')
        .onSnapshot(
          (docRef) => {
            const result: Article[] = [];
            const pointe = this;
            docRef.forEach(function(doc) {
              if((doc.data() as Article).status !== 0 && (doc.data() as Article).status !== 0) {
                if((doc.data() as Article).idCountry.length === 0 || ((doc.data() as Article).idCountry.length > 0 && (doc.data() as Article).idCountry.includes(pointe.storageService.getItem('paysSelect'))))
                {result.push(doc.data() as Article);}
              }
            });
            resolve(result as any);
          }, (error) => {
            reject(error);
          }
        );
    });
  }

  async addQuickPoll(value: any) {
    return new Promise<void>((resolve, reject) => {
      // @ts-ignore
      firebase.firestore().collection('quick-poll').doc(value.id).set(Object.assign({}, value)).then(
        () => {
          resolve();
        }, (error) => {
          reject(error);
        }
      );
    });
  }

  async add(value: any) {
    return new Promise<void>((resolve, reject) => {
      // @ts-ignore
      firebase.firestore().collection('articles').doc(value.id).set(Object.assign({}, value)).then(
        () => {
          resolve();
        }, (error) => {
          reject(error);
        }
      );
    });
  }

  async addNewReport(report: Report) {
    return new Promise<void>((resolve, reject) => {
      firebase.firestore().collection('reportsArticle').doc(report.id).set(Object.assign({}, report)).then(
        () => {
          resolve();
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  async updateVues(article: Article, idUser) {
    return new Promise<void>((resolve, reject) => {
      // @ts-ignore
      firebase.firestore().collection('articles').doc(article.id).update(
        {
          vues: firebase.firestore.FieldValue.arrayUnion(idUser)
        }
      ).then(
        () => {
          resolve();
        }
      );
    });
  }

  async getTopArticles() {
    return new Promise<Article[]>((resolve, reject) => {
      // @ts-ignore
      firebase.firestore().collection('articles').where('status', '==', 1).where('top', '==', 1).onSnapshot(
        (docRef) => {
          const result: Article[] = [];
          const pointe = this;
          docRef.forEach(function(doc) {
            if((doc.data() as Article).idCountry.length === 0 || ((doc.data() as Article).idCountry.length > 0 && (doc.data() as Article).idCountry.includes(pointe.storageService.getItem('paysSelect')))) {
              result.push(doc.data() as Article);
            }
          });
          resolve(result as any);
        }, (error) => {
          reject(error);
        }
      );
    });
  }

  async getAllArticles() {
    return new Promise<Article[]>((resolve, reject) => {
      // @ts-ignore
      firebase.firestore().collection('articles')
        .where('status', '==', 1)
        .orderBy('date', 'desc').onSnapshot(
        (docRef) => {
          const result: Article[] = [];
          const pointe = this;
          docRef.forEach(function(doc) {
            if((doc.data() as Article).idCountry.length === 0 || ((doc.data() as Article).idCountry.length > 0 && (doc.data() as Article).idCountry.includes(pointe.storageService.getItem('paysSelect')))) {
              result.push(doc.data() as Article);
            }
          });
          resolve(result as any);
        }, (error) => {
          reject(error);
        }
      );
    });
  }

  async getArticles(categorie: string) {
    return new Promise<Article[]>((resolve, reject) => {
      // @ts-ignore
      firebase.firestore().collection('articles').where('status', '==', 1).where('categorie', '==', categorie).orderBy('date', 'desc').onSnapshot(
        (docRef) => {
          const result: Article[] = [];
          const pointe = this;
          docRef.forEach(function(doc) {
            if((doc.data() as Article).idCountry.length === 0 || ((doc.data() as Article).idCountry.length > 0 && (doc.data() as Article).idCountry.includes(pointe.storageService.getItem('paysSelect')))) {
              result.push(doc.data() as Article);
            }
          });
          resolve(result as any);
        }, (error) => {
          reject(error);
        }
      );
    });
  }

  async getArticleWitchTag(tag: string) {
    return new Promise<Article[]>((resolve, reject) => {
      firebase.firestore().collection('articles').where('status', '==', 1).where('tags', 'array-contains', tag).get().then(
        (docRef) => {
          const result: Article[] = [];
          docRef.forEach(function(doc) {
            if(doc.data().status !== 0) {
              result.push(doc.data() as Article);
            }
          });
          resolve(result as any);
        }, (error) => {
          reject(error);
        }
      );
    });
  }

  async getArticleWitchId(idArticle: string) {
    return new Promise<Article>((resolve, reject) => {
      firebase.firestore().collection('articles').doc(idArticle).get().then(
        (docRef) => {
          resolve(docRef.data() as Article);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  async likeArticle(article: Article) {
    return new Promise<void>((resolve, reject) => {
      firebase.firestore().collection('articles').doc(article.id).update(
        {
          likes: article.likes.includes(localStorage.getItem('id')) ? firebase.firestore.FieldValue.arrayRemove(localStorage.getItem('id')) : firebase.firestore.FieldValue.arrayUnion(localStorage.getItem('id')),
          disLikes: firebase.firestore.FieldValue.arrayRemove(localStorage.getItem('id'))
        }
      ).then(
        () => {
          resolve();
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  async disLikeArticle(article: Article) {
    return new Promise<void>((resolve, reject) => {
      firebase.firestore().collection('articles').doc(article.id).update(
        {
          disLikes: article.disLikes.includes(localStorage.getItem('id')) ? firebase.firestore.FieldValue.arrayRemove(localStorage.getItem('id')) : firebase.firestore.FieldValue.arrayUnion(localStorage.getItem('id')),
          likes: firebase.firestore.FieldValue.arrayRemove(localStorage.getItem('id'))
        }
      ).then(
        () => {
          resolve();
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

}
