import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class openCloseForm{
    showCreateForm = false;

    constructor(){}

    openCreateForm(): void {
        this.showCreateForm = true;
      }
      closeCreateForm(): void {
        this.showCreateForm = false;
      }
}