import { Component, OnInit } from '@angular/core';
import {Article} from '../../models/article';
import {ArticleService} from '../../services/article.service';
import {StorageService} from "../../services/storage.service";

@Component({
  selector: 'app-for-you',
  templateUrl: './for-you.component.html',
  styleUrls: ['./for-you.component.scss'],
})
export class ForYouComponent implements OnInit {

  slideOpts = {
    initialSlide: 0,
    speed: 500,
    slidesPerView: 1,
    direction: 'vertical',
  };
  articles: Article[] = [];

  constructor(private articleService: ArticleService, private storageService: StorageService) { }

  ngOnInit() {
    this.articleService.getAllArticles().then(
      (data) => {
        const idRecup = localStorage.getItem('id') ? localStorage.getItem('id') : (localStorage.getItem('guestId') ? localStorage.getItem('guestId') : '');
        let artVus = []; let artNonVus = [];
        data.forEach(function(doc) {
          if(doc.vues.includes(idRecup)) {
            artVus.push(doc);
          } else {
            artNonVus.push(doc);
          }
        });
        artNonVus = this.randTableau(artNonVus);
        artVus = this.randTableau(artVus);
        this.articles = artNonVus.concat(artVus);
      }
    );
  }

  async ionSlideWillChange(event) {
    const index: number = await event.target.getActiveIndex();
    this.storageService.setItem('slideMove', 'slideMove_' + this.articles[index].id);
  }

  randTableau(tab_){
    let i: any; let num;
    let nbr = tab_.length;
    let tab = [];
    //-- Copie le contenu
    tab = tab.concat(tab_);
    //-- Lance la boucle
    while( nbr> 0){
      //-- Recup nombre aleatoire
      num = Math.floor(Math.random() * nbr);
      //-- 1 de moins a traiter
      nbr = nbr - 1;
      //-- Stock l'element tire
      const szTmp = tab[num];
      //-- Decalage les valeur du tableau
      for( i= num; i < nbr; i++)
        {tab[i] = tab[i+1];}
      //-- Stock l'element tire en fin
      tab[ nbr] = szTmp;
    }
    //-- On peut remettre dans l'ordre du tirage
    tab.reverse();
    //-- Retourne resultat
    return(tab);
  }

}
