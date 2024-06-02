import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Alert } from 'src/app/common/alert';
import { confirmAlert } from 'src/app/common/confirmAlert';
import { loading } from 'src/app/common/loading';
import { Animal } from 'src/app/model/entities/Animal';
import { Farm } from 'src/app/model/entities/farm';
import { user } from 'src/app/model/entities/user';
import { AuthService } from 'src/app/model/service/auth.service';
import { FirebaseService } from 'src/app/model/service/firebase.service';

@Component({
  selector: 'app-farm-details',
  templateUrl: './farm-details.page.html',
  styleUrls: ['./farm-details.page.scss'],
})
export class FarmDetailsPage implements OnInit {
  showCreateForm = false;
  showEditForm = false;
  selectedAnimal!: Animal;
  public animals: Animal[] = [];
  farmID: string | null = null;
  user!: user;
  farm!: Farm;
  farmName!: string;
  animal!: Animal;

  constructor(private authService: AuthService, private firebaseService: FirebaseService, private loading: loading, private alert: Alert, private confirmAlert: confirmAlert, private router: Router){
    this.user = this.authService.getUserLogged();
  }

  ngOnInit() {
    this.farm = history.state.farm;
    this.farmName = this.farm.farmName;
    this.firebaseService.getAllAnimalsByFarm(this.farm.id).subscribe(res => {
      this.animals = res.map(animal => {
        return { id: animal.payload.doc.id, ...animal.payload.doc.data() as any } as Animal;
      });
    });
  }

  async shareAnimalDetails(animal: Animal) {
    this.loading.showLoading(1200);
    try {
      const farm = await this.firebaseService.getFarm(animal);
      const pdfUrl = await this.firebaseService.uploadPDF(animal);
      console.log('PDF URL:', pdfUrl);
      if (navigator.share) {
        await navigator.share({
          title: `Detalhes do animal: ${animal.name}`,
          url: pdfUrl,
        });
      } else {
        this.copyToClipboard(pdfUrl);
        alert('Link do PDF copiado para a área de transferência. Você pode compartilhar manualmente.');
      }
    }catch (error){
      console.error('Erro ao gerar o PDF:', error);
    }
  }

  copyToClipboard(text: string) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-999999px';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }

  hasDeadAnimals(): boolean {
    return this.animals.some(animal => animal.life === false);
  }

  setLifeFalse(animal: Animal){
    this.confirmAlert.presentConfirmAlert("ATENÇÃO", "Deseja realmente declarar o óbito do animal?", (confirmed) =>{if(confirmed){this.loading.showLoading(10);
      animal.life = false;
      this.firebaseService.editAnimal(animal, animal.id).then(() => {}).catch(error =>{});}});
  }

  deleteAnimal(animal: Animal) {
    this.confirmAlert.presentConfirmAlert("ATENÇÃO", "Você realmente deseja deletar esse animal?", (confirmed) => {
      if (confirmed) {
        this.loading.showLoading(10);
        this.firebaseService.deleteAnimal(animal.id).then(() => {
        }).catch((error) => {
          console.log(error);
          this.alert.presentAlert('Erro', 'Erro ao excluir o animal!');
        });
      }
    });
  }

  openCreateForm() {
    this.showCreateForm = true;
    this.showEditForm = false;
  }

  closeCreateForm() {
    const form = document.querySelector('.create-form');
    if (form) {
      form.classList.add('hidden');
      form.addEventListener('animationend', () => {
        this.showCreateForm = false;
      }, { once: true });
    }
  }

  openEditForm(animal: Animal) {
    this.selectedAnimal = animal;
    this.showEditForm = true;
    this.showCreateForm = false;
  }

  closeEditForm() {
    const form = document.querySelector('.edit-form');
    if (form) {
      form.classList.add('hidden');
      form.addEventListener('animationend', () => {
        this.showEditForm = false;
      }, { once: true });
    }
  }

  openDeathAnimals(farm: Farm){
    this.loading.showLoading(50);
    this.farmID = farm.id;
    this.router.navigateByUrl('/death-animals', { state: { farm } });
  }

  backFarmPage(){
    this.router.navigate(['/farm']);
  }

  onAnimalRegistered() {
    this.closeCreateForm();
    this.firebaseService.getAllAnimalsByFarm(this.farm.id).subscribe(res => {
      this.animals = res.map(animal => {
        return { id: animal.payload.doc.id, ...animal.payload.doc.data() as any } as Animal;
      });
    });
  }

  onAnimalUpdated() {
    this.closeEditForm();
    this.firebaseService.getAllAnimalsByFarm(this.farm.id).subscribe(res => {
      this.animals = res.map(animal => {
        return { id: animal.payload.doc.id, ...animal.payload.doc.data() as any } as Animal;
      });
    });
  }
}
