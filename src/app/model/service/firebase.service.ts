import { Inject, Injectable, Injector } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from './auth.service';
import { Farm } from '../entities/farm';
import { Animal } from '../entities/Animal';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private PATHFarm: string = "farm";
  private PATHAnimal: string = "animals"
  user: any;
  farm: any;

  constructor(private storage: AngularFireStorage, private firestore: AngularFirestore, @Inject(Injector) private readonly injector: Injector){}

  private injectAuthService(){
    return this.injector.get(AuthService);
  }

  registerFarm(farm: Farm){
    return this.firestore.collection(this.PATHFarm).add({farmName: farm.farmName, location: farm.location, uid: farm.uid, id: farm.id});
  }

  registerAnimal(animal: Animal){
    return this.firestore.collection(this.PATHAnimal).add({animalName: animal.name, species: animal.species, uid: animal.uid, animalNumber: animal.number, historyOfIllnesses: animal.historyOfIllnesses, treatmentHistory: animal.treatmentHistory});
  }

  getAllFarms(){
    this.user = this.injectAuthService().getUserLogged();
    return this.firestore.collection(this.PATHFarm, ref => ref.where('uid', '==', this.user.uid)).snapshotChanges();
  }

  getAllAnimalsByFarmId(){
    this.user = this.injectAuthService().getUserLogged();
    return this.firestore.collection(this.PATHAnimal, ref => ref.where('uid', '==', this.user.uid)).snapshotChanges();//.where('farmId', '==', this.farm.id)
  }

}