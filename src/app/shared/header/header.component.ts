import { Component, OnInit } from '@angular/core';
import {Utilisateur} from "../../models/utilisateur";
import {AuthentificationService} from "../../services/authentification.service";
import {UtilisateurService} from "../../services/utilisateur.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  currentUser: Utilisateur;

  constructor(private authService: AuthentificationService, private userService: UtilisateurService) { }

  ngOnInit() {
    this.authService.isAuthenticated().then(
      (data) => {
        if(data) {
          this.userService.getCurrentUtilisateur().then(
            (data1) => {
              this.currentUser = data1;
            }
          );
        }
      }
    );
  }
}
