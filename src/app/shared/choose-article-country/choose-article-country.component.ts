import {Component, Input, OnInit} from '@angular/core';
import {Pays} from '../../models/pays';
import {Utilisateur} from '../../models/utilisateur';
import {TranslateService} from '@ngx-translate/core';
import {AlertService} from "../../services/alert.service";
import {AlertController} from "@ionic/angular";
import {StorageService} from "../../services/storage.service";
import {AuthentificationService} from "../../services/authentification.service";
import {UtilisateurService} from "../../services/utilisateur.service";
import {PaysService} from "../../services/pays.service";
import {ToolsService} from "../../services/tools.service";
import {Article} from "../../models/article";
import {ArticleService} from "../../services/article.service";

@Component({
  selector: 'app-choose-article-country',
  templateUrl: './choose-article-country.component.html',
  styleUrls: ['./choose-article-country.component.scss'],
})
export class ChooseArticleCountryComponent implements OnInit {

  @Input() data: Article;

  idParent: string;
  inputPays: Pays[] = [];
  currentUser: Utilisateur;
  idPaySelect: any[] = [];
  isLoading = false;

  constructor(private articleService: ArticleService, private translate: TranslateService, private alertService: AlertService, private alertController: AlertController, private storageService: StorageService, private authService: AuthentificationService, private userService: UtilisateurService, private paysService: PaysService) {
    const gid = new ToolsService();
    this.idParent = gid.generateId(5);
  }

  ngOnInit() {
    this.idPaySelect = this.data.idCountry;

    this.paysService.getPays().then(
      (data8) => {
        this.inputPays = data8;
      }
    );
  }

  getLocalCountryWitchId(idGet) {
    for(let i=0; i<this.inputPays.length; i++) {
      if(this.inputPays[i].id === idGet) {
        return this.inputPays[i];
      }
    }
  }

  closePopOver() {
    document.getElementById('modalPopOver_' + this.idParent).classList.add('hidden');
  }

  printPop() {
    document.getElementById('modalPopOver_' + this.idParent).classList.remove('hidden');
  }

  saveCountry(idPays) {
    if(!this.idPaySelect.includes(idPays)) { this.idPaySelect.push(idPays); } else { this.idPaySelect.splice(this.idPaySelect.indexOf(idPays), 1); }
    this.data.idCountry = this.idPaySelect;
    this.articleService.add(this.data).then(
      ()=>{console.log('walay');}
    );
  }

  async presentAllCountry() {
    const alert = await this.alertController.create({
      header: 'Choose your country',
      mode: 'ios',
      buttons: [
        {
          text: 'OK',
          role: 'confirm',
          handler: (paysChoice: Pays) => {

          }
        }
      ],
      inputs: this.inputPays
    });

    await alert.present();
  }

  getValueTraduct(texte: string) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML= texte;
    return wrapper.getElementsByTagName(this.translate.currentLang).length > 0 ? wrapper.getElementsByTagName(this.translate.currentLang)[0].innerHTML : texte;
  }

}
