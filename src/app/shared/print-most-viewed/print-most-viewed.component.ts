import {Component, OnInit} from '@angular/core';
import {Article} from '../../models/article';
import {ArticleService} from '../../services/article.service';
import {StorageService} from "../../services/storage.service";

@Component({
  selector: 'app-print-most-viewed',
  templateUrl: './print-most-viewed.component.html',
  styleUrls: ['./print-most-viewed.component.scss'],
})
export class PrintMostViewedComponent implements OnInit {

  slideOpts = {
    initialSlide: 0,
    speed: 500,
    slidesPerView: 1,
    direction: 'vertical',
  };
  articles: Article[] = [];

  constructor(private articleService: ArticleService, private storageService: StorageService) { }

  ngOnInit() {
    this.articleService.getArticleMostView().then(
      (data) => {
        this.articles = this.trieTableau(this.filtreObjetVide(data));
      }
    );
  }

  async ionSlideWillChange(event) {
    const index: number = await event.target.getActiveIndex();
    this.storageService.setItem('slideMove', 'slideMove_' + this.articles[index].id);
  }

  filtreObjetVide(tableau: Article[]) {
    const resultFinal = [];
    for(let a=0; a<tableau.length; a++) {
      if(tableau[a].vues.length > 0) {
        resultFinal.push(tableau[a]);
      }
    }
    return resultFinal;
  }

  trieTableau(tableau: Article[]) {
    return tableau.sort((a, b) => a.vues.length - b.vues.length).reverse();
  }

}
