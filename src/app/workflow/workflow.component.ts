import { Component, OnInit } from '@angular/core';
import { WorkflowInfo } from '../models/workflow-info';
import { WorkflowService } from './services/workflow.service';
import { DataService } from './services/data.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Workflow } from '../models/workflow';

@Component({
  selector: 'workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.css']
})
export class WorkflowComponent implements OnInit {

  public workflows: Workflow[] = [];
  private subscription: Subscription;
  constructor(
    private workflowService: WorkflowService,
    private data: DataService,
    private router: Router) { }
  
  ngOnInit(): void {
    this.workflowService.getAll().subscribe((data: Workflow[])=>{
      this.workflows = data;
      console.log(this.workflows);
    });
    this.subscription = this.data.currentMessage.subscribe(); 
  }
  
  redirect(xml:string,navigation:string[]):void{
    console.log(xml);
    this.data.changeMessage(xml);
    this.router.navigate(navigation);
  }

}
