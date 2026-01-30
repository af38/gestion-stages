import { NgFor } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-teacher-crud-table',
  standalone: true,
  imports: [DialogModule,ToastModule ,ConfirmDialogModule, ButtonModule, NgxPaginationModule,HttpClientModule, NgFor, FormsModule, ReactiveFormsModule],
  templateUrl: './teacher-crud-table.component.html',
  providers: [ConfirmationService, MessageService],
  styles: ['.invalid{border-color:red}', '.error{color:red}']
})
export class TeacherCrudTableComponent implements OnInit{

  query :string = '';
  d:string = '';

  ConfirmationService: ConfirmationService = inject(ConfirmationService );
  MessageService :  MessageService = inject( MessageService);

  teachers: any;
  // modal visibility
  visible_view: boolean = false;
  visible_edit: boolean = false;

  // selected teacher
  selectedTeacher: any;

  departements: string[] = [];
  isSubmitted: boolean = false;

  // pagination
  page: number = 1;
  totalLength: any;

  // constructor
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  ngOnInit(): void {
    this.getAllTeachers();
    this.getDepartemetns();
  }

  constructor(private fb: FormBuilder, private http: HttpClient){
  }

  getAllTeachers(){
    this.http.get<any>(`http://127.0.0.1:8000/api/enseignant/search?query=${this.query}&d=${this.d}`, {headers: this.headers})
      .subscribe((data) => {
        this.teachers = data;
    })
  }

  getDepartemetns(){
    // http://127.0.0.1:8000/api/enseignantt/departements
    this.http.get<any>("http://127.0.0.1:8000/api/enseignantt/departements", {headers: this.headers})
      .subscribe((data) => {
        this.departements = data;
    })
  }

  showDialogView(teacher: any){
    this.selectedTeacher = teacher;
    this.visible_view = true;
  }
  showDialogEdit(teacher: any){
    this.selectedTeacher = teacher;
    // set field values with selected teacher data
    let data = {
      nom : teacher.utilisateur.nom,
      prenom: teacher.utilisateur.prenom,
      email: teacher.utilisateur.email,
      numTel: teacher.utilisateur.numTel,
      departement: teacher.departement,
    }
    this.formGroup.patchValue(data);
    this.visible_edit = true;

  }
  // delete fucntion
  delete(id:number){
    this.ConfirmationService.confirm({
      header: 'Êtes-vous sûr(e)',
      message: "Veuillez confirmer pour continuer",
      accept: () => {
        this.http.delete(`http://127.0.0.1:8000/api/enseignant/${id}`)
        .subscribe({
          next: (res:any) => {
            this.MessageService.add({severity: 'success',summary: "Success", detail: res.message});
            this.getAllTeachers();
        },
          error: (err:any) => this.MessageService.add({severity: 'error',summary: "Error", detail: err.error.message})
        });
      }
    })
  }


  // edit form

  update(event : Event){
    event.preventDefault();
    this.http.patch<any>(`http://127.0.0.1:8000/api/enseignant/${this.selectedTeacher.idEnseignant}`, JSON.stringify(this.formGroup.value), {headers: this.headers})
    .subscribe({
      next: (res:any) => {this.MessageService.add({severity: 'success',summary: "succès", detail: res.message});
      this.getAllTeachers();
      this.visible_edit = false;
    },
      error: (err:any) => this.MessageService.add({severity: 'error',summary: "erreur", detail: err.error.message})
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
    departement: [ [Validators.required, Validators.pattern(/^[^!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/)]],
    numTel: [ '', Validators.required]
  });


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
  }if(controlName === 'numTel' && isNaN(Number(control?.value)) && (control?.dirty || control?.touched || this.isSubmitted)) {
    return "Ce champ doit être un numéro de téléphone d'au moins 8 chiffres";
  }if(/\d/.test(control?.value) && controlName !== 'email' && controlName !== 'numTel' && (control?.dirty || control?.touched || this.isSubmitted)){
    return 'Ce champ ne doit pas contenir chiffres';
  }
  return null;
}
  }
