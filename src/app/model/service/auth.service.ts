import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { signInWithPopup, browserPopupRedirectResolver, GoogleAuthProvider } from 'firebase/auth';
import { getAuth } from 'firebase/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';
import 'firebase/compat/auth';
import { User as FirebaseUser } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  dataUser: any;
  user: any

  constructor(private firestore: AngularFirestore, private auth: AngularFireAuth, private router: Router, private ngZone: NgZone, private storage: AngularFireStorage){
    this.auth.authState.subscribe(user =>{
      if(user){
        this.dataUser ={
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
  
  public async register(email: string, password: string, displayName: string, photoURL: File | null, phoneNumber: string | null){
    try{
      const userCredential = await this.auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      let photoURLUploaded: string | undefined = undefined;
      if(user){
        if (photoURL){
          const uploadResult = await this.uploadImage(photoURL, user.uid);
          photoURLUploaded = uploadResult;
        }
        this.dataUser ={
          uid: user.uid,
          email: user.email,
          displayName: displayName,
          phoneNumber: phoneNumber,
          photoURL: photoURLUploaded};
        localStorage.setItem('user', JSON.stringify(this.dataUser));
        await this.firestore.collection('users').doc(user.uid).set({
          uid: user.uid,
          email: user.email,
          displayName: displayName,
          phoneNumber: phoneNumber,
          photoURL: photoURLUploaded});
        return{
          user: this.dataUser,
          displayName: user.displayName,
          photoURL: photoURLUploaded};
      }else{
        throw new Error('Usuário não encontrado após cadastro!');
      }
    }catch(error){
      throw error;
    }
  }

  public async registerWithoutPhoto(email: string, password: string, displayName: string, phoneNumber: string){
    try{
      const userCredential = await this.auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      if(user){
        this.dataUser ={
          uid: user.uid,
          email: user.email,
          displayName: displayName,
          phoneNumber: phoneNumber,
          photoURL: null 
        };
        localStorage.setItem('user', JSON.stringify(this.dataUser));
        await this.firestore.collection('users').doc(user.uid).set({
          uid: user.uid,
          email: user.email,
          displayName: displayName,
          phoneNumber: phoneNumber
        });
        return{
          user: this.dataUser,
          displayName: user.displayName,
          photoURL: null 
        };
      }else{
        throw new Error('Usuário não encontrado após cadastro!');
      }
    }catch(error){
      throw error;
    }
  }

  //-------------------------------------------------------------------------//
  public async updateProfile(displayName: string, phoneNumber: string){
    try{
      const user = await this.auth.currentUser;
      if (user) {
        await user.updateProfile({
          displayName: displayName
        });
        await this.firestore.collection('users').doc(user.uid).update({
          displayName: displayName,
          phoneNumber: phoneNumber
        });
        return true;
      }
      return false;
    }catch (error){
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    }
  }

  public async uploadPhoto(photoURL: File){
    try{
      const user = await this.auth.currentUser;
      if (user){
        const downloadURL = await this.uploadImage(photoURL, user.uid);
        await user.updateProfile({
          photoURL: downloadURL
        });
        await this.firestore.collection('users').doc(user.uid).update({
          photoURL: downloadURL
        });
        return downloadURL;
      }
      return null;
    }catch (error){
      console.error('Erro ao fazer upload da foto de perfil:', error);
      throw error;
    }
  }

  //-------------------------------------------------------------------------//

  private async uploadImage(photoURL: File, userId: string): Promise<string>{
    try{
      const storageRef = this.storage.ref(`users/${userId}/${photoURL.name}`);
      const uploadTask = await storageRef.put(photoURL);
      const downloadURL = await uploadTask.ref.getDownloadURL();
      return downloadURL;
    }catch (error){
      console.error('Erro ao fazer upload da imagem:', error);
      throw error;
    }
  }
  
  async getUserData(): Promise<any> {
    const user = await this.auth.currentUser;
    if (user) {
      try {
        const userDataSnapshot = await this.firestore.collection('users').doc(user.uid).get().toPromise();
        if (userDataSnapshot && userDataSnapshot.exists) {
          const userData = userDataSnapshot.data();
          return {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            phoneNumber: user.phoneNumber,
            photoURL: user.photoURL,
            ...(userData as Record<string, any>)
          };
        } else {
          return {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            phoneNumber: user.phoneNumber,
            photoURL: user.photoURL
          };
        }
      }catch (error){
        console.error('Erro ao obter os dados do usuário:', error);
        return null;
      }
    }else{
      console.error('Nenhum usuário autenticado.');
      return null;
    }
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

  public getCurrentUser(): Observable<FirebaseUser | null> {
    return this.auth.authState as Observable<FirebaseUser | null>;
  }

}