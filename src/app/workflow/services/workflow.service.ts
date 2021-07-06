import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Workflow } from 'src/app/models/workflow';
import {  Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { WorkflowInfo } from 'src/app/models/workflow-info';

@Injectable({
  providedIn: 'root'
})
export class WorkflowService {
  private url="http://localhost:8752";
  private httpHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa('admin:password')

    })
  }  
  constructor(private http: HttpClient) { }
  save(workflow: Workflow): any {
    return this.http.post<Workflow>(this.url+"/message", JSON.stringify(workflow),this.httpHeader).subscribe(data => {
      console.info(this.url+"/message=> response : "+data);
    });
  }
  getAll(): Observable<Workflow[]> {
    return this.http.get<Workflow[]>(this.url + '/api/workflow-list')
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
