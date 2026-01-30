import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
// import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styles: ['.invalid{border-color:red}', '.error{color:red}']
})
export class LoginComponent implements OnInit {

  isSubmitted:boolean = false;
  errMessage: string = '';
  etablissement:any;

  //constructor
  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router){
    this.getEtablissement();
  }

  //ngonit
  ngOnInit(){
  }

  authservice: AuthService = inject(AuthService);

  private setHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    // headers =  headers.set('Accept', 'application/json');
    // headers =  headers.set('Origin', 'http://localhost:4200');
    // headers =  headers.set("X-XSRF-TOKEN", this.getCookie('XSRF-TOKEN'));
    // headers =  headers.set("withXSRFToken", "true");
    headers =  headers.set('Content-Type', 'application/json');

    // headers =  headers.set('withXSRFToken', 'true');

    return headers;
  }

  login(e:Event){
    const headers = this.setHeaders();
    this.authservice.login(this.formGroup.value).
    subscribe({
      next: (response:any) => {
        if(response.status){
          switch (response.role) {
            case 'resp':
              this.router.navigate(['/affectation']);
              break;
            case 'student':
              this.router.navigate(['/student-home']);
              break;
            case 'teacher':
              this.router.navigate(['/teacher-home']);
              break;
            default:
              this.router.navigate(['/create-accounts']);
              break;
          }
        }
      },
      error: (err:any) => {this.errMessage = err.error.message}
    })
  }
  // form Validation
  formGroup: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  // getError function
  getError(controlName: string): string | null{
    const control = this.formGroup?.get(controlName);
    const errors = control?.errors as ValidationErrors | null;
    if(errors && (control?.dirty || control?.touched || this.isSubmitted)){
      if(errors['required']){
        return 'ce champe est requise';
      }else if(errors['email']){
        return 'Ce champ doit être un email';
      }
    }
    return null;
  }

  getEtablissement(){
    this.http.get<any>("http://127.0.0.1:8000/api/etablissement")
    .subscribe({
      next: (res:any) => this.etablissement = res,
      error: err => console.log('error fetching data')
    });
  }

}
