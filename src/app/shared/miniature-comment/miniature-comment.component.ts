import {Component, Input, OnInit} from '@angular/core';
import {Utilisateur} from '../../models/utilisateur';
import {Comment} from '../../models/comment';
import {AlertController} from '@ionic/angular';
import {AuthentificationService} from '../../services/authentification.service';
import { AlertService } from 'src/app/services/alert.service';
import { CommentService } from 'src/app/services/comment.service';
import {UtilisateurService} from '../../services/utilisateur.service';
import {Report} from '../../models/report';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-miniature-comment',
  templateUrl: './miniature-comment.component.html',
  styleUrls: ['./miniature-comment.component.scss'],
})
export class MiniatureCommentComponent implements OnInit {

  @Input() idComment;
  @Input() data: Comment;

  currentUserComment: Utilisateur;
  reponseComment: Comment[] = [];
  currentUser: Utilisateur;

  constructor(private translate: TranslateService, private authService: AuthentificationService, private alertService: AlertService, private alertController: AlertController, private commentService: CommentService, private userService: UtilisateurService) { }

  ngOnInit() {
    this.userService.getUtilisateurWitchId(this.data.idUser).then(
      (data1) => {
        this.currentUserComment = data1;
      }
    );

    this.commentService.getReponseComment(this.idComment).then(
      (data2) => {
        this.reponseComment = data2;
      }
    );

    this.authService.isAuthenticated().then(
      (result) => {
        if(result) {
          this.userService.getCurrentUtilisateur().then(
            (data3) => {
              this.currentUser = data3;
            }
          );
        }
      }
    );
  }

  async repondreComment() {
    let txt1; let txt2;
    this.translate.get('18.1').subscribe((res: string) => {
      txt1 = res;
    });
    this.translate.get('18.2').subscribe((res: string) => {
      txt2 = res;
    });

    const alert = await this.alertController.create({
      header: '@' + this.currentUserComment.userName,
      buttons: [
        {
          text: txt2,
          role: 'confirm',
          handler: (reponse: any) => {
            this.sendComment(reponse.reponse);
          }
        }
      ],
      inputs: [
        {
          type: 'textarea',
          placeholder: txt1,
          name: 'reponse'
        }
      ]
    });

    await alert.present();
  }

  sendComment(texte: string) {
    if(texte) {
      const tmpComment = new Comment(this.data.idArticle, this.currentUser.id, this.data.id, texte);
      this.commentService.addNewComment(tmpComment).then(
        () => {
          this.reponseComment.unshift(tmpComment);
        }
      );
    }
  }

  diffTime(date: string){
    const diff: any = {};
    const date1: any = new Date(date);
    const date2: any = new Date();
    let tmp = date2 - date1;

    tmp = Math.floor(tmp/1000);             // Nombre de secondes entre les 2 dates
    diff.sec = tmp % 60;

    tmp = Math.floor((tmp-diff.sec)/60);    // Nombre de minutes (partie entière)
    diff.min = tmp % 60;

    tmp = Math.floor((tmp-diff.min)/60);    // Nombre d'heures (entières)
    diff.hour = tmp % 24;

    tmp = Math.floor((tmp-diff.hour)/24);   // Nombre de jours restants
    diff.day = tmp;

    return diff;
  }

  like() {
    this.commentService.likeComment(this.data).then(
      () => {
        if(this.data.likes.includes(this.currentUser.id))
        {this.data.likes.splice(this.data.likes.indexOf(this.currentUser.id), 1);}
        else
        {
          if(this.data.disLikes.includes(this.currentUser.id)) {
            this.dislike();
          }
          this.data.likes.push(this.currentUser.id);
        }
      }
    );
  }

  dislike() {
    this.commentService.disLikeComment(this.data).then(
      () => {
        if(this.data.disLikes.includes(this.currentUser.id))
        {this.data.disLikes.splice(this.data.disLikes.indexOf(this.currentUser.id), 1);}
        else
        {
          if(this.data.likes.includes(this.currentUser.id)) {
            this.like();
          }
          this.data.disLikes.push(this.currentUser.id);
        }
      }
    );
  }

  async presentReport() {
    let txt1; let txt2; const txt3: string[] = [];
    this.translate.get('15.5').subscribe((res: string) => {
      txt1 = res;
    });
    this.translate.get('15.7').subscribe((res: string) => {
      txt2 = res;
    });
    this.translate.get('15.8').subscribe((res: string) => {
      txt3[0] = res;
    });
    this.translate.get('15.9').subscribe((res: string) => {
      txt3[1] = res;
    });
    this.translate.get('15.10').subscribe((res: string) => {
      txt3[2] = res;
    });
    this.translate.get('15.11').subscribe((res: string) => {
      txt3[3] = res;
    });
    this.translate.get('15.12').subscribe((res: string) => {
      txt3[4] = res;
    });
    this.translate.get('15.13').subscribe((res: string) => {
      txt3[5] = res;
    });

    const alert = await this.alertController.create({
      header: txt2,
      buttons: [
        {
          text: txt1,
          role: 'confirm',
          handler: (raison: any) => {
            this.commentService.addNewReport(new Report(this.currentUser.id, this.idComment, raison)).then(
              () => {
                this.alertService.print('Send with success');
              }
            );
          }
        }
      ],
      inputs: [
        {
          label: txt3[0],
          type: 'checkbox',
          value: txt3[0],
          name: 'raison'
        },
        {
          label: txt3[1],
          type: 'checkbox',
          value: txt3[1],
          name: 'raison'
        },
        {
          label: txt3[2],
          type: 'checkbox',
          value: txt3[2],
          name: 'raison'
        },
        {
          label: txt3[3],
          type: 'checkbox',
          value: txt3[3],
          name: 'raison'
        },
        {
          label: txt3[4],
          type: 'checkbox',
          value: txt3[4],
          name: 'raison'
        },
        {
          label: txt3[5],
          type: 'checkbox',
          value: txt3[5],
          name: 'raison'
        }
      ]
    });

    await alert.present();
  }

}
