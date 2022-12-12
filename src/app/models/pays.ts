export class Pays {

  date: string;

  constructor(public id: string, public name: string, public code: string, public flag: string) {
    this.date = new Date().toString();
  }
}
