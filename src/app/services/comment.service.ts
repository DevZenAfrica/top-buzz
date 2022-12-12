import { Injectable } from '@angular/core';
import firebase from 'firebase';
import {Report} from '../models/report';
import {Comment} from '../models/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor() { }

  async getCommentWitchId(idArticle: string) {
    return new Promise<Comment>((resolve, reject) => {
      firebase.firestore().collection('comments').doc(idArticle).get().then(
        (docRef) => {
          resolve(docRef.data() as Comment);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  async likeComment(comment: Comment) {
    return new Promise<void>((resolve, reject) => {
      firebase.firestore().collection('comments').doc(comment.id).update(
        {
          likes: comment.likes.includes(localStorage.getItem('id')) ? firebase.firestore.FieldValue.arrayRemove(localStorage.getItem('id')) : firebase.firestore.FieldValue.arrayUnion(localStorage.getItem('id')),
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

  async disLikeComment(comment: Comment) {
    return new Promise<void>((resolve, reject) => {
      firebase.firestore().collection('comments').doc(comment.id).update(
        {
          disLikes: comment.disLikes.includes(localStorage.getItem('id')) ? firebase.firestore.FieldValue.arrayRemove(localStorage.getItem('id')) : firebase.firestore.FieldValue.arrayUnion(localStorage.getItem('id')),
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

  async updateComment(comment: Comment) {
    return new Promise<void>((resolve, reject) => {
      firebase.firestore().collection('comments').doc(comment.id).set(Object.assign({}, comment)).then(
        () => {
          resolve();
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  async getReponseComment(idComment: string) {
    return new Promise<Comment[]>((resolve, reject) => {
      // @ts-ignore
      firebase.firestore().collection('comments').where('idParent', '==', idComment).orderBy('date', 'desc').onSnapshot(
        (docRef) => {
          const result: Comment[] = [];
          docRef.forEach(function(doc) {
            result.push(doc.data() as Comment);
          });
          resolve(result as any);
        }, (error) => {
          reject(error);
        }
      );
    });
  }

  async getComments(idArticle: string) {
    return new Promise<Comment[]>((resolve, reject) => {
      // @ts-ignore
      firebase.firestore().collection('comments').where('idArticle', '==', idArticle).orderBy('date', 'desc').onSnapshot(
        (docRef) => {
          const result: Comment[] = [];
          docRef.forEach(function(doc) {
            result.push(doc.data() as Comment);
          });
          resolve(result as any);
        }, (error) => {
          reject(error);
        }
      );
    });
  }

  async addNewComment(comment: Comment) {
    return new Promise<void>((resolve, reject) => {
      firebase.firestore().collection('comments').doc(comment.id).set(Object.assign({}, comment)).then(
        () => {
          resolve();
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  async addNewReport(report: Report) {
    return new Promise<void>((resolve, reject) => {
      firebase.firestore().collection('reportsComments').doc(report.id).set(Object.assign({}, report)).then(
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
