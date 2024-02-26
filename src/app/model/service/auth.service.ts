import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from './firebase.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  dataUser: any;

  constructor(private firebase: FirebaseService, private auth: AngularFireAuth, private router: Router, private ngZone: NgZone){
    this.auth.authState.subscribe(user =>{
      if(user){
        this.dataUser = user;
        localStorage.setItem('user', JSON.stringify(this.dataUser))
      }else{
        localStorage.setItem('user', 'null');
      }
    });
  }

  public signIn(email: string, password: string){
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  public register(email: string, password: string){
    return this.auth.createUserWithEmailAndPassword(email, password);
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
}
