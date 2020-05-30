import { Injectable } from '@angular/core';
import { LEADERS } from '../shared/leaders'
import { Leader } from '../shared/leader'
import { of, Observable } from 'rxjs';
import {delay, map, catchError} from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { ProcessHTTPMsgService } from './process-httpmsg.service'


@Injectable({
  providedIn: 'root'
})
export class LeadersService {

  constructor(private http: HttpClient,
    private processHTTPMsgService: ProcessHTTPMsgService) { }

  getLeaders(): Observable<Leader[]>{
    return this.http.get<Leader[]>(baseURL + 'leadership')
    .pipe(catchError(this.processHTTPMsgService.handleError))
  }

  getLeader(id: string): Observable<Leader>{
    return this.http.get<Leader>(baseURL + 'leadership/' + id)
    .pipe(catchError(this.processHTTPMsgService.handleError))
  }

  getFeaturedLeader(): Observable<Leader>{
    return this.http.get<Leader[]>(baseURL + "leadership?featured=true")
    .pipe(map(leader => leader[0]))
    .pipe(catchError(error => error));
  }

  getLeaderIds(): Observable<string[] | any> {
    return this.getLeaders().pipe(map(leaders => leaders.map(leader => leader.id)))
    .pipe(catchError(error => error));
  }
}
