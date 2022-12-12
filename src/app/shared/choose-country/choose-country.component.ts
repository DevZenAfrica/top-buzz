import {Component, Input, OnInit} from '@angular/core';
import {Pays} from '../../models/pays';
import {Utilisateur} from '../../models/utilisateur';
import {AlertService} from '../../services/alert.service';
import {AlertController} from '@ionic/angular';
import {StorageService} from '../../services/storage.service';
import {AuthentificationService} from '../../services/authentification.service';
import {UtilisateurService} from '../../services/utilisateur.service';
import {PaysService} from '../../services/pays.service';
import {TranslateService} from '@ngx-translate/core';
import {ToolsService} from '../../services/tools.service';

@Component({
  selector: 'app-choose-country',
  templateUrl: './choose-country.component.html',
  styleUrls: ['./choose-country.component.scss'],
})
export class ChooseCountryComponent implements OnInit {

  idParent: string;
  inputPays: Pays[] = [];
  currentUser: Utilisateur;
  idPaySelect: any;
  paySelect: any;
  isLoading = false;

  constructor(private translate: TranslateService, private alertService: AlertService, private alertController: AlertController, private storageService: StorageService, private authService: AuthentificationService, private userService: UtilisateurService, private paysService: PaysService) {
    const gid = new ToolsService();
    this.idParent = gid.generateId(5);
  }

  ngOnInit() {
    this.idPaySelect = this.storageService.getItem('paysSelect') ? this.storageService.getItem('paysSelect') : '';
    if(this.idPaySelect !== '') { this.initializeObjetPays(this.idPaySelect); }
    this.storageService.watchStorage().subscribe((data) => {
      if(this.idPaySelect !== this.storageService.getItem('paysSelect')) {
        location.reload();
      }
    });

    this.paysService.getPays().then(
      (data8) => {
        this.inputPays = data8;
      }
    );
  }

  closePopOver() {
    document.getElementById('modalPopOver_' + this.idParent).classList.add('hidden');
  }

  printPop() {
    document.getElementById('modalPopOver_' + this.idParent).classList.remove('hidden');
  }

  saveCountry(paysChoice: Pays) {
    this.isLoading = true;

    if(!paysChoice || this.idPaySelect !== paysChoice.id) {

      this.authService.isAuthenticated().then(
        (result) => {
          if(result) {
            this.userService.getCurrentUtilisateur().then(
              (data25) => {
                data25.idCountry = paysChoice ? paysChoice.id : '';
                this.userService.updateCurrentUser(data25).then(
                  () => {
                    this.alertService.print('Done!');
                    if(paysChoice) {
                      this.storageService.setItem('paysSelect', paysChoice.id);
                      this.paySelect = paysChoice;
                      this.idPaySelect = paysChoice.id;
                    } else {
                      this.storageService.setItem('paysSelect', '');
                      this.paySelect = '';
                      this.idPaySelect = '';
                    }
                    this.isLoading = false;
                    location.reload();
                  }
                );
              }
            );
          } else {
            if(paysChoice) {
              this.storageService.setItem('paysSelect', paysChoice.id);
              this.paySelect = paysChoice;
              this.idPaySelect = paysChoice.id;
            } else {
              this.storageService.setItem('paysSelect', '');
              this.paySelect = '';
              this.idPaySelect = '';
            }
            this.isLoading = false;
            location.reload();
          }
        }
      );
    }
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

  initializeObjetPays(idPays: string) {
    this.paysService.getPaysWitchId(idPays).then(
      (data) => {
        this.paySelect = data;
      }
    );
  }

}
