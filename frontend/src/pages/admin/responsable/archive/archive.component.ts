import { Component, OnInit, inject } from '@angular/core';
import { NgClass, NgFor } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';


import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators , FormsModule} from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

import { ChipsModule } from 'primeng/chips';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SidebarDataService } from '../../../../services/sidebar-data.service';
import { AccordionModule } from 'primeng/accordion';
import { NavBarComponent } from '../../components/admin-nav-bar/admin-nav-bar.component';

@Component({
  selector: 'app-archive',
  standalone: true,
  imports: [
    FormsModule, AccordionModule,
    DialogModule, ConfirmDialogModule,
    ToastModule, ReactiveFormsModule,
    HttpClientModule,FormsModule,
    NavBarComponent, ChipsModule
    , SidebarComponent
    ,NgClass, NgFor, NgxPaginationModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './archive.component.html',
  styleUrl: './archive.component.css',
  styles: ['.invalid{border-color:red}', '.error{color:red}']
})
export class ArchiveComponent implements OnInit {

  //services
  ConfirmationService: ConfirmationService = inject(ConfirmationService );
  MessageService :  MessageService = inject( MessageService);
  sidebarDataService: SidebarDataService = inject(SidebarDataService);

  isOpen: boolean = true;
  years: number[] = [];
  query:string = '';
  keyword:string = '';

  sidebarItems  = [];

  ngOnInit(): void {
      this.populateYears();
      this.getAllRapports();
  }

  populateYears(){
    const currentYear = new Date().getFullYear();
    for(let year = currentYear - 1; year >= 1900; year--){
      this.years.push(year);
    }
  }

  //trim string
  trimText(str : string) : string{
    if(str.length>20){
      return str.substring(0,20) + '...';
    }
    return str;
  }


  rapports:any;

  //pagination
  page: number = 1;
  totalLength: any;

  isSubmitted:boolean = false;

  // modal visibility
  visible_edit: boolean = false;

  selectedRapport: any;

  headers = new HttpHeaders().set('Content-Type', 'application/json');


  //constructor
  constructor(private fb: FormBuilder, private http: HttpClient){
    this.sidebarItems = this.sidebarDataService.getSideBarData('resp', false, false);
  }

  //get all rapports
  getAllRapports(){
    this.http.get<any>(`http://127.0.0.1:8000/api/rapportes/search?query=${this.query}&keyword=${this.keyword}`, {headers: this.headers})
    .subscribe((data) => {
      this.rapports = data;
    })
  }

  //edit function
  showDialogEdit(rapport: any){
    this.selectedRapport = rapport;

    // set field values with selected rapport data
    let data = {
      titre : rapport.titre,
      filiere: rapport.filiere,
      specialite: rapport.specialite,
      annee: rapport.annee,
      lien: rapport.lien,
      keywords: rapport.motclesList
    }

    this.editFormGroup.patchValue(data);
    this.visible_edit = true;

  }

  //hasError function
  private editHasErrors(): boolean {
    // Check if any control in the form group has an error
    return Object.values(this.editFormGroup.controls).some(control => control.invalid);
  }
  private createHasErrors(): boolean {
    // Check if any control in the form group has an error
    return Object.values(this.formGroup.controls).some(control => control.invalid);
  }

  // create form group
  formGroup: FormGroup = this.fb.group({
    titre: ['', [Validators.required, Validators.pattern(/^[^!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/)]],
    filiere: ['', Validators.required],
    specialite: ['', Validators.required],
    annee: ['', [ Validators.required]],
    lien: ['', Validators.required],
    keywords: ['', Validators.required]
  });

  // edit form group
  editFormGroup: FormGroup = this.fb.group({
    titre: ['', [Validators.required, Validators.pattern(/^[^!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/)]],
    filiere: ['', Validators.required],
    specialite: ['', Validators.required],
    annee: ['', [ Validators.required]],
    lien: ['', Validators.required],
    keywords: ['', Validators.required]
  });

  create(event : Event){
    event.preventDefault();
    console.log(this.formGroup.value)
    if(!this.createHasErrors()){
      this.http.post<any>("http://127.0.0.1:8000/api/rapport", JSON.stringify(this.formGroup.value), {headers: this.headers})
      .subscribe({
        next: (res:any) => {
          this.MessageService.add({severity: 'success',summary: "succès", detail: res.message});
          this.formGroup.reset();
          this.isSubmitted = false;
          this.getAllRapports();
        },
        error: (err:any) => this.MessageService.add({severity: 'error',summary: "erreur", detail: err.error.message})
      })
    }
    this.isSubmitted = true;
    console.log(this.formGroup.value);
  }

  edit(event : Event){
    event.preventDefault();
    if(!this.editHasErrors()){
      this.http.patch(`http://127.0.0.1:8000/api/rapport/${this.selectedRapport.idRapport}`, JSON.stringify(this.editFormGroup.value), {headers: this.headers})
        .subscribe({
          next: (res:any) => {
                this.MessageService.add({severity: 'success',summary: "succès", detail: res.message});
                this.formGroup.reset();
                this.isSubmitted = false;
                this.visible_edit = false;
                this.getAllRapports();
            },
          error: (err: any) => this.MessageService.add({severity: 'error',summary: "erreur", detail: err.error.message})
        });
    }
  }

  //delete function
  delete(rapport : any){
    this.ConfirmationService.confirm({
      header: 'Êtes-vous sûr(e)',
      message: "Veuillez confirmer pour continuer",
      accept: () => {
        this.http.delete(`http://127.0.0.1:8000/api/rapport/${rapport.idRapport}`)
        .subscribe({
          next: (res:any) => {
            this.MessageService.add({severity: 'success',summary: "succès", detail: res.message});
            this.getAllRapports();
          },
          error: (err:any) => this.MessageService.add({severity: 'error',summary: "erreur", detail: err.error.message})
        });}})
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
      }
      return null;
  }

}
