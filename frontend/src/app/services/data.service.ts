import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Profile } from '../models/Profile';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private apiUrl = 'http://localhost:3333/data/';

  constructor(private http: HttpClient) { }

  getData() : Observable<Profile[]> {
    return this.http.get<Profile[]>(this.apiUrl);
  }

  getProfileData(username: string) : Observable<Profile[]> {
    return this.http.get<Profile[]>(this.apiUrl + username);
  }

  getFollowersHistory(username: string) : Observable<Profile[]> {
    return this.http.get<Profile[]>(this.apiUrl + username + '/followers/' );
  }

  getFollowingHistory(username: string) : Observable<Profile[]> {
    return this.http.get<Profile[]>(this.apiUrl + username + '/following/' );
  }

  getFollowerRatioHistory(username: string) : Observable<Profile[]> {
    return this.http.get<Profile[]>(this.apiUrl + username + '/follower-ratio/' );
  }
  
}
