import { ListServiceComponent } from './list-service/list-service.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Service Master'
    },
    children: [
      {
        path: 'list-service',
        component: ListServiceComponent,
        data: {
          title: 'List Service'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServicemasterRoutingModule { }
