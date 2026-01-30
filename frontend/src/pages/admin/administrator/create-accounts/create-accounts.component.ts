import { AccountsCrudComponent } from './../accounts-crud/accounts-crud.component';
import { AccordionModule } from 'primeng/accordion';
import { Component, inject } from '@angular/core';
import { TeacherFormComponent } from '../../components/form-components/teacher-form/teacher-form.component';
import { StudentFormComponent } from '../../components/form-components/student-form/student-form.component';
import { RespFormComponent } from '../../components/form-components/resp-form/resp-form.component';
import { FormsModule } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { NavBarComponent } from '../../components/admin-nav-bar/admin-nav-bar.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { SidebarDataService } from '../../../../services/sidebar-data.service';



@Component({
  selector: 'app-create-accounts',
  standalone: true,
  imports: [
    AccordionModule,
    SidebarComponent,
    TeacherFormComponent,
    StudentFormComponent,
    RespFormComponent,
    FormsModule, NgIf,
    NavBarComponent,
    NgClass, AccountsCrudComponent
  ],
  templateUrl: './create-accounts.component.html',
  styleUrl: './create-accounts.component.css',
})

export class CreateAccountsComponent {
  role = "student";
  isOpen: boolean = true;
  sidebarItems  = [];

sidebarDataService: SidebarDataService = inject(SidebarDataService);
// constructor
constructor(){
  this.sidebarItems = this.sidebarDataService.getSideBarData('admin', false, false);
}


}
