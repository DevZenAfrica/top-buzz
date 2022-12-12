import {ToolsService} from '../services/tools.service';

export class Article {
  date: string;
  likes: string[];
  disLikes: string[];
  vues: string[];
  idCountry: string[];
  allowComment: number;
  top: number;
  id: string;
  seenLongTime: string[];
  tagHidden: string[];
  userUpdateArticle: string[];
  abonnees: string[];

  constructor(public title: string, public status: number, public description: string, public media: string, public typeMedia: string, public miniature: string, public tags: string[], public categorie: string, public auteur: string) {
    const gid = new ToolsService();
    this.id = gid.generateId(23);
    this.date = new Date().toString();
    this.likes = [];
    this.disLikes = [];
    this.vues = [];
    this.seenLongTime = [];
    this.idCountry = [];
    this.allowComment = 1;
    this.top = 0;
    this.tagHidden = [];
    this.userUpdateArticle = [];
    this.abonnees = [];
  }
}
