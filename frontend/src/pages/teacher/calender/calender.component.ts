import { Component, OnInit, inject } from '@angular/core';
import { SidebarComponent } from '../../admin/components/sidebar/sidebar.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import { CalendarOptions } from '@fullcalendar/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SidebarDataService } from '../../../services/sidebar-data.service';
import { FormsModule } from '@angular/forms';
import { NgClass, CommonModule } from '@angular/common';
import { NavBarComponent } from '../../admin/components/admin-nav-bar/admin-nav-bar.component';

interface Session {
  idSeance: number;
  idEnseignant: number;
  idEtudiant: number;
  dateSeance: string;
  heureSeance: string;
  nom: string;
  prenom: string;
}

interface E{
  title: string,
  date: string
}

@Component({
  selector: 'app-calender',
  standalone: true,
  providers: [SidebarDataService],
  imports: [SidebarComponent, NavBarComponent,CommonModule, FullCalendarModule, HttpClientModule, FormsModule, NgClass],
  templateUrl: './calender.component.html'
})
export class CalenderComponent implements OnInit{

  //services
  sidebarDataService: SidebarDataService = inject(SidebarDataService);

  //sidebar toggle
  isOpen:boolean = true;

  //sidebar
  sidebarItems:any = [];

  seances:any = [];
  loggeduser:any;
  isMember:boolean = false;

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    events: []
  };

  ngOnInit(){
    this.getUser();
    this.isMemberfun();
    this.getSeances();
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

  getSeances(){
    // 76 to be changed
    this.http.get(`http://127.0.0.1:8000/api/teacher/seances/${this.loggeduser.idUser}`)
    .subscribe((data) => {
      this.seances = data;
      this.setCalendarEvents(data);
    })
  }

  isMemberfun() : void{
    // 76 to be changed
    this.http.get(`http://127.0.0.1:8000/api/enseignant/isMember/${this.loggeduser.idUser}`)
    .subscribe((data:any) => {
      this.isMember = data.status;
      this.sidebarItems = this.sidebarDataService.getSideBarData('teacher', false, this.isMember);
    })
  }

  setCalendarEvents(data: any) {
    const events = data.map((e: Session) => ({
      date: e.dateSeance,
      title: `${e.nom} ${e.prenom} ${e.heureSeance}`
    }));
    console.log(events);
    // clander
    this.calendarOptions = {
      initialView: 'dayGridMonth',
      plugins: [dayGridPlugin],
      events: events
    };
  }

  //constructor

  constructor(private http: HttpClient, ){
  }


}
