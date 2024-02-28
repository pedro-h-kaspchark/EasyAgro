import { Inject, Injectable, Injector } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AuthService } from './auth.service';
import { user } from '../entities/user';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private PATH: string = "fazenda";;
  user: any

  constructor(private storage: AngularFireStorage, @Inject(Injector) private injector: Injector) { }
}

