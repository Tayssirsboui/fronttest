import { Injectable } from '@angular/core';
import { Filter } from 'bad-words';

@Injectable({
  providedIn: 'root',
})
export class CensorshipService {
  private filter = new Filter();

  constructor() {
    // Optionnel : ajouter tes propres mots
    // this.filter.addWords('grosmot1', 'grosmot2');
  }

  cleanText(text: string): string {
    return this.filter.clean(text);
  }

  isProfane(text: string): boolean {
    return this.filter.isProfane(text);
  }
}
