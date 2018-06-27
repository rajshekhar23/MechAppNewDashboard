import { ListModelComponent } from './list-model/list-model.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListBrandComponent } from './list-brand/list-brand.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Vehicle Master'
    },
    children: [
      {
        path: 'list-brand',
        component: ListBrandComponent,
        data: {
          title: 'List Brand'
        }
      },
      {
        path: 'list-model',
        component: ListModelComponent,
        data: {
          title: 'List Model'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ButtonsRoutingModule {}
