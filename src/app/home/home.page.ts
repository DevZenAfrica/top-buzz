import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthentificationService} from '../services/authentification.service';
import {Utilisateur} from '../models/utilisateur';
import {UtilisateurService} from '../services/utilisateur.service';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  @ViewChild('slides1', {static: true}) slides: IonSlides;

  slideOpts = {
    initialSlide: 1,
    speed: 400
  };
  currentSegment = 1;

  constructor() { }

  ngOnInit() {
  }

  slideTo(index) {
    this.slides.slideTo(index, 500);
  }

  async ionSlideWillChange() {
    this.currentSegment = await this.slides.getActiveIndex();
  }
}
