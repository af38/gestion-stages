import { ToastModule } from 'primeng/toast';
import { CUSTOM_ELEMENTS_SCHEMA, Component, Input,inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators} from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-student-form',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers:[MessageService],
  imports: [FormsModule, ReactiveFormsModule, HttpClientModule, ToastModule],
  templateUrl: './student-form.component.html',
  styles: ['.invalid{border-color:red}', '.error{color:red}']
})
export class StudentFormComponent {

  //services
  MessageService :  MessageService = inject( MessageService);

  // constructor
  constructor(private fb: FormBuilder, private http: HttpClient){
  }

  // form validation
  isSubmitted: boolean = false;
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  create(event : Event){
    event.preventDefault();
    console.log(JSON.stringify(this.formGroup.value));
    this.http.post<any>("http://127.0.0.1:8000/api/etudiant", JSON.stringify(this.formGroup.value), {headers: this.headers})
    .subscribe({
        next: res => {
          this.MessageService.add({severity: 'success',summary: "succès", detail: res.message});
          this.formGroup.reset();
          this.isSubmitted = false;
        },
        error: err => {
          this.MessageService.add({severity: 'error',summary: "erreur", detail: err.error.message});
          this.isSubmitted = true;
        }
      }
    )
   }


   // form Validation
   formGroup: FormGroup = this.fb.group({
     nom: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[^!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/)]],
     prenom: ['', [ Validators.required, Validators.pattern(/^[^!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/)]],
     cne: ['', [Validators.required, Validators.pattern(/^[^!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/)]],
     filiere: ['',  [Validators.required, Validators.pattern(/^[^!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/)]],
     niveauEtude: ['', Validators.required],
     dateNaissance: ['', [ Validators.required]],
     email: [ '', [Validators.required, Validators.email]],
     specialite: ['', [Validators.required, Validators.pattern(/^[^!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/)]],
     numTel: [ '', Validators.required]
   });



   ngOnInit(): void {
     // this.formGroup.get(this.nomControl)?.setValue('');

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
