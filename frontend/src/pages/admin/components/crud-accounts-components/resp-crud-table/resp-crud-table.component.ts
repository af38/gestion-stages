import { NgFor } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-resp-crud-table',
  standalone: true,
  imports: [DialogModule,ToastModule ,ConfirmDialogModule, ButtonModule, NgxPaginationModule, HttpClientModule, NgFor, ReactiveFormsModule, FormsModule],
  templateUrl: './resp-crud-table.component.html',
  providers: [ConfirmationService, MessageService],
  styles: ['.invalid{border-color:red}', '.error{color:red}']
})
export class RespCrudTableComponent implements OnInit{

  query :string = '';

  // services
  ConfirmationService: ConfirmationService = inject(ConfirmationService );
  MessageService :  MessageService = inject( MessageService);

  // modal visibility
  visible_view: boolean = false;
  visible_edit: boolean = false;

  // selected student
  selectedResp: any;

  // strudent list
  resps: any;
  isSubmitted: boolean = false;

  // pagination
  page: number = 1;
  totalLength: any;

  // constructor
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  constructor(private fb: FormBuilder, private http: HttpClient){

  }

  ngOnInit(){
    this.getAllResps();
  }


  getAllResps(){
    this.http.get<any>(`http://127.0.0.1:8000/api/resps/search?query=${this.query}`, {headers: this.headers})
      .subscribe((data) => {
      this.resps = data;
    })
  }

  showDialogView(resp: any){
    this.selectedResp = resp;
    this.visible_view = true;
  }
  showDialogEdit(resp: any){
    this.selectedResp = resp;
    this.visible_edit = true;

    // set field values with selected resp data
    let data = {
      nom : resp.utilisateur.nom,
      prenom: resp.utilisateur.prenom,
      email: resp.utilisateur.email,
      numTel: resp.utilisateur.numTel
    }
    this.formGroup.patchValue(data);
  }

  // delete fucntion
  deleteResp(id:number){
    this.ConfirmationService.confirm({
      header: 'Êtes-vous sûr(e)',
      message: "Veuillez confirmer pour continuer",
      accept: () => {
        this.http.delete(`http://127.0.0.1:8000/api/resp/${id}`)
        .subscribe({
          next: (res:any) => {
            this.MessageService.add({severity: 'success',summary: "succès", detail: res.message});
            this.getAllResps();
          },
          error: (err:any) => this.MessageService.add({severity: 'error',summary: "erreur", detail: err.error.message})
        });
      }
    })
  }

  // form validation
  update(e : Event){
    e.preventDefault();
    this.http.patch<any>(`http://127.0.0.1:8000/api/resp/${this.selectedResp.idResp}`, JSON.stringify(this.formGroup.value), {headers: this.headers})
    .subscribe({
      next: (res:any) => this.MessageService.add({severity: 'success',summary: "Succès", detail: res.message}),
      error: (err: any) => this.MessageService.add({severity: 'error',summary: "Erreur", detail: err.error.message})
    }
  )
    this.visible_edit = false;
    this.isSubmitted = true;
  }

  // form Validation
  formGroup: FormGroup = this.fb.group({
    nom: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[^!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/)]],
    prenom: ['', [ Validators.required, Validators.pattern(/^[^!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/)]],
    email: [ '', [Validators.required, Validators.email]],
    numTel: [ '', Validators.required]
  });


  // isInvalid function to add error classes
  isInvalid(controlName: string){
    const control = this.formGroup?.get(controlName);
    return control?.invalid && (control?.dirty || control?.touched || this.isSubmitted);
  }

// getError function
getError(controlName: string): string | null{
  const control = this.formGroup?.get(controlName);
  const errors = control?.errors as ValidationErrors | null;
  if(errors && (control?.dirty || control?.touched || this.isSubmitted)){
    if(errors['required']){
      return 'ce champe est requise';
    }else if (errors['minlength']) {
      return `Ce champ doit être ${errors['minlength'].requiredLength} caractères ou plus`;
    }else if(errors['pattern']){
      return 'Ce champ ne doit pas contenir de caractères spéciaux';
    }else if(errors['email']){
      return 'Ce champ doit être une adresse email';
    }
  }if(controlName === 'tel' && isNaN(Number(control?.value)) && (control?.dirty || control?.touched || this.isSubmitted)) {
    return "Ce champ doit être un numéro de téléphone d'au moins 8 chiffres";
  }if(/\d/.test(control?.value) && controlName !== 'email' && controlName !== 'numTel' && (control?.dirty || control?.touched || this.isSubmitted)){
    return 'Ce champ ne doit pas contenir chiffres';
  }
  return null;
}

}
