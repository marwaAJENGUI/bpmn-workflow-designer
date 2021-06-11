import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Workflow } from 'src/app/models/workflow';

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
    return this.http.post<Workflow>(this.url+"/api/message", JSON.stringify(workflow),this.httpHeader).subscribe(data => {
      console.info(data);
    });
  }
}
