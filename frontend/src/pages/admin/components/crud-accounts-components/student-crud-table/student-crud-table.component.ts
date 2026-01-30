import { Component, OnInit, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgFor } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-student-crud-table',
  standalone: true,
  imports: [DialogModule,ToastModule, ButtonModule,ConfirmDialogModule, NgxPaginationModule, NgFor, ReactiveFormsModule, FormsModule, HttpClientModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './student-crud-table.component.html',
  styles: ['.invalid{border-color:red}', '.error{color:red}']
})

export class StudentCrudTableComponent implements OnInit{


  query :string = '';
  filiere: string = '';
  uniqueFilieres: string[] = [];

  //services
  ConfirmationService: ConfirmationService = inject(ConfirmationService );
  MessageService :  MessageService = inject( MessageService);

  // strudent list
  studentsArray: any;
  students: any;

  // pagination
  page: number = 1;
  totalLength: any;

  // form validation
  isSubmitted: boolean = false;
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  // constructor
  constructor(private fb: FormBuilder, private http: HttpClient){
  }

  //
  ngOnInit(): void {
    this.getAllStudents();
    this.getFeliers();
  }

  //modals
  // modal visibility
  visible_view: boolean = false;
  visible_edit: boolean = false;

  // selected student
  selectedStudent: any;

  showDialogView(student: any){
    this.selectedStudent = student;
    this.visible_view = true;
  }
  showDialogEdit(student: any){
    this.selectedStudent = student;
    this.visible_edit = true;

    // set field values with selected student data
    let data = {
      nom : student.utilisateur.nom,
      prenom: student.utilisateur.prenom,
      email: student.utilisateur.email,
      numTel: student.utilisateur.numTel,
      cne:student.cne,
      dateNaissance: student.dateNaissance,
      filiere: student.filiere,
      niveauEtude: student.niveauEtude,
      specialite: student.specialite
    }
    this.formGroup.patchValue(data);
  }

  deleteStudent(id:number){
    this.ConfirmationService.confirm({
      header: 'Êtes-vous sûr(e)',
      message: "Veuillez confirmer pour continuer",
      accept: () => {
        this.http.delete(`http://127.0.0.1:8000/api/etudiant/${id}`)
        .subscribe({
          next: (res:any) => {
            this.MessageService.add({severity: 'success',summary: "succès", detail: res.message});
            this.getAllStudents();
        },
          error: (err:any) => this.MessageService.add({severity: 'error',summary: "erreur", detail: err.error.message})
        });
      }
    })
  }



  // update
  onSubmit(event : Event){
    console.log(JSON.stringify(this.formGroup.value));
    this.http.patch<any>(`http://127.0.0.1:8000/api/etudiant/${this.selectedStudent.idEtudiant}`, JSON.stringify(this.formGroup.value), {headers: this.headers})
    .subscribe({
      next: (res:any) => {
        this.MessageService.add({severity: 'success',summary: "Succès", detail: res.message});
        this.visible_edit = false;
        this.getAllStudents();
      },
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
    cne: ['', [Validators.required, Validators.pattern(/^[^!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/)]],
    filiere: ['',  [Validators.required, Validators.pattern(/^[^!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/)]],
    niveauEtude: ['',  [Validators.required, Validators.pattern(/^[^!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/)]],
    dateNaissance: [ Validators.required],
    email: [ '', [Validators.required, Validators.email]],
    specialite: [ [Validators.required, Validators.pattern(/^[^!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/)]],
    numTel: [ '', Validators.required]
  });

  //get all rapports
  getAllStudents(){
    this.http.get<any>(`http://127.0.0.1:8000/api/etudiants/search?query=${this.query}&filiere=${this.filiere}`, {headers: this.headers})
      .subscribe((data) => {
        this.students = data;
      })
  }

  getFeliers(){
    this.http.get<any>("http://127.0.0.1:8000/api/etudiants/filieres", {headers: this.headers})
      .subscribe((data) => {
        this.uniqueFilieres = data;
      })
  }


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
    }if(controlName === 'numTel' && isNaN(Number(control?.value)) && (control?.dirty || control?.touched || this.isSubmitted)) {
      return "Ce champ doit être un numéro de téléphone d'au moins 8 chiffres";
    }if(/\d/.test(control?.value) && controlName !== 'niveauEtude' && controlName !== 'email' && controlName !== 'dateNaissance' && controlName !== 'cne' && controlName !== 'numTel' && (control?.dirty || control?.touched || this.isSubmitted)){
      return 'Ce champ ne doit pas contenir chiffres';
    }
    return null;
  }

}
