import { Component, OnInit } from '@angular/core';
import { WorkflowInfo } from '../models/workflow-info';
import { WorkflowService } from './services/workflow.service';

@Component({
  selector: 'workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.css']
})
export class WorkflowComponent implements OnInit {

  public workflowInfoes: WorkflowInfo[] = [];
  
  constructor(public workflowService: WorkflowService) { }
  
  ngOnInit(): void {
    this.workflowService.getAll().subscribe((data: WorkflowInfo[])=>{
      this.workflowInfoes = data;
      console.log(this.workflowInfoes);
    })  
  }

}
