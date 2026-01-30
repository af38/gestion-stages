import { LoginComponent } from './../pages/login/login.component';
import { StudentHomeComponent } from './../pages/student/student-home/student-home.component';
import { ListComponent } from './../pages/admin/responsable/list/list.component';
import { Routes } from '@angular/router';
import { CreateAccountsComponent } from '../pages/admin/administrator/create-accounts/create-accounts.component';
import { AccountsCrudComponent } from '../pages/admin/administrator/accounts-crud/accounts-crud.component';
import { ParametrageComponent } from '../pages/admin/administrator/parametrage/parametrage.component';
import { AffectationComponent } from '../pages/admin/responsable/affectation/affectation.component';
import { DataManagementComponent } from '../pages/admin/administrator/data-management/data-management.component';
import { ReclamationsComponent } from '../pages/admin/responsable/reclamations/reclamations.component';
import { ArchiveComponent } from '../pages/admin/responsable/archive/archive.component';
import { StagesComponent } from '../pages/admin/responsable/stages/stages.component';
import { OrganisationComponent } from '../pages/admin/responsable/organisation/organisation.component';
import { TeacherHomeComponent } from '../pages/teacher/teacher-home/teacher-home.component';
import { StagesProposesComponent } from '../pages/teacher/stages-proposes/stages-proposes.component';
import { TeacherReclamationsComponent } from '../pages/teacher/teacher-reclamations/teacher-reclamations.component';
import { commissionComponent } from '../pages/admin/responsable/commision/commision.component';
import { DeposerComponent } from '../pages/student/deposer/deposer.component';
import { StudentArchiveRapportsComponent } from '../pages/student/student-archive-rapports/student-archive-rapports.component';
import { CalenderComponent } from '../pages/teacher/calender/calender.component';
import { UnoComponent } from '../pages/uno/uno.component';
import { authGuard } from '../services/auth.guard';


export const routes: Routes = [
    {path: 'create-accounts', title: 'create-accounts', component: CreateAccountsComponent, canActivate: [authGuard], data: { expectedRole: 'admin' }},
    {path : 'manage-accounts', title: 'manage-accounts', component: AccountsCrudComponent, canActivate: [authGuard], data: { expectedRole: 'admin' }},
    {path : 'parametrage' , title: 'parametrage', component: ParametrageComponent, canActivate: [authGuard], data: { expectedRole: 'admin' }},
    {path: 'gere-donnes', title : 'gere-donnes', component: DataManagementComponent, canActivate: [authGuard], data: { expectedRole: 'admin' }},

    {path: 'affectation', title : '', component: AffectationComponent, canActivate: [authGuard], data: { expectedRole: 'resp' }},
    {path: 'archive-rapports', title : 'archive-rapports', component: ArchiveComponent, canActivate: [authGuard], data: { expectedRole: 'resp' }},
    {path: 'stages', title : 'stages', component: StagesComponent, canActivate: [authGuard], data: { expectedRole: 'resp' }},
    {path: 'organisations', title : 'organisations', component: OrganisationComponent, canActivate: [authGuard], data: { expectedRole: 'resp' }},
    {path: 'reclamations', title : 'reclamations', component: ReclamationsComponent, canActivate: [authGuard], data: { expectedRole: 'resp' }},
    {path:'lists', title : 'lists', component: ListComponent, canActivate: [authGuard], data: { expectedRole: 'resp' }},
    {path: 'commissions', title : 'commissions', component: commissionComponent, canActivate: [authGuard], data: { expectedRole: 'resp' }},

    {path: 'teacher-home', title : "page d'acueil", component: TeacherHomeComponent, canActivate: [authGuard], data: { expectedRole: 'teacher' }},
    {path: 'stages-deposes', title : 'stages-deposes', component: StagesProposesComponent, canActivate: [authGuard], data: { expectedRole: 'teacher' }},
    {path: 'teacher-reclamations', title : 'reclamations', component: TeacherReclamationsComponent, canActivate: [authGuard], data: { expectedRole: 'teacher' }},

    {path: 'deposer-stage', title : 'deposer0stage', component: DeposerComponent, canActivate: [authGuard], data: { expectedRole: 'student' }},
    {path:'rapports', title : 'rapports', component: StudentArchiveRapportsComponent, canActivate: [authGuard], data: { expectedRole: 'student' }},
    {path:'student-home', title : 'student-home', component: StudentHomeComponent, canActivate: [authGuard], data: { expectedRole: 'student' }},
    {path:'calendrier', title : 'calendrier', component: CalenderComponent, canActivate: [authGuard], data: { expectedRole: 'teacher' }},

    {path:'login', title : 'login', component: LoginComponent},
    {path:'missing', title : 'Non autorisé', component: UnoComponent},
    { path: '',   redirectTo: '/login', pathMatch: 'full' },
    {path:'**', title : 'page non trouvee', component: UnoComponent}



];
