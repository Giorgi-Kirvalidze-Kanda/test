import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PostCodeExchangeDtoResponse} from './post-code-exchange-response.dto';

@Injectable({
  providedIn: 'root'
})
export class EpicApiService {

  constructor(private _http: HttpClient) {
  }

  exchangeAndValidateCodeForToken(code: string) {
    if (!code) {
      throw new Error("Code is missing");
    }
    return this._http.post<PostCodeExchangeDtoResponse>('http://localhost:5005/oauth/token', {
      code,
      client_id: 'example-client'
    });
  }

}
