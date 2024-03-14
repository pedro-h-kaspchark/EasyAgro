import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { signInWithPopup, browserPopupRedirectResolver, GoogleAuthProvider, Auth, User } from 'firebase/auth';
import { getAuth } from 'firebase/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  dataUser: any;

  constructor(private firestore: AngularFirestore, private auth: AngularFireAuth, private router: Router, private ngZone: NgZone){
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

  public async register(
    email: string,
    password: string,
    displayName: string,
    photoURL: string
  ) {
    try {
      const userCredential = await this.auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      if(user){
        this.dataUser ={
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          number: user.phoneNumber,
          photoURL: user.photoURL
        };
        localStorage.setItem('user', JSON.stringify(this.dataUser));
        await this.firestore.collection('users').doc(user.uid).set({
          uid: user.uid,
          email: user.email,
          displayName,
          number: '',
          photoURL
        });
        return{
          user: this.dataUser,
          displayName,
          photoURL
        };
      } else {
        throw new Error('User not found after registration');
      }
    }catch(error){
    throw error;
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
}
