import { Component, OnInit } from '@angular/core';
import {Article} from '../../models/article';
import {ArticleService} from '../../services/article.service';
import {CommentService} from '../../services/comment.service';
import {StorageService} from "../../services/storage.service";

@Component({
  selector: 'app-print-most-commented',
  templateUrl: './print-most-commented.component.html',
  styleUrls: ['./print-most-commented.component.scss'],
})
export class PrintMostCommentedComponent implements OnInit {

  slideOpts = {
    initialSlide: 0,
    speed: 500,
    slidesPerView: 1,
    direction: 'vertical',
  };
  articlesComment: any[] = [];
  articles: Article[] = [];
  listAllArticle: Article[] = [];

  constructor(private articleService: ArticleService, private commentService: CommentService, private storageService: StorageService) { }

  ngOnInit() {
    this.articleService.getArticleMostView().then(
      (data) => {
        const pointe = this;
        this.listAllArticle = data;
        this.listAllArticle.forEach(function(doc) {
          pointe.commentService.getComments(doc.id).then(
            (data25) => {
              if(data25.length > 0) {
                pointe.articlesComment.push({
                  comments : data25.length,
                  articleId: doc.id
                });
              }
            }
          );
        });
      }
    );
  }

  async ionSlideWillChange(event) {
    const index: number = await event.target.getActiveIndex();
    this.storageService.setItem('slideMove', 'slideMove_' + this.articles[index].id);
  }

  trieTableau(tableau: any[]) {
    return tableau.sort((a, b) => a.comments - b.comments).reverse();
  }

  ionSlideDidChange(event) { //.bubbles (bon)
    console.log('papa ', event); //.attributes.childElementCount
  }

}
