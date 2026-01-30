import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { CommonModule} from '@angular/common';
import { Component, inject } from '@angular/core';
import { SidebarComponent } from '../../admin/components/sidebar/sidebar.component';
import { DialogModule } from 'primeng/dialog';
import { NgxPaginationModule } from 'ngx-pagination';
import { SidebarDataService } from '../../../services/sidebar-data.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { FormsModule } from '@angular/forms';
import { NavBarComponent } from '../../admin/components/admin-nav-bar/admin-nav-bar.component';

@Component({
  selector: 'app-teacher-reclamations',
  standalone: true,
  providers: [MessageService, ConfirmationService],
  imports: [ToastModule,CommonModule, ConfirmDialogModule,TagModule, SidebarComponent, FormsModule, NavBarComponent,DialogModule, NgxPaginationModule, HttpClientModule, ButtonModule],
  templateUrl: './teacher-reclamations.component.html'
})
export class TeacherReclamationsComponent {

  // side bar open variables
  isOpen: boolean = true;

  reclamations:any = [];
  query:string = '';
  etat:string = '';
  isMember:boolean = false;

  // pagination
  page: number = 1;
  totalLength: any;

  sidebarItems  = [];
  //services
  sidebarDataService: SidebarDataService = inject(SidebarDataService);
  ConfirmationService: ConfirmationService = inject(ConfirmationService );
  MessageService :  MessageService = inject( MessageService);

  //constructor
  loggeduser:any;
  constructor(private http: HttpClient){
  }

  getReclamations(){
    // 80 to changed
    this.http.get<any>(`http://127.0.0.1:8000/api/reclmationsByEns/${this.loggeduser.idUser}`).subscribe(
      res => {
        this.reclamations = res;
      }
    )
  }

  getUser(){
    if(localStorage){
      const storedUser = localStorage.getItem('user');
      this.loggeduser = storedUser ? JSON.parse(storedUser) : null;
    }else{
      console.log('loclastorhs')
    }
    console.log(this.loggeduser);
  }

  isMemberfun() : void{
    // 76 to be changed
    this.http.get(`http://127.0.0.1:8000/api/enseignant/isMember/${this.loggeduser.idUser}`)
    .subscribe((data:any) => {
      this.isMember = data.status;
      this.sidebarItems = this.sidebarDataService.getSideBarData('teacher', false, this.isMember);
    })
  }

  cancel(id: number){
    this.ConfirmationService.confirm({
      header: 'Êtes-vous sûr(e)',
      message: "Veuillez confirmer pour continuer",
      accept: () => {
        this.http.delete(`http://127.0.0.1:8000/api/reclamation/${id}`)
        .subscribe({
          next: (res:any) => {
            this.MessageService.add({severity: 'success',summary: "succès", detail: res.message});
            this.getReclamations();
          },
          error: (err:any) => this.MessageService.add({severity: 'error',summary: "erreur", detail: err.error.message})
    });}})

  }

  //ngOnInit function
  ngOnInit(){
    this.getUser();
    this.isMemberfun();
    this.getReclamations();
  }
}
