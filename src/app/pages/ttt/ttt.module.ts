import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TttPageRoutingModule } from './ttt-routing.module';

import { TttPage } from './ttt.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TttPageRoutingModule
  ],
  declarations: [TttPage]
})
export class TttPageModule {}
