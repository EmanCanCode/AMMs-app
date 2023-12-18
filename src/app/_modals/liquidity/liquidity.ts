import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ethers } from 'ethers';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'liquidity',
  templateUrl: './liquidity.html',
  styleUrls: ['./liquidity.scss'],
})
export class Liquidity implements OnInit {
  @Input() public action: 'add' | 'remove' = 'add';
  @Input() public signer: ethers.providers.JsonRpcSigner | undefined = undefined;
  @Input() public provider: ethers.providers.Web3Provider | undefined = undefined;
  @Input() public contract: ethers.Contract | undefined = undefined;
  @Input() public shares: number = 0;
  @Input() public tokens: any[] = [];


  constructor(
    private modalCtrl: ModalController,
  ){}

  ngOnInit(): void {
      console.log({ action: this.action })
  }

  async close(): Promise<void> {
    await this.modalCtrl.dismiss();
  }

  add() {

  }

}
