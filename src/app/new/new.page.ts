import { Component, OnInit } from '@angular/core';
import {Article} from "../models/article";
import {Utilisateur} from "../models/utilisateur";
import {Pays} from "../models/pays";
import {TranslateService} from "@ngx-translate/core";
import {PaysService} from "../services/pays.service";
import {UtilisateurService} from "../services/utilisateur.service";
import {AuthentificationService} from "../services/authentification.service";
import {Router} from "@angular/router";
import {ArticleService} from "../services/article.service";
import {AlertService} from "../services/alert.service";
import {FormBuilder} from "@angular/forms";
import {DomSanitizer} from "@angular/platform-browser";
import {ApiService} from "../services/api.service";
import {ToolsService} from "../services/tools.service";
import {QuickPoll} from "../models/quickPoll";

@Component({
  selector: 'app-new',
  templateUrl: './new.page.html',
  styleUrls: ['./new.page.scss'],
})
export class NewPage implements OnInit {

  imgFile: string | undefined;
  uploadForm = this.formBuilder.group({
    file: ['']
  });
  lienGenerer = '';
  listOldLink = '';
  currentArticle: Article = new Article('', 1, '', '', '', '', [], '', '');
  isLoading = false;
  currentUser: Utilisateur;
  errorFile = '';
  country: Pays[] = [];
  countryArticle: string[] = [];
  typeFile;
  extensionFile;

  slideOpts = {
    initialSlide: 0,
    speed: 800 ,
    slidesPerView: 0,
    spaceBetween: 5,
    slidesOffsetBefore:5,
    slidesOffsetAfter:5
  };
  sondageExpressSelect = 0;
  rep1; rep2; rep3; rep4;

  constructor(private translate: TranslateService, private paysService: PaysService, private userService: UtilisateurService, private authService: AuthentificationService, private router: Router, private articleService: ArticleService, private alertService: AlertService, private formBuilder: FormBuilder, private sanitizer: DomSanitizer, private apiService: ApiService) { }

  ngOnInit() {
    this.authService.isAuthenticated().then(
      (data) => {
        if(data) {
          this.userService.getCurrentUtilisateur().then(
            (result) => {
              this.currentUser = result;

              if(this.currentUser.role[0] === '1') {
                this.paysService.getPays().then(
                  (ls) => {
                    this.country = ls;
                  }
                );
              }
            }
          );
        }
      }
    );
  }

  onImageChange(e: any) {
    const reader = new FileReader();
    if (e.target.files && e.target.files.length) {
      const [file] = e.target.files;
      if(['mp4', 'mov', 'MOV'].includes(file.name.split('.').pop())) { this.typeFile = 'movie'; } else { this.typeFile = 'img'; }
      if(this.formatBytes(file.size) < 90) {
        this.extensionFile = file.name.split('.').pop();
        reader.readAsDataURL(file);

        reader.onload = () => {
          this.imgFile = reader.result as string;
          this.uploadForm.patchValue({
            //imgSrc: reader.result
          });
        };
      } else {
        this.errorFile = 'The maximum size for video files is 90 MB, and your file size in MB is ' + this.formatBytes(file.size).toFixed(2) + '.';
      }
    }
  }

  addTag() {
    this.currentArticle.tags.push('#' + prompt('#Tag').replace(' ', '').replace('#', ''));
  }

  uploadImage() {
    this.isLoading = true;
    const gid = new ToolsService();
    this.currentArticle.typeMedia = this.typeFile;

    /* Gestion quick sondage */
    if(this.sondageExpressSelect !== 0) {
      const qs = new QuickPoll(this.currentArticle.id);
      switch (this.sondageExpressSelect) {
        case 1:
          qs.customResponses.push('<fr>Oui</fr><en>Yes</en>');
          qs.customResponses.push('<fr>Non</fr><en>No</en>');
          break;
        case 2:
          qs.customResponses.push('<fr>Vrai</fr><en>True</en>');
          qs.customResponses.push('<fr>Faux</fr><en>False</en>');
          break;
        case 3:
          qs.customResponses.push('<fr>D\'accord</fr><en>I agree</en>');
          qs.customResponses.push('<fr>Pas d\'accord</fr><en>Disagree</en>');
          break;
        case 4:
          if(this.rep1) {
            qs.customResponses.push(this.rep1);
            if(this.rep2) {
              qs.customResponses.push(this.rep2);
              if(this.rep3) {
                qs.customResponses.push(this.rep3);
                if(this.rep4) {
                  qs.customResponses.push(this.rep4);
                }
              }
            }
          }
          break;
      }
      this.articleService.addQuickPoll(qs);
    }
    /* Fin quick sondage */

    if(this.typeFile === 'img') {
      //this.apiService.addImageForAdresseId( gid.generateId(23).toString() , 'images/', this.imgFile ? this.sanitizer.bypassSecurityTrustResourceUrl(this.imgFile).toString() : '').then(
      this.apiService.putFileInServer(this.imgFile ? this.sanitizer.bypassSecurityTrustResourceUrl(this.imgFile).toString() : '', this.extensionFile).then(
        (docRef: string) => {
          this.lienGenerer = this.imgFile ? docRef : '';
          this.currentArticle.media = this.lienGenerer;
          this.currentArticle.auteur = this.currentUser.id;
          this.currentArticle.idCountry = this.countryArticle;
          this.currentArticle.tagHidden.push(this.currentUser.userName);
          this.articleService.add(this.currentArticle).then(
            () => {
              this.alertService.print('Publication done');
              this.isLoading = false;
              document.location.href= '/';
            }
          );
        }, () => {
          this.isLoading = false;
          this.alertService.print('An error occurred during the operation, please try again');
        });
    } else {
      this.apiService.addMovieForAdresseId( gid.generateId(23).toString() , 'videos/', this.imgFile ? this.sanitizer.bypassSecurityTrustResourceUrl(this.imgFile).toString() : '').then(
        (docRef: string) => {
          this.lienGenerer = this.imgFile ? docRef : '';
          this.currentArticle.media = this.lienGenerer;
          this.currentArticle.auteur = this.currentUser.id;
          this.currentArticle.idCountry = this.countryArticle;
          this.currentArticle.tagHidden.push(this.currentUser.userName);
          this.articleService.add(this.currentArticle).then(
            () => {
              this.alertService.print('Publication done');
              this.isLoading = false;
              document.location.href= '/';
            }
          );
        }, () => {
          this.isLoading = false;
          this.alertService.print('An error occurred during the operation, please try again');
        });
    }
  }

  formatBytes(bytes) {
    return bytes / (1024 ** 2);
  }

  getValueTraduct(texte: string) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML= texte;
    return wrapper.getElementsByTagName(this.translate.currentLang).length > 0 ? wrapper.getElementsByTagName(this.translate.currentLang)[0].innerHTML : texte;
  }

}
