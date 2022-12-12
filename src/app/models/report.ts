import {ToolsService} from '../services/tools.service';

export class Report {

  date: string;
  id: string;

  constructor(public idUser: string, public idElement: string, public problemes: string[]) {
    const gid = new ToolsService();
    this.id = gid.generateId(23);
    this.date = new Date().toString();
  }
}
