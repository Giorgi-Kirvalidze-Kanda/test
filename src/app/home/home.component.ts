import {Component, OnInit, signal} from '@angular/core';
import {FhirService} from '../fhir.service';
import {Practitioner} from '../practitioner.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  accessToken = signal<string | null>(null);
  isLoading = signal(false);
  currentPractitioner = signal<Practitioner | null>(null);

  constructor(private _fhirService: FhirService) {
  }

  async ngOnInit() {
    // Check if we're returning from the authorization server
    if (window.location.search.includes('code') || window.location.search.includes('state')) {
      // Complete the OAuth2 process
      const client = await this._fhirService.initFhirClientAfterRedirect();
      this.accessToken.set(this._fhirService.getAccessToken());
      this.isLoading.set(true)
      this.currentPractitioner.set(await this._fhirService.getCurrentPractitioner());
    } else {
      // Start the SMART launch process
      await this._fhirService.authorizeFhirClient();
    }
    this.isLoading.set(false)

  }
}
