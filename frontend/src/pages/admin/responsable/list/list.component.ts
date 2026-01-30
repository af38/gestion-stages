import { StudentsTableComponent } from './../../components/tables/students-table/students-table.component';
import { NgClass, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TeachersTableComponent } from '../../components/tables/teachers-table/teachers-table.component';
import { SidebarDataService } from '../../../../services/sidebar-data.service';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { NavBarComponent } from '../../components/admin-nav-bar/admin-nav-bar.component';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [SidebarComponent, NavBarComponent ,NgClass,FormsModule,ToastModule, ConfirmDialogModule , NgIf, TeachersTableComponent, StudentsTableComponent],
  templateUrl: './list.component.html'
})
export class ListComponent {
  listType: string = 'students';
  isOpen: boolean = true;
  sidebarItems: any = [];

  sidebarDataService: SidebarDataService = inject(SidebarDataService);

  // constructor
  constructor(){
    this.sidebarItems = this.sidebarDataService.getSideBarData('resp', false, false);
  }

}
