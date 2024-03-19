import { Inject, Injectable, Injector } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private PATH: string = "fazenda";;
  user: any

  constructor(private storage: AngularFireStorage, @Inject(Injector) private injector: Injector, private firestore: AngularFirestore){}

}
