import { Component, Input, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
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
  @Input() public contract: ethers.Contract| any | undefined = undefined;
  @Input() public shares: number = 0;
  @Input() public tokens: any[] = [];  /* [token1.address, token2.address] */
  err_msg: string = "";
  sharesToLiquidate = 0;
  et1ToAdd = 0;
  et2ToAdd = 0;

  constructor(
    private modalCtrl: ModalController,
    private toastCtrl: ToastController
  ){}

  ngOnInit(): void {
    if (
      !this.signer ||
      !this.provider ||
      !this.contract ||
      !this.tokens.length
    ) {
      this.err_msg = "Failed to initialize";
      setTimeout(async () => {
        await this.close(null);
      });

      return;
    }
  }

  async close(value: any): Promise<void> {
    await this.modalCtrl.dismiss(value);
  }

  async add() {

    // i need to listen if the inputs with id 'et2Amount' and 'et1Amount' change bc we have to ensure that the amount of token the user is adding in for liquidity is NOT affecting the price. the equation is dy / dx = y / x

    const et1Reserves = await this.contract.reserveA();
    const et2Reserves = await this.contract.reserveB();
    const et1Float = parseFloat(ethers.utils.formatEther(et1Reserves._hex));

    console.log({ et1Reserves, et2Reserves, et1Float });
  }

  async remove() {
    if (!this.signer || !this.provider || !this.contract || !this.tokens.length) {
      this.err_msg = "Failed to initialize";
      setTimeout(async () => {
        await this.close(null);
      });

      return;
    }


    if (!this.shares) {
      this.err_msg = "No shares to liquidate";
      return;
    }

    if (!this.sharesToLiquidate) {
      this.err_msg = "Must liquidate at least one share";
      return;
    }

    try {
      const tx = await this.contract.connect(
        this.signer
      ).removeLiquidity(this.sharesToLiquidate);
      const receipt = await tx.wait();
      await this.createToast('Success');
      console.log({ receipt });
      await this.close('success');
      // edit locally as the smart contract is already updated. need to send the data back to the origin page

    } catch (err) {
      this.err_msg = JSON.stringify(err);
      return;
    }
  }

  async createToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3500,
      position: 'middle'
    });

    await toast.present();
  }

}
