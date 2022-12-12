import {Component, OnInit} from '@angular/core';
import {StorageService} from '../services/storage.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {

  href: string;

  constructor(private storageService: StorageService, private router: Router) {}

  ngOnInit() {
    if(this.router.url.includes('new')) {
      this.href = 'new';
    }
  }

  stopAllMediaLoading() {
    this.storageService.setItem('slideMove', 'slideMove_null'); //Juste pour arrêté les videos en cours de lecture de façon brute, donc il faut reflechir a nous dessus
  }

}
