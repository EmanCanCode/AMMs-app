import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Liquidity } from './liquidity/liquidity';

const modals: any[] = [Liquidity/*Liquidity, swap*/];
@NgModule({
  declarations: [...modals],
  imports: [CommonModule, FormsModule, IonicModule],
  exports: [...modals],
})
export class ModalsModule {}
