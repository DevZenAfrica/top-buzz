import {Component, OnInit} from '@angular/core';
import {ArticleService} from '../services/article.service';
import {Article} from '../models/article';

@Component({
  selector: 'app-topics',
  templateUrl: './topics.page.html',
  styleUrls: ['./topics.page.scss'],
})
export class TopicsPage implements OnInit {

  listeHashTag: string[] = [];
  listeArticle: Article[] = [];

  constructor(private articleService: ArticleService) {}

  ngOnInit(): void {
    this.articleService.getArticleHaveTag().then(
      (data) => {
        this.listeArticle = data;
        const pointe = this;
        data.forEach(function(doc) {
          doc.tags.forEach(function(doc1) {
            pointe.listeHashTag.push(doc1);
          });
        });
      }
    );
  }

  countNberTag(texte) {
    let cmp = 0;
    for(let i=0; i<this.listeArticle.length; i++) {
      if(this.listeArticle[i].tags.includes(texte)) {
        cmp++;
      }
    }
    return cmp + 16;
  }
}
