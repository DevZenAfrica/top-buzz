import { Component, OnInit } from '@angular/core';
import {Utilisateur} from '../../models/utilisateur';
import {NavController} from '@ionic/angular';
import {AuthentificationService} from '../../services/authentification.service';
import {UtilisateurService} from '../../services/utilisateur.service';
import {FormBuilder} from '@angular/forms';
import {ToolsService} from "../../services/tools.service";
import {QuickPoll} from "../../models/quickPoll";
import {ApiService} from "../../services/api.service";
import {DomSanitizer} from "@angular/platform-browser";
import {AlertService} from "../../services/alert.service";

@Component({
  selector: 'app-update-profil',
  templateUrl: './update-profil.page.html',
  styleUrls: ['./update-profil.page.scss'],
})
export class UpdateProfilPage implements OnInit {

  isLoading = true;
  currentUser: Utilisateur;
  imgFile: string | undefined;
  uploadForm = this.formBuilder.group({
    file: ['']
  });
  lienGenerer = '';

  constructor(private alertService: AlertService, private apiService: ApiService, private formBuilder: FormBuilder, private sanitizer: DomSanitizer, private navCtrl: NavController, private authService: AuthentificationService, private userService: UtilisateurService) { }

  ngOnInit() {
    this.authService.isAuthenticated().then(
      (donnee) => {
        if(donnee) {
          this.userService.getCurrentUtilisateur().then(
            (data) => {
              this.currentUser = data;
              this.imgFile = this.currentUser.photo;
              this.isLoading = false;
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
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.imgFile = reader.result as string;
        this.uploadForm.patchValue({
          //imgSrc: reader.result
        });
      };
    }
  }

  save() {
    this.isLoading = true;
    const gid = new ToolsService();
    const tmpTof = this.currentUser.photo !== this.imgFile ? this.imgFile : '';
    this.apiService.addImageForAdresseId( gid.generateId(23).toString() , 'images/', tmpTof ? this.sanitizer.bypassSecurityTrustResourceUrl(tmpTof).toString() : '').then(
      (docRef: string) => {
        this.currentUser.photo = this.currentUser.photo !== this.imgFile ? docRef : this.currentUser.photo;
        this.userService.updateCurrentUser(this.currentUser).then(
          () => {
            this.isLoading = false;
            document.location.href = 'tabs/profil';
            //location.reload();
          }
        );
      }, () => {
        this.isLoading = false;
        this.alertService.print('An error occurred during the operation, please try again');
      });
  }

}
