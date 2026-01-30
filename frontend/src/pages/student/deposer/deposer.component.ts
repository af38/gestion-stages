import { NavBarComponent } from './../../admin/components/admin-nav-bar/admin-nav-bar.component';
import { Component, Inject, OnInit, inject } from '@angular/core';

import { CommonModule, DOCUMENT, NgClass, NgFor } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { SidebarComponent } from '../../admin/components/sidebar/sidebar.component';

import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { StepperModule } from 'primeng/stepper';

import { SidebarDataService } from '../../../services/sidebar-data.service';
import { ButtonModule } from 'primeng/button';
import { AdresseService } from '../../../services/adresse.service';
import { AccordionModule } from 'primeng/accordion';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-deposer',
  standalone: true,
  imports: [StepperModule,ButtonModule,TagModule ,AccordionModule,CommonModule, NavBarComponent, HttpClientModule,ReactiveFormsModule, DialogModule, ConfirmDialogModule,ToastModule, SidebarComponent, NgClass, NgxPaginationModule, NgFor],
  providers: [ConfirmationService, MessageService],
  templateUrl: './deposer.component.html',
  styles: ['.invalid{border-color:red}', '.error{color:red}']
})
export class DeposerComponent implements OnInit{
  //http header
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  fuckingID:number = 0;

  //services
  ConfirmationService: ConfirmationService = inject(ConfirmationService );
  MessageService :  MessageService = inject( MessageService);
  sidebarDataService: SidebarDataService = inject(SidebarDataService);
  adresseService: AdresseService = inject(AdresseService);
  // modal visibility
  visible_stage_view: boolean = false;
  visible_organisme_view: boolean = false;
  visible_stage_edit: boolean = false;
  visible_organisme_edit: boolean = false;

  isOpen:boolean = true;
  isSubmitted:boolean = false;
  sidebarItems: any = [];
  stagesDeposes: any = [];
  villes:any = [];
  regions:any = [];
  organisationsDeposes: any = [];
  selectedStage: any;
  selectedOrganisme: any;

  //pagination
  page: number = 1;
  totalLength: any;

  //constructor
  loggeduser:any = null;

  constructor(private fb: FormBuilder, private http: HttpClient){
    this.sidebarItems = this.sidebarDataService.getSideBarData('student', false, false);
    this.villes = this.adresseService.getVilles();
    this.regions = this.adresseService.getRegions();

    this.getUser();
  }

  //ngonit
  ngOnInit():void{
    this.getUser();
    this.getStagesDeposes();
    this.getOrganismesDeposes();
  }

  getUser(){
    if(localStorage){
      const storedUser = localStorage.getItem('user');
      this.loggeduser = storedUser ? JSON.parse(storedUser) : null;
    }else{
      console.log('loclastorhs')
    }
    console.log(this.loggeduser);
    this.fuckingID = this.loggeduser.idUser;
  }

  //trim string
  trimText(str : string) : string{
    if(str.length>20){
      return str.substring(0,20) + '...';
    }
    return str;
  }


  //create function
  create(){
    this.formGroup.get('idEtudiant')?.setValue(this.loggeduser.idUser);
    if(!this.hasErrors(this.formGroup)){
      this.http.post<any>("http://127.0.0.1:8000/api/deposer", JSON.stringify(this.formGroup.value), {headers: this.headers})
      .subscribe({
        next: (res:any) => {
          this.MessageService.add({severity: 'success',summary: "Success", detail: res.message});
          this.formGroup.reset();
          this.isSubmitted = false;
          this.getStagesDeposes();
        },
        error: (err:any) => this.MessageService.add({severity: 'error',summary: "erreur", detail: err.error.message})
      });
    }
  }

  //edit function: to be deleted
  edit(e: Event){
    e.preventDefault();
    if(!this.hasErrors(this.editstageFormGroup)){
      this.http.patch(`http://127.0.0.1:8000/api/stage/${this.selectedStage.idStage}`, JSON.stringify(this.formGroup.value), {headers: this.headers})
      .subscribe({
        next: (res:any) => {
          this.MessageService.add({severity: 'success',summary: "Success", detail: res.message});
          this.formGroup.reset();
          this.isSubmitted = false;
          this.getStagesDeposes();
        },
        error: (err:any) => this.MessageService.add({severity: 'error',summary: "erreur", detail: err.error.message})
      });
    }
  }

  //delete function
  annuler(id : number){
    this.ConfirmationService.confirm({
      header: 'Êtes-vous sûr(e)',
      message: "Veuillez confirmer pour continuer",
      accept: () => {
        this.http.delete<any>(`http://127.0.0.1:8000/api/organisme/${id}`)
        .subscribe({
          next: (res:any) => {
            this.MessageService.add({severity: 'success',summary: "Success", detail: res.message});
            this.getStagesDeposes();
          },
          error: (err:any) => {
            this.MessageService.add({severity: 'error',summary: "erreur", detail: err.error.message});
          }
        });
      }
    })
  }

  // Check if any control in the form group has an error
  private hasErrors(fg: FormGroup): boolean {
    return Object.values(fg.controls).some(control => control.invalid);
  }
  // get stages par some etudiant
  getStagesDeposes(){
    // TODO: change the hard coded code (79)
    this.http.get(`http://127.0.0.1:8000/api/deposer/${this.loggeduser.idUser}`)
    .subscribe((data) => {
      this.stagesDeposes = data;
    })
  }

  // get organismes
  getOrganismesDeposes(){
    this.http.get("http://127.0.0.1:8000/api/organisme")
    .subscribe((data) => {
      this.organisationsDeposes = data;
    })
  }
  showDialogStage(stage: any){
    this.selectedStage = stage;
    this.visible_stage_view = true;
  }
  showDialogOrganisme(organisme: any){
    this.selectedOrganisme = organisme;
    this.visible_organisme_view = true;
  }

  showEditOrganisme(){
    let data = {
      nomOrganisme : this.selectedOrganisme.nomOrganisme,
      nomContact: this.selectedOrganisme.nomContact,
      prenomContact: this.selectedOrganisme.prenomContact,
      typeOrganisme: this.selectedOrganisme.typeOrganisme,
      telContact: this.selectedOrganisme.telContact,
      emailContact: this.selectedOrganisme.emailContact,
      ville: this.selectedOrganisme.adresse.ville,
      rue: this.selectedOrganisme.adresse.rue,
      region: this.selectedOrganisme.adresse.region
    }
    this.editOrganismeFormGroup.patchValue(data);
    this.visible_organisme_view = false;
    this.visible_organisme_edit = true;
  }

  showEditStage(){
    let data = {
      intitule : this.selectedStage.intitule,
      dateDebut: this.selectedStage.dateDebut,
      dateFin: this.selectedStage.dateFin,
      objectif: this.selectedStage.objectif,
      descriptif: this.selectedStage.descriptif,
      specialite: this.selectedStage.specialite,
    }
    this.editstageFormGroup.patchValue(data);
    this.visible_stage_view = false;
    this.visible_stage_edit = true;
  }

  editOrganisme(){
    if(!this.hasErrors(this.editOrganismeFormGroup)){
      this.http.patch(`http://127.0.0.1:8000/api/organisme/${this.selectedOrganisme.idOrganisme}`, JSON.stringify(this.editOrganismeFormGroup.value), {headers: this.headers})
      .subscribe({
        next: (res:any) => {
          this.MessageService.add({severity: 'success',summary: "succès", detail: res.error.message});
          this.formGroup.reset();
          this.isSubmitted = false;
          this.visible_organisme_edit = false;
          this.getStagesDeposes();
        },
        error: (err:any) => this.MessageService.add({severity: 'error',summary: "erreur", detail: err.error.message})
      })
    }
    //  this.isSubmitted = true;
    console.log("hahahah");
  }

  editStage(){
    if(!this.hasErrors(this.editstageFormGroup)){
      this.http.patch(`http://127.0.0.1:8000/api/stage/${this.selectedStage.idStage}`, JSON.stringify(this.editstageFormGroup.value), {headers: this.headers})
      .subscribe({
        next: (res:any) => {
          this.MessageService.add({severity: 'success',summary: "succès", detail:res.message});
          this.editstageFormGroup.reset();
          this.isSubmitted = false;
          this.visible_stage_edit = false;
          this.getStagesDeposes();
        },
        error: (err:any) => this.MessageService.add({severity: 'error',summary: "erreur", detail: err.error.message})
      })
    }
  }

  // form Validation

  formGroup: FormGroup = this.fb.group({
    //to changes
    idEtudiant: [this.fuckingID],

    intitule: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[^!@#$%^&*()_+\-=\[\]{};:"\\|,.<>\/?]+$/)]],
    dateDebut: ['', Validators.required],
    dateFin: ['', Validators.required],
    descriptif: ['', [ Validators.required]],
    objectif: ['', [Validators.required]],
    specialite: ['', [Validators.required, Validators.pattern(/^[^!@#$%^&*()_+\-=\[\]{};:"\\|,.<>\/?]+$/)]],

    nomOrganisme: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[^!@#$%^&*()_+\-=\[\]{};:"\\|,.<>\/?]+$/)]],
    nomContact: ['', Validators.required],
    prenomContact: ['', Validators.required],
    typeOrganisme: ['', [ Validators.required]],
    telContact: ['', [Validators.required, Validators.pattern(/^[^!@#$%^&*()_+\-=\[\]{};:"\\|,.<>\/?]+$/)]],
    emailContact: ['', Validators.required],
    ville: ['', Validators.required],
    rue: ['', Validators.required],
    region: ['', Validators.required]
  });

  // edit organisme form group
  editOrganismeFormGroup: FormGroup = this.fb.group({
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
  //edit stage form group
  editstageFormGroup: FormGroup = this.fb.group({
    intitule: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[^!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/)]],
    dateDebut: ['', Validators.required],
    dateFin: ['', Validators.required],
    objectif: ['', [Validators.required]],
    descriptif: ['', [ Validators.required]],
    specialite: ['', [Validators.required, Validators.pattern(/^[^!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/)]],
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
    }if(controlName === 'nbreStagaires' && isNaN(Number(control?.value)) && (control?.dirty || control?.touched || this.isSubmitted)) {
      return "Ce champ doit être un numéro";
    }
    return null;
  }

}
