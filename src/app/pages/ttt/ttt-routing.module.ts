import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TttPage } from './ttt.page';

const routes: Routes = [
  {
    path: '',
    component: TttPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TttPageRoutingModule {}
