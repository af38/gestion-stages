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
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';
import { NavBarComponent } from '../../components/admin-nav-bar/admin-nav-bar.component';

@Component({
  selector: 'app-commission',
  standalone: true,
  imports: [FormsModule, HttpClientModule,ReactiveFormsModule, DialogModule, ConfirmDialogModule,ToastModule, SidebarComponent, NavBarComponent, NgClass, NgxPaginationModule, NgFor, ButtonModule, AccordionModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './commission.component.html',
  styles: ['.invalid{border-color:red}', '.error{color:red}']
})
export class commissionComponent {

  //http header
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  //services
  ConfirmationService: ConfirmationService = inject(ConfirmationService );
  MessageService :  MessageService = inject( MessageService);
  sidebarDataService: SidebarDataService = inject(SidebarDataService);

  // modal visibility
  visible_view: boolean = false;
  visible_edit: boolean = false;

  isOpen:boolean = true;
  isSubmitted:boolean = false;
  sidebarItems: any = [];
  commissions: any = [];
  selectedCommission: any;
  query:string = '';


  //pagination
  page: number = 1;
  totalLength: any;

  //constructor
  constructor(private fb: FormBuilder, private http: HttpClient){
    this.sidebarItems = this.sidebarDataService.getSideBarData('resp', false, false);
  }
  //ngonit
  ngOnInit(){
    this.getAllCommissions();
  }
  // get commissions
  getAllCommissions(){
    if(this.query !== ''){
      this.http.get<any>(`http://127.0.0.1:8000/api/commission/search/${this.query}`, {headers: this.headers})
      .subscribe((data) => {
        this.commissions = data;
      })
    }else{
      this.http.get<any>('http://127.0.0.1:8000/api/commission', {headers: this.headers})
      .subscribe((data) => {
        this.commissions = data;
      })
    }
  }
  showDialogView(commission: any){
    this.selectedCommission = commission;
    this.visible_view = true;
  }
  showDialogEdit(commission: any){
    this.selectedCommission = commission;
    this.visible_edit = true;

    // set field values with selected organisme data
    let data = {
      filiere : commission.filiere,
      dateFin: commission.dateFin
    }
    this.editFormGroup.patchValue(data);
  }

  // Check if any control in the form group has an error
  private hasErrors(): boolean {
    return Object.values(this.formGroup.controls).some(control => control.invalid);
  }

  //create function
  create(event : Event){
    event.preventDefault();
    if(!this.hasErrors()){
      this.http.post<any>("http://127.0.0.1:8000/api/commission", JSON.stringify(this.formGroup.value), {headers: this.headers})
      .subscribe({
        next: (res:any) => {
          this.MessageService.add({severity: 'success',summary: "succès", detail: res.message});
          this.formGroup.reset();
          this.isSubmitted = false;
          this.getAllCommissions();
        },
        error: (err:any) => {
          this.MessageService.add({severity: 'error',summary: "erreur", detail: err.error.message});
        }
      })
    }
     this.isSubmitted = true;
  }

  //edit function
  edit(e: Event){
    e.preventDefault();
    this.http.patch(`http://127.0.0.1:8000/api/commission/${this.selectedCommission.idCommission}`, JSON.stringify(this.editFormGroup.value), {headers: this.headers})
    .subscribe({
      next: (res:any) => {
        this.MessageService.add({severity: 'success', summary: "succès", detail: res.message});
        this.formGroup.reset();
        this.isSubmitted = false;
        this.visible_edit = false;
        this.getAllCommissions();
      },
      error: (err:any) => this.MessageService.add({severity: 'error',summary: "erreur", detail: err.error.message})
    }
  )
  }

  //delete function
  delete(commission : any){
    this.ConfirmationService.confirm({
      header: 'Êtes-vous sûr(e)',
      message: "Veuillez confirmer pour continuer",
      accept: () => {
        this.http.delete(`http://127.0.0.1:8000/api/commission/${commission.idCommission}`)
        .subscribe({
          next: (res:any) => {
            this.MessageService.add({severity: 'success',summary: "succès", detail: res.message});
            this.getAllCommissions();
          },
          error: (err:any) => this.MessageService.add({severity: 'error', summary: "erreur", detail: err.error.message})
        });
      }
    })
  }

  // form Validation
  formGroup: FormGroup = this.fb.group({
    filiere: ['', [Validators.required, Validators.pattern(/^[^!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/)]],
    dateFin: ['', Validators.required],
  });

  editFormGroup: FormGroup = this.fb.group({
    filiere: ['', [Validators.required, Validators.pattern(/^[^!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/)]],
    dateFin: ['', Validators.required],
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
    }if(controlName === 'datefin' && isNaN(Number(control?.value)) && (control?.dirty || control?.touched || this.isSubmitted)) {
      return "Ce champ doit être contenir seluement des nombres";
    }
    return null;
  }

}
