import { Component, inject} from '@angular/core';

import { NgIf } from '@angular/common';
import { StudentCrudTableComponent } from '../../components/crud-accounts-components/student-crud-table/student-crud-table.component';
import { TeacherCrudTableComponent } from '../../components/crud-accounts-components/teacher-crud-table/teacher-crud-table.component';
import { RespCrudTableComponent } from '../../components/crud-accounts-components/resp-crud-table/resp-crud-table.component';
import { NavBarComponent } from '../../components/admin-nav-bar/admin-nav-bar.component';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-accounts-crud',
  standalone: true,
  imports: [
    FormsModule,
    NgIf, StudentCrudTableComponent,
    TeacherCrudTableComponent,
    RespCrudTableComponent,
    NavBarComponent, NgClass],

  templateUrl: './accounts-crud.component.html',
})
export class AccountsCrudComponent {
  tabelType = "student";
  isOpen: boolean = true;

// constructor
constructor(){
}
}
