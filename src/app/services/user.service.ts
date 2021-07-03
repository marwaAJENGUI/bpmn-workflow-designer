import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Workflow } from 'src/app/models/workflow';
import {  Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from 'src/app/models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url="http://localhost:8770";
  private httpHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa('admin:password')

    })
  }  
  constructor(private http: HttpClient) { }
 
  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.url + '/users/')
    .pipe(
      catchError(this.errorHandler)
    )
  }
  getUser(id:number): Observable<User> {
    return this.http.get<User>(this.url + '/users/'+id)
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
