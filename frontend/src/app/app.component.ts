import { LoaderComponent } from './../pages/admin/components/loader/loader.component';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SpinnerService } from '../services/spinner.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'gestion-stages';

  private spinnerSrv = inject(SpinnerService);
  isLoading = this.spinnerSrv.isLoading;
}
