import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {

  private confirmSubject = new BehaviorSubject<any>(null);

  confirm(options: any) {
    if (confirm(options.message)) {
      options.accept();
    }
  }
}
