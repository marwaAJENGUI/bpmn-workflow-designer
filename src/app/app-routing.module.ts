import { NgModule } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';
import { ModelerComponent } from './workflow/modeler/modeler.component';
import { WorkflowComponent } from './workflow/workflow.component';
import { ViewerComponent } from './workflow/viewer/viewer/viewer.component';

const routes: Routes=[
  {path:'', component:WorkflowComponent},
  {path:'workflow-designer',component: ModelerComponent},
  {path:'workflow-viewer',component: ViewerComponent},  
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
