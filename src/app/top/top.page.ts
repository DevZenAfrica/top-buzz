import {Component, OnInit, ViewChild} from '@angular/core';
import {ArticleService} from '../services/article.service';
import {IonSlides} from '@ionic/angular';

@Component({
  selector: 'app-top',
  templateUrl: './top.page.html',
  styleUrls: ['./top.page.scss'],
})
export class TopPage implements OnInit {

  @ViewChild('slides2', {static: true}) slides: IonSlides;

  slideOpts = {
    initialSlide: 0,
    speed: 400
  };
  currentSegment = 0;

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
