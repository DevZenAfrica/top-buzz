import { Component, OnInit } from '@angular/core';
import {Article} from '../../models/article';
import {ArticleService} from '../../services/article.service';
import {UtilisateurService} from '../../services/utilisateur.service';
import {AuthentificationService} from '../../services/authentification.service';
import {StorageService} from "../../services/storage.service";

@Component({
  selector: 'app-print-top-article',
  templateUrl: './print-top-article.component.html',
  styleUrls: ['./print-top-article.component.scss'],
})
export class PrintTopArticleComponent implements OnInit {

  slideOpts = {
    initialSlide: 0,
    speed: 500,
    slidesPerView: 1,
    direction: 'vertical',
  };
  articles: Article[] = [];

  constructor(private articleService: ArticleService, private storageService: StorageService) { }

  ngOnInit() {
    this.articleService.getTopArticles().then(
      (data) => {
        const idRecup = localStorage.getItem('id') ? localStorage.getItem('id') : (localStorage.getItem('guestId') ? localStorage.getItem('guestId') : '');
        const artVus = []; const artNonVus = [];
        data.forEach(function(doc) {
          if(doc.vues.includes(idRecup)) {
            artVus.push(doc);
          } else {
            artNonVus.push(doc);
          }
        });
        this.articles = artNonVus.concat(artVus);
      }
    );
  }

  async ionSlideWillChange(event) {
    const index: number = await event.target.getActiveIndex();
    this.storageService.setItem('slideMove', 'slideMove_' + this.articles[index].id);
  }

}
