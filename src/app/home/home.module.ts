import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import {MiniatureArticleComponent} from '../shared/miniature-article/miniature-article.component';
import {HeaderComponent} from '../shared/header/header.component';
import {ChooseCountryComponent} from '../shared/choose-country/choose-country.component';
import {PrintTopArticleComponent} from '../shared/print-top-article/print-top-article.component';
import {TranslateModule} from '@ngx-translate/core';
import {RecentArticlesComponent} from '../shared/recent-articles/recent-articles.component';
import {MiniatureCommentComponent} from '../shared/miniature-comment/miniature-comment.component';
import {ForYouComponent} from '../shared/for-you/for-you.component';
import {ChooseArticleCountryComponent} from "../shared/choose-article-country/choose-article-country.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        HomePageRoutingModule,
        TranslateModule
    ],
    exports: [MiniatureArticleComponent, HeaderComponent],
    declarations: [HomePage, MiniatureArticleComponent, HeaderComponent, ChooseCountryComponent, PrintTopArticleComponent, RecentArticlesComponent, MiniatureCommentComponent, ForYouComponent, ChooseArticleCountryComponent]
})
export class HomePageModule {}
