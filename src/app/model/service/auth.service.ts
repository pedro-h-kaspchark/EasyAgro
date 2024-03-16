import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { signInWithPopup, browserPopupRedirectResolver, GoogleAuthProvider, Auth, User } from 'firebase/auth';
import { getAuth } from 'firebase/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  dataUser: any;

  constructor(private firestore: AngularFirestore, private auth: AngularFireAuth, private router: Router, private ngZone: NgZone, private storage: AngularFireStorage){
    this.auth.authState.subscribe(user =>{
      if(user){
        this.dataUser = {
          uid: user.uid,
          email: user.email,
          displayname: user.displayName,
          number: user.phoneNumber,
          photoURL: user.photoURL
        }
        localStorage.setItem('user', JSON.stringify(this.dataUser))
      }else{
        localStorage.setItem('user', 'null');
      }
    });
  }

  public signIn(email: string, password: string){
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  public async register(email: string, password: string, displayName: string, photoURL: File, number: string){
    try{
      const userCredential = await this.auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      if(user){
        const photoURLUploaded = await this.uploadPhotoToStorage(user.uid, photoURL);
        await user.updateProfile({
          displayName: displayName,
          photoURL: photoURLUploaded
        });
        this.dataUser ={
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          number: number,
          photoURL: photoURLUploaded
        };
        localStorage.setItem('user', JSON.stringify(this.dataUser));
        await this.firestore.collection('users').doc(user.uid).set({
          uid: user.uid,
          email: user.email,
          displayName: displayName,
          number: number,
          photoURL: photoURLUploaded
        });
        return {
          user: this.dataUser,
          displayName: displayName,
          photoURL: photoURLUploaded
        };
      } else {
        throw new Error('Usuário não encontrado após cadastro!');
      }
    }catch (error){
      throw error;
    }
  }

private async uploadPhotoToStorage(userId: string, photo: File): Promise<string> {
  const filePath = `profile-images/${userId}/${photo.name}`;
  const fileRef = this.storage.ref(filePath);
  const uploadTask = this.storage.upload(filePath, photo);
  return new Promise((resolve, reject) => {
    uploadTask.snapshotChanges().subscribe(() => {
      fileRef.getDownloadURL().subscribe(url => {
        resolve(url);
      }, error => reject(error));
    }, error => reject(error));
  });
}
  
  public recoverPassword(email: string){
    return this.auth.sendPasswordResetEmail(email);
  }

  public signOut(){
    return this.auth.signOut().then(() =>{
      localStorage.removeItem('user');
      this.router.navigate(['login']);
    });
  }

  public isLoggedIn() : boolean{
    const user : any = JSON.parse(localStorage.getItem('user') || 'null');
    return (user !== null) ? true : false;
   }
   public getUserLogged(){
    const user : any = JSON.parse(localStorage.getItem('user') || 'null');
    return (user !== null) ? user : null;
   }
   public logInWithGoogle(){
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    return signInWithPopup(auth, provider, browserPopupRedirectResolver);
   }
   
}
