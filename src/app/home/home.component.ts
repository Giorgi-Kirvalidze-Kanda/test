import {Component, OnInit, signal} from '@angular/core';
import {FhirService} from '../fhir.service';
import {Practitioner} from '../practitioner.model';
import {EpicApiService} from '../epic-api.service';
import {firstValueFrom} from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  accessToken = signal<string | null>(null);
  isLoggingIn = signal(false);
  isPractitionerLoading = signal(false);
  currentPractitioner = signal<Practitioner | null>(null);

  constructor(private _fhirService: FhirService, private _epiApiService: EpicApiService) {
  }

  async ngOnInit() {
    if (this.#hasAuthorizationCode()) {
      const code = this.#getAuthorizationCode();
      if (code) {
        await this.#exchangeAndValidateCodeForToken(code);
        this.#clearAuthorizationCodeFromUrl();
      }
    }
  }

  #hasAuthorizationCode(): boolean {
    return window.location.search.includes('code=');
  }

  #getAuthorizationCode(): string | null {
    return new URLSearchParams(window.location.search).get('code');
  }

  #clearAuthorizationCodeFromUrl(): void {
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  async launchSmartLogin() {
    this.isLoggingIn.set(true);
    try {
      await this._fhirService.authorizeFhirClient();
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      this.isLoggingIn.set(false);
    }
  }

  async #exchangeAndValidateCodeForToken(code: string) {
    this.isLoggingIn.set(true);
    try {
      const response = await firstValueFrom(this._epiApiService.exchangeAndValidateCodeForToken(code));
      await this._fhirService.initFhirClient(response);
      this.accessToken.set(this._fhirService.getAccessToken());
      console.log('Access token received:', response);
    } catch (error) {
      console.error('Error during token exchange:', error);
    } finally {
      this.isLoggingIn.set(false);
    }
  }

  async getCurrentlyLoggedInPractitioner() {
    this.isPractitionerLoading.set(true);
    try {
      const practitioner = await this._fhirService.getCurrentPractitioner();
      this.currentPractitioner.set(practitioner);
      console.log('Current practitioner data:', practitioner);
    } catch (error) {
      console.error('Error loading practitioner data:', error);
    } finally {
      this.isPractitionerLoading.set(false);
    }
  }
}
