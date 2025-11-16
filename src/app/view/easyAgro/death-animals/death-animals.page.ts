import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
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
  templateUrl: './death-animals.page.html',
  styleUrls: ['./death-animals.page.scss'],
})
export class DeathAnimalsPage implements OnInit {
  showCreateForm = false;
  showEditForm = false;
  isClosingForm = false;
  selectedAnimal!: Animal;
  public animals: Animal[] = [];
  farmID: string | null = null;
  user!: user;
  farm!: Farm;
  farmName!: string;
  animal!: Animal;

  constructor(private authService: AuthService, private firebaseService: FirebaseService, private loading: loading, private alert: Alert, private confirmAlert: confirmAlert, private router: Router, private actionSheetCtrl: ActionSheetController) {
    this.user = this.authService.getUserLogged();
  }

  ngOnInit() {
    this.farm = history.state.farm;
    this.farmName = this.farm.farmName;
    this.firebaseService.getAllAnimalsDeathByFarm(this.farm.newFarmId).subscribe(res => {
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
    } catch (error) {
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

  // setLifeTrue(animal: Animal) {
  //   this.confirmAlert.presentConfirmAlert("ATENÇÃO", "Deseja realmente retornar o animal como vivo?", (confirmed) => {
  //     if (confirmed) {
  //       this.loading.showLoading(10);
  //       animal.life = true;
  //       this.firebaseService.editAnimal(animal, animal.id).then(() => {}).catch(error => {});
  //     }
  //   });
  // }

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

  openEditForm(animal: Animal) {
    this.selectedAnimal = animal;
    this.showEditForm = true;
    this.showCreateForm = false;
  }

  closeEditForm() {
    this.isClosingForm = true;
    setTimeout(() => {
      this.showEditForm = false;
      this.isClosingForm = false;
    }, 500);
  }

  openAliveAnimails(farm: Farm) {
    this.loading.showLoading(50);
    this.farmID = farm.newFarmId;
    this.router.navigateByUrl('/farm-details', { state: { farm } });
  }

    backFarmPage(){
    this.router.navigate(['/farm']);
  }

  async openAnimalActions(animal: any) {
  const actionSheet = await this.actionSheetCtrl.create({
    buttons: [
      {
        text: 'Compartilhar',
        icon: 'share-outline',
        handler: () => this.shareAnimalDetails(animal)
      },
      {
        text: 'Visualizar Detalhes',
        icon: 'eye-outline',
        handler: () => this.openEditForm(animal)
      },
      {
        text: 'Excluir',
        role: 'destructive',
        icon: 'trash-outline',
        handler: () => this.deleteAnimal(animal)
      },
      {
        text: 'Cancelar',
        role: 'cancel',
        icon: 'close'
      }
    ]
  });

  await actionSheet.present();
}
}
