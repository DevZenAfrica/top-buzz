import {ToolsService} from '../services/tools.service';

export class QuickPoll {

  date: string;
  id: string;
  choice1: string[];
  choice2: string[];
  choice3: string[];
  choice4: string[];
  customResponses: string[];

  constructor(public idArticle: string) {
    const gid = new ToolsService();
    this.id = gid.generateId(23);
    this.date = new Date().toString();
    this.choice1 = [];
    this.choice2 = [];
    this.choice3 = [];
    this.choice4 = [];
    this.customResponses = [];
  }
}
