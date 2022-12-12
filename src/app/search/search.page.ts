import { Component, OnInit } from '@angular/core';
import {Article} from '../models/article';
import {ActivatedRoute} from '@angular/router';
import {NavController} from '@ionic/angular';
import {ArticleService} from '../services/article.service';
import {StorageService} from '../services/storage.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  currentSearch: string;
  articles: Article[] = [];
  listAllArticle: Article[] = [];
  slideOpts = {
    initialSlide: 0,
    speed: 500,
    slidesPerView: 1,
    direction: 'vertical',
  };

  constructor(private route: ActivatedRoute, private storageService: StorageService, private activatedRoute: ActivatedRoute, private navCtrl: NavController, private articleService: ArticleService) { }

  ngOnInit() {
    if(this.route.snapshot.queryParams.txt) {
      this.currentSearch = this.route.snapshot.queryParams.txt;
    }
    this.reloadSearch();
  }

  async ionSlideWillChange(event) {
    const index: number = await event.target.getActiveIndex();
    this.storageService.setItem('slideMove', 'slideMove_' + this.articles[index].id);
  }

  reloadSearch() {
    if(this.currentSearch) {
      this.articleService.getAllArticles().then(
        (data) => {
          this.listAllArticle = data;

          const pointe = this;
          this.articles = [];
          let tmpArticle: Article[] = [];
          // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
          this.listAllArticle.forEach(function(doc) {
            if(pointe.filtreSearchFromTexte(pointe.currentSearch, doc)) {
              tmpArticle.push(doc);
              tmpArticle = pointe.trieTableau(tmpArticle);
            }
          });

          this.articles = tmpArticle;
        }
      );
    }
  }

  trieTableau(tableau: Article[]) {
    const tmpValue = tableau.sort((a, b) => this.convertStringDateToNumber(a.date) - this.convertStringDateToNumber(b.date));
    return tmpValue.reverse();
  }

  filtreSearchFromTexte(currentSearch: string, doc: Article) {
   return doc.title.toLowerCase().indexOf(currentSearch.toLowerCase()) !== -1 || doc.tagHidden.toString().toLowerCase().indexOf(currentSearch.toLowerCase()) !== -1 || doc.tags.toString().toLowerCase().indexOf(currentSearch.toLowerCase()) !== -1 || doc.description.toLowerCase().indexOf(currentSearch.toLowerCase()) !== -1;
   // return doc.title.toLowerCase().indexOf(currentSearch.toLowerCase()) !== -1 || doc.content.toLowerCase().indexOf(currentSearch.toLowerCase()) !== -1 || doc.tags.toString().toLowerCase().indexOf(currentSearch.toLowerCase()) !== -1 || doc.description.toLowerCase().indexOf(currentSearch.toLowerCase()) !== -1;
  }

  convertStringDateToNumber(date: string) {
    return Number(date.replace(/-/g, ''));
  }

  backToPreview() {
    this.navCtrl.back();
  }

}
