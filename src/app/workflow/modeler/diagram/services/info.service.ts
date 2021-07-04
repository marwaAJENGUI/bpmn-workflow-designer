import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Info } from 'src/app/models/info';

@Injectable({
  providedIn: 'root'
})
export class InfoService {
  private url="http://localhost:8770/infoes";
  private httpHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa('admin:password')

    })
  }  
  constructor(private http: HttpClient) { }

  getClasses(): Observable<Info[]> {
    return this.http.get<Info[]>(this.url + '/java-classes')
    .pipe(
      catchError(this.errorHandler)
    )
  }
  getExpressions(): Observable<Info[]> {
    return this.http.get<Info[]>(this.url + '/expressions')
    .pipe(
      catchError(this.errorHandler)
    )
  }
     
  private errorHandler(error) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
 }
}
