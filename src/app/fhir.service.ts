import {Injectable} from '@angular/core';
import FHIR from 'fhirclient';
import Client from 'fhirclient/lib/Client';
import {Practitioner} from './practitioner.model';

@Injectable({
  providedIn: 'root'
})
export class FhirService {
  private _client: Client | null = null;

  async authorizeFhirClient() {
    const options = {
      clientId: 'example-client',         // Replace with client ID
      redirectUri: 'http://localhost:4200/',   // Replace with redirect URI
      iss: 'https://r2.smarthealthit.org',              // Replace with FHIR server issuer URL
      scope: 'launch openid fhirUser user/*.read'    // Define the necessary scopes
    };
    await FHIR.oauth2.authorize(options);
  }

  async initFhirClientAfterRedirect() {
    this._client = await FHIR.oauth2.ready();
    return this._client;
  }

  getAccessToken(): string | null {
    if (this._client) {
      const tokenResponse = this._client.state.tokenResponse;
      return tokenResponse?.access_token || null;
    }
    return null;
  }

  async getCurrentPractitioner(): Promise<Practitioner> {
    if (!this._client) {
      throw new Error("FHIR client is not initialized.");
    }

    const practitionerId = this._client.user.id;

    if (!practitionerId) {
      throw new Error("Practitioner ID is not available in the client state.");
    }

    return await this._client.request<Practitioner>(`Practitioner/${practitionerId}`);
  }
}
