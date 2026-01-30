import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { Component, OnInit, inject } from '@angular/core';
import { NavBarComponent } from '../../components/admin-nav-bar/admin-nav-bar.component';
import { NgClass, NgFor } from '@angular/common';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { SidebarDataService } from '../../../../services/sidebar-data.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AdresseService } from '../../../../services/adresse.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';


@Component({
  selector: 'app-parametrage',
  standalone: true,
  providers: [MessageService, ConfirmationService],
  imports: [SidebarComponent, NavBarComponent, NgClass, ReactiveFormsModule, DialogModule, ToastModule, ButtonModule, ConfirmDialogModule, NgFor ],
  templateUrl: './parametrage.component.html',
  styles: ['.invalid{border-color:red}', '.error{color:red}']
})
export class ParametrageComponent implements OnInit{
  //headers
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  isOpen: boolean = true;
  sidebarItems  = [];
  isSubmitted:boolean = false;
  etablissement: any;

  //services
  ConfirmationService: ConfirmationService = inject(ConfirmationService );
  MessageService :  MessageService = inject( MessageService);
  sidebarDataService: SidebarDataService = inject(SidebarDataService);
  adresseService: AdresseService = inject(AdresseService);

  // cities list
  regions:any;
  villes: any;

  // modal visibility
  visible_create : boolean = false;
  visible_edit : boolean = false

  // constructor
  constructor(private fb: FormBuilder, private http: HttpClient){
    this.sidebarItems = this.sidebarDataService.getSideBarData('admin', false, false);
    this.villes = this.adresseService.getVilles();
    this.regions = this.adresseService.getRegions();
  }

  //ngoninit
  ngOnInit(): void {
    this.getEtablissement();
  }
  getEtablissement(){
    this.http.get<any>("http://127.0.0.1:8000/api/etablissement")
    .subscribe({
      next: (res:any) => this.etablissement = res,
      error: err => console.log('error fetching data')
    });
  }
  showCreateForm(){
    this.visible_create = true;
  }
  showEditForm(){
    let data = {
      logo: this.etablissement.logo,
      nomOrganisme : this.etablissement.organisme.nomOrganisme,
      nomContact: this.etablissement.organisme.nomContact,
      prenomContact: this.etablissement.organisme.prenomContact,
      typeOrganisme: this.etablissement.organisme.typeOrganisme,
      telContact: this.etablissement.organisme.telContact,
      emailContact: this.etablissement.organisme.emailContact,
      ville: this.etablissement.organisme.adresse.ville,
      rue: this.etablissement.organisme.adresse.rue,
      region: this.etablissement.organisme.adresse.region
    }
    this.formGroup.patchValue(data);
    this.visible_edit = true;
  }
  create(e : Event){
    e.preventDefault();
    this.http.post<any>("http://127.0.0.1:8000/api/etablissement", JSON.stringify(this.formGroup.value), {headers: this.headers})
    .subscribe({
      next: (data:any) => {
        this.MessageService.add({severity: 'success',summary: "succès", detail: data.message});
        this.getEtablissement();
        this.visible_create = false;
        },
      error: (err:any) => this.MessageService.add({severity: 'error',summary: "erreur", detail: err.error.message})
    })
  }
  edit(e: Event){
    e.preventDefault();
    this.http.patch<any>(`http://127.0.0.1:8000/api/etablissement/${this.etablissement.idEtablissement}`, JSON.stringify(this.formGroup.value), {headers: this.headers})
    .subscribe({
      next: (data:any) => {
        this.MessageService.add({severity: 'success',summary: "succès", detail: data.message});
        this.getEtablissement();
        this.visible_edit = false;
    },
      error: (err:any) => this.MessageService.add({severity: 'error',summary: "erreur", detail: err.error.message})
    })
  }
  supprimer(){
    this.ConfirmationService.confirm({
      header: 'Êtes-vous sûr(e)',
      message: "Veuillez confirmer pour continuer",
      accept: () => {
        this.http.delete(`http://127.0.0.1:8000/api/organisme/${this.etablissement.idEtablissement}`)
        .subscribe({
          next: (res:any) => this.MessageService.add({severity: 'success',summary: "succès", detail: res.message}),
          error: (err:any) => this.MessageService.add({severity: 'error',summary: "erreur", detail: err.error.message})
        });
      }
    });
  }

  onFileSelected(e: any){
    this.formGroup.get('logo')?.setValue(e.target.files[0].name);
    console.log(e.target.files[0].name);
  }

  //form group
  formGroup: FormGroup = this.fb.group({
    nomOrganisme: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[^!@#$%^&*()_+\-=\[\]{};:"\\|,.<>\/?]+$/)]],
    nomContact: ['', Validators.required],
    prenomContact: ['', Validators.required],
    typeOrganisme: ['', [ Validators.required]],
    telContact: ['', [Validators.required, Validators.pattern(/^[^!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/)]],
    emailContact: ['', Validators.required],
    ville: ['', Validators.required],
    rue: ['', Validators.required],
    region: ['', Validators.required],
    logo: ['', Validators.required]
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
      }
    }if(controlName === 'telContact' && isNaN(Number(control?.value)) && (control?.dirty || control?.touched || this.isSubmitted)) {
      return "Ce champ doit être contenir seluement des nombres";
    }
    return null;
  }


}
