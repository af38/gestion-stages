import { Component, OnInit, inject } from '@angular/core';
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
import { AccordionModule } from 'primeng/accordion';
import { NavBarComponent } from '../../components/admin-nav-bar/admin-nav-bar.component';


@Component({
  selector: 'app-stages',
  standalone: true,
  imports: [
    FormsModule,NavBarComponent,SidebarComponent,
    NgClass, NgxPaginationModule, FormsModule, AccordionModule,
    NgFor, ReactiveFormsModule, HttpClientModule,
    ConfirmDialogModule,DialogModule, ToastModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './stages.component.html',
  styles: ['.invalid{border-color:red}', '.error{color:red}']
})
export class StagesComponent implements OnInit {

  // cities list
  regions:any;
  villes: any;

  isOpen: boolean = true;
  idEnseignant:number = 0;
  isSubmitted: boolean = false;

  //pagination
  page: number = 1;
  totalLength: any;

  sidebarItems:any  = [];
  teachers:any = [];
  search_organisme:number = 0
  query: string = '';

  headers = new HttpHeaders().set('Content-Type', 'application/json');

  stages: any;
  acceptedStages:any;
  organisations: any;

  //services
  ConfirmationService: ConfirmationService = inject(ConfirmationService );
  MessageService :  MessageService = inject( MessageService);
  sidebarDataService: SidebarDataService = inject(SidebarDataService);

  // modal visibility
  visible_view: boolean = false;
  visible_edit: boolean = false;
  visible_affectation: boolean = false;

  selectedStage: any;
  selctedOrganisme: number = 0;
  selectedacceptedstage:any;

  //constructor
   constructor(private fb: FormBuilder, private http: HttpClient){
    this.sidebarItems = this.sidebarDataService.getSideBarData('resp', false, false);
  }
  //ngonit
  ngOnInit(){
    this.getAllStages();
    this.getAllOrganismes();
    this.getAllTeachers();
    this.getAcceptedStages();
  }

  //trim string
  trimText(str : string) : string{
    if(str.length>20){
      return str.substring(0,20) + '...';
    }
    return str;
  }

  // functions
  showAffectaionDialog(stage:any){
    this.selectedacceptedstage=stage;
    this.visible_affectation = true;
  }

  getAcceptedStages(){
    this.http.get("http://127.0.0.1:8000/api/deposee/accepted")
    .subscribe((data) => {
      this.acceptedStages = data;
    })
  }
  create(event : Event){
    event.preventDefault();
    console.log(this.formGroup.value);
    if(!this.hasErrors(this.formGroup)){
      this.http.post<any>("http://127.0.0.1:8000/api/stage", JSON.stringify(this.formGroup.value), {headers: this.headers})
      .subscribe({
        next: (res:any) => {
          this.getAllStages();
          this.MessageService.add({severity: 'success',summary: "succès", detail: res.message});
          this.formGroup.reset();
          this.visible_edit = false;
          this.isSubmitted = false;
        },
        error: (err:any) => this.MessageService.add({severity: 'error',summary: "erreur", detail: err.error.message})
      }
    )
    }
     this.isSubmitted = true;
  }

  edit(e:Event){
    e.preventDefault();
    console.log(JSON.stringify(this.editFormGroup.value));
    if(!this.hasErrors(this.editFormGroup)){
      this.http.patch(`http://127.0.0.1:8000/api/stage/${this.selectedStage.idStage}`, JSON.stringify(this.editFormGroup.value), {headers: this.headers})
      .subscribe({
        next: (res:any) => {
          this.getAllStages();
          this.MessageService.add({severity: 'success',summary: "succès", detail: res.message});
          this.formGroup.reset();
          this.isSubmitted = false;
          this.visible_edit = false;
        },
        error: (err:any) => this.MessageService.add({severity: 'error',summary: "erreur", detail: err.error.message})
      });
    }
  }
  private hasErrors(fg: FormGroup): boolean {
    // Check if any control in the form group has an error
    return Object.values(fg.controls).some(control => control.invalid);
  }
  // get stages
  getAllStages(){
    this.http.get(`http://127.0.0.1:8000/api/stagesNormale/search?query=${this.query}&organisme=${this.search_organisme}`)
    .subscribe((data) => {
      this.stages = data;
    })
  }

  // get organismes
  getAllOrganismes(){
    this.http.get("http://127.0.0.1:8000/api/organisme")
    .subscribe((data) => {
      this.organisations = data;
    })
  }

  //get teachers
  getAllTeachers(){
    this.http.get<any>("http://127.0.0.1:8000/api/enseignant", {headers: this.headers})
      .subscribe((data) => {
        this.teachers = data;
    })
  }

  affecter(){
    //to ba chanhed;
    let data = {
      idStage: this.selectedacceptedstage.idStage,
      idEnseignant: this.idEnseignant,
      students: [this.selectedacceptedstage.depose.idEtudiant]
    }
    console.log(data);

    this.http.post("http://127.0.0.1:8000/api/affectation", data, {headers: this.headers})
      .subscribe({
        next: (res:any) => {
          this.MessageService.add({severity: 'success',summary: "succès", detail: res.message});
          this.visible_affectation = false;
          this.getAcceptedStages();
        },
        error: (err:any) => {
          console.log(err);
          this.MessageService.add({severity: 'error',summary: "erreur", detail: err.error.message});}
      });
  }

  showDialogView(stage: any){
    this.selectedStage = stage;
    this.visible_view = true;
  }
  showDialogEdit(stage: any){
    this.selectedStage = stage;
    this.visible_edit = true;

    // set field values with selected stage data
    let data = {
      idOrganisme : this.selectedStage.idOrganisme,
      intitule : stage.intitule,
      dateDebut: stage.dateDebut,
      dateFin: stage.dateFin,
      descriptif: stage.descriptif,
      specialite: stage.specialite,
      nbreStagaires: stage.nbreStagaires,
      objectif: this.selectedStage.objectif

    }
    this.editFormGroup.patchValue(data);
  }

  deleteStage(id:number){
    this.ConfirmationService.confirm({
      header: 'Êtes-vous sûr(e)',
      message: "Veuillez confirmer pour continuer",
      accept: () => {
        this.http.delete(`http://127.0.0.1:8000/api/stage/${id}`)
        .subscribe({
          next: (res:any) => {
            this.MessageService.add({severity: 'success',summary: "succès", detail: res.message});
            this.getAllStages();
          },
          error: (err:any) => this.MessageService.add({severity: 'error',summary: "erreur", detail: err.error.message})
        });}
    })
  }

  // form Validation
  formGroup: FormGroup = this.fb.group({
    idOrganisme : [0, Validators.required],
    intitule: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[^!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/)]],
    dateDebut: ['', Validators.required],
    dateFin: ['', Validators.required],
    descriptif: ['', [ Validators.required]],
    objectif: ['', [Validators.required]],
    specialite: ['', [Validators.required, Validators.pattern(/^[^!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/)]],
    nbreStagaires: ['', Validators.required]
  });

  // form Validation
  editFormGroup: FormGroup = this.fb.group({
    idOrganisme : [0, Validators.required],
    intitule: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[^!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/)]],
    dateDebut: ['', Validators.required],
    dateFin: ['', Validators.required],
    descriptif: ['', [ Validators.required]],
    objectif: ['', [Validators.required]],
    specialite: ['', [Validators.required, Validators.pattern(/^[^!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/)]],
    nbreStagaires: ['', Validators.required]
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
