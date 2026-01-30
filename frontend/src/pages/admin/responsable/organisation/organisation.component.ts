import { Component, inject } from '@angular/core';
import { NgClass, NgFor } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

import { ConfirmationService, MessageService } from 'primeng/api';
import { SidebarDataService } from '../../../../services/sidebar-data.service';
import { AdresseService } from '../../../../services/adresse.service';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';
import { NavBarComponent } from '../../components/admin-nav-bar/admin-nav-bar.component';

@Component({
  selector: 'app-organisation',
  standalone: true,
  imports: [FormsModule,HttpClientModule,ReactiveFormsModule,ButtonModule ,DialogModule, ConfirmDialogModule,ToastModule, SidebarComponent, NavBarComponent, NgClass, NgxPaginationModule, NgFor, AccordionModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './organisation.component.html',
  styles: ['.invalid{border-color:red}', '.error{color:red}']
})
export class OrganisationComponent {

  //services
  ConfirmationService: ConfirmationService = inject(ConfirmationService );
  MessageService :  MessageService = inject( MessageService);
  sidebarDataService: SidebarDataService = inject(SidebarDataService);
  adresseService: AdresseService = inject(AdresseService);

  // cities list
  regions:any;
  villes: any;

  // modal visibility
  visible_view: boolean = false;
  visible_edit: boolean = false;

  selectedOrganisme: any;
  isOpen:boolean = true;
  isSubmitted:boolean = false;

  //pagination
  page: number = 1;
  totalLength: any;

  // organisations
  organisations: any;

  sidebarItems:any  = [];
  query:string = '';
  type:string = '';

  //constructor
  constructor(private fb: FormBuilder, private http: HttpClient){
    this.sidebarItems = this.sidebarDataService.getSideBarData('resp', false, false);
    this.villes = this.adresseService.getVilles();
    this.regions = this.adresseService.getRegions();
  }
  //ngonit
  ngOnInit(){
    this.getAllOrganismes();
  }
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  onSubmit(event : Event, type: String){
    event.preventDefault();
    if(!this.hasErrors() && type == "create"){
      this.http.post<any>("http://127.0.0.1:8000/api/organisme", JSON.stringify(this.formGroup.value), {headers: this.headers})
      .subscribe({
        next: (res:any) => {
          this.MessageService.add({severity: 'success',summary: "succès", detail: res.message});
          this.formGroup.reset();
          this.isSubmitted = false;
          this.getAllOrganismes();
        },
        error: (err:any) => this.MessageService.add({severity: 'error',summary: "erreur", detail: err.error.message})
      })
    }else if(!this.hasErrors() && type === "edit"){
      this.http.patch(`http://127.0.0.1:8000/api/organisme/${this.selectedOrganisme.idOrganisme}`, JSON.stringify(this.formGroup.value), {headers: this.headers})
      .subscribe({
        next: (res:any) =>{
          this.MessageService.add({severity: 'success',summary: "succès", detail: res.message});
          this.formGroup.reset();
          this.isSubmitted = false;
          this.visible_edit = false;
          this.getAllOrganismes();
        },
        error: (err:any) => this.MessageService.add({severity: 'error',summary: "erreur", detail: err.error.message})
      }

      //   (resultData) => {

      // },
      // (error)=>{
      //   ;
      // }

    )
    }
     this.isSubmitted = true;
  }
  // Check if any control in the form group has an error
  private hasErrors(): boolean {
    return Object.values(this.formGroup.controls).some(control => control.invalid);
  }
  // get organismes
  getAllOrganismes(){
    this.http.get<any>(`http://127.0.0.1:8000/api/organisme/search?query=${this.query}&type=${this.type}`, {headers: this.headers})
    .subscribe((data) => {
      this.organisations = data;
    })
  }

  showDialogView(organisme: any){
    this.selectedOrganisme = organisme;
    this.visible_view = true;
  }
  showDialogEdit(organisme: any){
    this.selectedOrganisme = organisme;

    // set field values with selected organisme data
    let data = {
      nomOrganisme : organisme.nomOrganisme,
      nomContact: organisme.nomContact,
      prenomContact: organisme.prenomContact,
      typeOrganisme: organisme.typeOrganisme,
      telContact: organisme.telContact,
      emailContact: organisme.emailContact,
      ville: organisme.adresse.ville,
      rue: organisme.adresse.rue,
      region: organisme.adresse.region
    }
    this.formGroup.patchValue(data);
    this.visible_edit = true;

  }

  delete(id : number){
    this.ConfirmationService.confirm({
      header: 'Êtes-vous sûr(e)',
      message: "Veuillez confirmer pour continuer",
      accept: () => {
        this.http.delete(`http://127.0.0.1:8000/api/organisme/${id}`)
        .subscribe({
          next: (res:any) => {
            this.MessageService.add({severity: 'success',summary: "succès", detail: res.message});
            this.getAllOrganismes();
          },
          error: (err:any) => this.MessageService.add({severity: 'error',summary: "erreur", detail: err.error.message})
        });}})
  }

  // form Validation
  formGroup: FormGroup = this.fb.group({
    nomOrganisme: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[^!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/)]],
    nomContact: ['', Validators.required],
    prenomContact: ['', Validators.required],
    typeOrganisme: ['', [ Validators.required]],
    telContact: ['', [Validators.required, Validators.pattern(/^[^!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/)]],
    emailContact: ['', Validators.required],
    ville: ['', Validators.required],
    rue: ['', Validators.required],
    region: ['', Validators.required]
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
      }
    }if(controlName === 'telContact' && isNaN(Number(control?.value)) && (control?.dirty || control?.touched || this.isSubmitted)) {
      return "Ce champ doit être contenir seluement des nombres";
    }
    return null;
  }


}
