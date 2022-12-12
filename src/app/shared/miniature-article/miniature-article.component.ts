import {AfterContentInit, AfterViewInit, Component, HostListener, Input, OnDestroy, OnInit} from '@angular/core';
import {Article} from '../../models/article';
import {ArticleService} from '../../services/article.service';
import {TranslateService} from '@ngx-translate/core';
import {ToolsService} from '../../services/tools.service';
import {Utilisateur} from '../../models/utilisateur';
import {UtilisateurService} from '../../services/utilisateur.service';
import {CommentService} from '../../services/comment.service';
import {Comment} from '../../models/comment';
import {AuthentificationService} from "../../services/authentification.service";
import {AlertService} from "../../services/alert.service";
import {StorageService} from "../../services/storage.service";
import {Report} from "../../models/report";
import {AlertController, ModalController} from "@ionic/angular";
import {QuickPoll} from "../../models/quickPoll";

@Component({
  selector: 'app-miniature-article',
  templateUrl: './miniature-article.component.html',
  styleUrls: ['./miniature-article.component.scss'],
})

@HostListener('window:scroll', ['$event'])

export class MiniatureArticleComponent implements OnInit {

  @Input() idArticle;
  @Input() skin = 'fullscreen';
  @Input() data: Article;

  gid = new ToolsService();
  idGenerate = this.gid.generateId(7);
  printDetailDescription = false;
  auteurUser: Utilisateur;
  currentComment: Comment[] = [];
  writeComment = '';
  currentUser: Utilisateur;
  isLoading = false;
  currentQuickPoll: QuickPoll;
  slideOpts = {
    initialSlide: 0,
    speed: 800,
    slidesPerView: 0,
    spaceBetween: 10,
    slidesOffsetBefore: 10,
    slidesOffsetAfter: 10
  };
  isLoadingAbonne = false;
  inFocusTextArea = false;

  constructor(private modalCtrl: ModalController, private alertController: AlertController, private storageService: StorageService, private alertService: AlertService, private authService: AuthentificationService, private commentService: CommentService, private userService: UtilisateurService, private articleService: ArticleService, private translate: TranslateService) {
  }

  ngOnInit() {
    if (!this.data && this.idArticle !== '') {
      this.articleService.getArticleWitchId(this.idArticle).then(
        (donnee) => {
          this.data = donnee;
          this.startAfterGetData();
        }
      );
    } else {
      this.startAfterGetData();
    }

    this.articleService.getQuickPollWitchArticle(this.data ? this.data.id : this.idArticle).then(
      (dc) => {
        this.currentQuickPoll = dc;
      }
    );
  }

  updateQuickPoll(index) {
    if(this.currentUser) {
      switch (index) {
        case 1:
          if(this.currentQuickPoll.choice1.includes(this.currentUser.id)) {
            this.currentQuickPoll.choice1.splice(this.currentQuickPoll.choice1.indexOf(this.currentUser.id), 1);
          } else {
            this.currentQuickPoll.choice1.push(this.currentUser.id);
            this.currentQuickPoll.choice2.splice(this.currentQuickPoll.choice2.indexOf(this.currentUser.id), 1);
            this.currentQuickPoll.choice3.splice(this.currentQuickPoll.choice3.indexOf(this.currentUser.id), 1);
            this.currentQuickPoll.choice4.splice(this.currentQuickPoll.choice4.indexOf(this.currentUser.id), 1);
          }
          break;
        case 2:
          if(this.currentQuickPoll.choice2.includes(this.currentUser.id)) {
            this.currentQuickPoll.choice2.splice(this.currentQuickPoll.choice2.indexOf(this.currentUser.id), 1);
          } else {
            this.currentQuickPoll.choice2.push(this.currentUser.id);
            this.currentQuickPoll.choice1.splice(this.currentQuickPoll.choice1.indexOf(this.currentUser.id), 1);
            this.currentQuickPoll.choice3.splice(this.currentQuickPoll.choice3.indexOf(this.currentUser.id), 1);
            this.currentQuickPoll.choice4.splice(this.currentQuickPoll.choice4.indexOf(this.currentUser.id), 1);
          }
          break;
        case 3:
          if(this.currentQuickPoll.choice3.includes(this.currentUser.id)) {
            this.currentQuickPoll.choice3.splice(this.currentQuickPoll.choice3.indexOf(this.currentUser.id), 1);
          } else {
            this.currentQuickPoll.choice3.push(this.currentUser.id);
            this.currentQuickPoll.choice1.splice(this.currentQuickPoll.choice1.indexOf(this.currentUser.id), 1);
            this.currentQuickPoll.choice2.splice(this.currentQuickPoll.choice2.indexOf(this.currentUser.id), 1);
            this.currentQuickPoll.choice4.splice(this.currentQuickPoll.choice4.indexOf(this.currentUser.id), 1);
          }
          break;
        case 4:
          if(this.currentQuickPoll.choice4.includes(this.currentUser.id)) {
            this.currentQuickPoll.choice4.splice(this.currentQuickPoll.choice4.indexOf(this.currentUser.id), 1);
          } else {
            this.currentQuickPoll.choice4.push(this.currentUser.id);
            this.currentQuickPoll.choice1.splice(this.currentQuickPoll.choice1.indexOf(this.currentUser.id), 1);
            this.currentQuickPoll.choice2.splice(this.currentQuickPoll.choice2.indexOf(this.currentUser.id), 1);
            this.currentQuickPoll.choice3.splice(this.currentQuickPoll.choice3.indexOf(this.currentUser.id), 1);
          }
          break;
      }
      this.articleService.addQuickPoll(this.currentQuickPoll);
    } else {
      this.alertService.print('You are not currently logged in, please do so in order to perform this action');
    }
  }

  recupClass(index) {
    let result = false;
    switch (index) {
      case 1:
        if(this.currentUser && this.currentQuickPoll.choice1.includes(this.currentUser.id)) {
          result = true;
        }
        break;
      case 2:
        if(this.currentUser && this.currentQuickPoll.choice2.includes(this.currentUser.id)) {
          result = true;
        }
        break;
      case 3:
        if(this.currentUser && this.currentQuickPoll.choice3.includes(this.currentUser.id)) {
          result = true;
        }
        break;
      case 4:
        if(this.currentUser && this.currentQuickPoll.choice4.includes(this.currentUser.id)) {
          result = true;
        }
        break;
    }
    return result;
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  getTabNombreVote() {
    const tmpNv: number[] = [];
    tmpNv.push(this.currentQuickPoll.choice1.length);
    tmpNv.push(this.currentQuickPoll.choice2.length);
    tmpNv.push(this.currentQuickPoll.choice3.length);
    tmpNv.push(this.currentQuickPoll.choice4.length);
    return tmpNv;
  }

  isVoted() {
    if(this.currentUser && (this.currentQuickPoll.choice1.includes(this.currentUser.id) || this.currentQuickPoll.choice2.includes(this.currentUser.id) || this.currentQuickPoll.choice3.includes(this.currentUser.id) || this.currentQuickPoll.choice4.includes(this.currentUser.id))) {
      return true;
    } else {
      return false;
    }
  }


  addRemoveAbonnement() {
    this.isLoadingAbonne = true;
    this.userService.updateAbonneeUser(this.auteurUser, this.currentUser.id).then(
      () => {
        this.isLoadingAbonne = false;
        if(this.auteurUser.abonnees.includes(this.currentUser.id)) {
          this.auteurUser.abonnees.splice(this.auteurUser.abonnees.indexOf(this.currentUser.id), 1);
        } else {
          this.auteurUser.abonnees.push(this.currentUser.id);
        }
      }
    );
  }

  startAfterGetData() {
    this.storageService.watchStorage().subscribe((dataget) => {
      if(dataget.indexOf('slideMove_') !== -1) {
        if(this.data && this.data.typeMedia === 'movie')
        {
          if(dataget.split('slideMove_')[1] === this.data.id) {
            this.playVideo();
          } else {
            this.stopVideo();
          }
        }
      }
    });

    this.userService.getUtilisateurWitchId(this.data.auteur).then(
      (donnee) => {
        this.auteurUser = donnee;
      }
    );
    this.authService.isAuthenticated().then(
      (data0) => {
        if(data0) {
          this.userService.getCurrentUtilisateur().then(
            (data1) => {
              this.currentUser = data1;
              if(this.data && !this.data.vues.includes(this.currentUser.id)) {
                this.articleService.updateVues(this.data, this.currentUser.id);
              }
            }
          );
        }
      }
    );
    this.commentService.getComments(this.data ? this.data.id : this.idArticle).then(
      (data2) => {
        this.currentComment = data2;
      }
    );
  }

  isVideoPlayed() {
    return !(document.getElementById ('videoPlay_' + this.idGenerate) as any).paused;
  }

  playVideo() {
    if((document.getElementById ('videoPlay_' + this.idGenerate) as any).paused) {
      (document.getElementById ('videoPlay_' + this.idGenerate) as any).play();
    } else {
      (document.getElementById ('videoPlay_' + this.idGenerate) as any).pause();
    }
  }

  stopVideo() {
    (document.getElementById ('videoPlay_' + this.idGenerate) as any).pause();
    (document.getElementById ('videoPlay_' + this.idGenerate) as any).currentTime = 0;
  }

  like() {
    if(this.currentUser) {
      this.articleService.likeArticle(this.data).then(
        () => {
          if(this.data.likes.includes(this.currentUser.id))
          {this.data.likes.splice(this.data.likes.indexOf(this.currentUser.id), 1);}
          else
          {this.data.likes.push(this.currentUser.id);}
        }
      );
    } else {
      this.alertService.print('You are not currently logged in, please do so in order to perform this action');
    }
  }

  sendComment(idParent: string) {
    if(this.currentUser) {
      if(this.writeComment) {
        const tmpComment = new Comment(this.data.id, this.currentUser.id, idParent, this.writeComment);
        this.commentService.addNewComment(tmpComment).then(
          () => {
            this.currentComment.unshift(tmpComment);
            this.writeComment = '';
            this.scrollToElement('title_comment');
            this.inFocusTextArea = false;
          }
        );
      }
    } else {
      this.alertService.print('You are not currently logged in, please do so in order to perform this action');
    }
  }

  archiveCurrentArticle() {
    if(this.currentUser) {
      const tmpCurrentUser = this.currentUser;
      if(tmpCurrentUser.archives.includes(this.data.id)) {
        tmpCurrentUser.archives.splice(tmpCurrentUser.archives.indexOf(this.data.id), 1);
      } else {
        tmpCurrentUser.archives.push(this.data.id);
      }
      this.userService.updateCurrentUser(this.currentUser).then(
        () => {
          let txt1; let txt2;
          this.translate.get('5.5-2').subscribe((res: string) => { txt1 = res; });
          this.translate.get('5.5-3').subscribe((res: string) => { txt2 = res; });
          this.currentUser = tmpCurrentUser;
          this.alertService.print(tmpCurrentUser.archives.includes(this.data.id) ? txt1 : txt2);
        }
      );
    } else {
      this.alertService.print('You are not currently logged in, please do so in order to perform this action');
    }
  }

  scrollToElement(element: any): void {
    (document.getElementById(element) as HTMLElement).scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
  }

  getValueTraduct(texte: string) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML= texte;
    return wrapper.getElementsByTagName(this.translate.currentLang).length > 0 ? wrapper.getElementsByTagName(this.translate.currentLang)[0].innerHTML : texte;
  }

  adminDefineIsTopArticle() {
    this.isLoading = true;
    const tmpA = this.data;
    tmpA.top = tmpA.top === 0 ? 1 : 0;
    tmpA.userUpdateArticle.push(this.currentUser.id);
    this.articleService.add(tmpA).then(
      () => {
        this.data = tmpA;
        this.isLoading = false;
      }
    );
  }

  adminDesactiveArticle() {
    this.isLoading = true;
    const tmpA = this.data;
    tmpA.status = 0;
    tmpA.userUpdateArticle.push(this.currentUser.id);
    this.presentReport();
    this.articleService.add(tmpA).then(
      () => {
        this.data = tmpA;
        this.isLoading = false;
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
            this.articleService.addNewReport(new Report(this.currentUser.id, this.data.id, raison)).then(
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
