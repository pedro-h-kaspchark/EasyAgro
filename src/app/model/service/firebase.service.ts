import { Inject, Injectable, Injector } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AuthService } from './auth.service';
import { user } from '../entities/user';
import { finalize } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private PATH: string = "fazenda";;
  user: any

  constructor(private storage: AngularFireStorage, @Inject(Injector) private injector: Injector, private firestore: AngularFirestore){}

  uploadImage(image: File, path: string): Observable<string | undefined> {
    const fileRef = this.storage.ref(path);
    const uploadTask = this.storage.upload(path, image);

    return new Observable<string | undefined>(observer => {
      uploadTask.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            observer.next(url);
            observer.complete();
          }, error => {
            observer.error(error);
          });
        })
      ).subscribe();
    });
  }
}
