import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LotService } from 'src/app/model/service/lot.service';
import { Location } from '@angular/common';
import { confirmAlert } from 'src/app/common/confirmAlert';

@Component({
  selector: 'app-lot-management',
  templateUrl: './lot-management.page.html',
  styleUrls: ['./lot-management.page.scss'],
})
export class LotManagementPage implements OnInit {

  lotes: any[] = [];
  form!: FormGroup;

  showForm: boolean = false;
  editing: boolean = false;
  selectedLotId: string | null = null;

  constructor(private lotService: LotService, private fb: FormBuilder, private location: Location, private confAlert: confirmAlert) {}

  ngOnInit() {
    this.loadLots();

    this.form = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      location: ['', Validators.required],
    });
  }

  loadLots() {
    this.lotService.getLots().subscribe((data: any[]) => {
      this.lotes = data;
    });
  }

  openCreateForm() {
    this.editing = false;
    this.selectedLotId = null;
    this.form.reset();
    this.showForm = true;
  }

  openEditForm(lot: any) {
    this.editing = true;
    this.selectedLotId = lot.id;
    this.form.patchValue(lot);
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
  }

  goBack() {
    this.location.back();
  }


  async saveLot() {
    if (this.form.invalid) return;

    const lotData = this.form.value;

    if (this.editing && this.selectedLotId) {
      await this.lotService.updateLot(this.selectedLotId, lotData);
    } else {
      await this.lotService.createLot(lotData);
    }

    this.closeForm();
  }

    async deleteLot(lot: any) {
    this.confAlert.presentConfirmAlert("Excluir", "Tem certeza que deseja excluir?", (confirmed) => {
    if (confirmed) {
        this.lotService.deleteLot(lot.id).then(() => {
          this.loadLots();
        });
      }
    })
  }
}
