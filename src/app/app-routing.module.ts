import { NgModule } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';
import { ModelerComponent } from './workflow/modeler/modeler.component';
import { WorkflowComponent } from './workflow/workflow.component';

const routes: Routes=[
  {path:'workflow-list', component:WorkflowComponent},
  {path:'Workflow-designer',component: ModelerComponent},
  //{path: '', redirectTo: 'workflow-list', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports:[
    RouterModule
  ]
})
export class AppRoutingModule { }
