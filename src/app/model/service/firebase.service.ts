import { Inject, Injectable, Injector } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from './auth.service';
import { Farm } from '../entities/farm';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private PATH: string = "farm";
  user: any;

  constructor(private storage: AngularFireStorage, private firestore: AngularFirestore, @Inject(Injector) private readonly injector: Injector){}

  private injectAuthService(){
    return this.injector.get(AuthService);
  }

  registerFarm(farm: Farm){
    return this.firestore.collection(this.PATH).add({farmName: farm.farmName, location: farm.location, uid: farm.uid, id: farm.id});
  }

  getAllFarms(){
    this.user = this.injectAuthService().getUserLogged();
    return this.firestore.collection(this.PATH, ref => ref.where('uid', '==', this.user.uid)).snapshotChanges();
  }

  createAnimal(){}

  // async userHasFarm(): Promise<boolean>{
  //   try {
  //     const currentUser$: Observable<User | null> = this.authService.getCurrentUser();
  //     if(currentUser$){
  //       const currentUser = await currentUser$.toPromise();
  //       if(currentUser){
  //         const userId = currentUser.uid;
  //         const farmProfile = await this.firestore.collection('farmProfiles').doc(userId).get().toPromise();
  //         if(farmProfile && farmProfile.exists) { // Adiciona verificação se farmProfile existe
  //           // Verifica se há fazendas associadas ao usuário dentro do documento de perfil da fazenda
  //           const farmData = farmProfile.data(); // Remove o tipo {} para deixar a inferência de tipo
  //           if (farmData && farmData.farms) { // Verifica se farmData não é nulo ou indefinido
  //             return true;
  //           } else {
  //             console.warn('Nenhuma fazenda encontrada para o usuário:', userId);
  //             return false;
  //           }
  //         } else {
  //           console.warn('Perfil da fazenda não encontrado para o usuário:', userId);
  //           return false;
  //         }
  //       } else {
  //         console.error('Nenhum usuário autenticado.');
  //         return false;
  //       }
  //     }
  //     return false;
  //   } catch (error) {
  //     console.error('Erro ao verificar se o usuário possui fazenda:', error);
  //     return false;
  //   }
  // }

  // async getUserFarms(): Promise<user[]> {
  //   try {
  //     const currentUser$: Observable<User | null> = this.authService.getCurrentUser();
  //     if (currentUser$) {
  //       const currentUser = await currentUser$.toPromise();
  //       if (currentUser) {
  //         const userId = currentUser.uid;
  //         const farmsSnapshot = await this.firestore.collection('farmProfiles').doc(userId).collection('farms').get().toPromise();
  //         if (farmsSnapshot && !farmsSnapshot.empty) { // Verifica se há documentos no snapshot
  //           const farms = farmsSnapshot.docs.map(doc => doc.data() as user);
  //           return farms;
  //         } else {
  //           console.warn('Nenhum snapshot de fazendas encontrado.');
  //           return [];
  //         }
  //       } else {
  //         console.error('Nenhum usuário autenticado.');
  //         return [];
  //       }
  //     }
  //     return [];
  //   } catch (error) {
  //     console.error('Erro ao obter as fazendas do usuário:', error);
  //     throw error;
  //   }
  // }
  
  // async listUserFarms(): Promise<user[]> {
  //   try {
  //     const currentUser$: Observable<User | null> = this.authService.getCurrentUser();
  //     if (currentUser$) {
  //       const currentUser = await currentUser$.toPromise();
  //       if (currentUser) {
  //         const userId = currentUser.uid;
  //         const farmProfile = await this.firestore.collection('farmProfiles').doc(userId).get().toPromise();
  //         if (farmProfile && farmProfile.exists) { // Verifica se o perfil da fazenda existe
  //           const farmData = farmProfile.data() as any; // Assume que farmData tem o formato esperado
  //           if (farmData && farmData.farms) { // Verifica se há fazendas associadas ao usuário
  //             return farmData.farms; // Retorna a lista de fazendas
  //           } else {
  //             console.warn('Nenhuma fazenda encontrada para o usuário:', userId);
  //             return [];
  //           }
  //         } else {
  //           console.warn('Perfil da fazenda não encontrado para o usuário:', userId);
  //           return [];
  //         }
  //       } else {
  //         console.error('Nenhum usuário autenticado.');
  //         return [];
  //       }
  //     }
  //     return [];
  //   } catch (error) {
  //     console.error('Erro ao obter as fazendas do usuário:', error);
  //     throw error;
  //   }
  // }
}
