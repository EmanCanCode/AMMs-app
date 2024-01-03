import { Component, OnInit } from '@angular/core';
import { ethers } from 'ethers';
import tokenBuild from '../../abi/EmanToken.sol/EmanToken.json';
import ammBuild from '../../abi/CPAMM.sol/CPAMM.json';
import { AlertController, ModalController } from '@ionic/angular';
import { Liquidity } from '../_modals/liquidity/liquidity';

declare const window: any;
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  private provider = new ethers.providers.Web3Provider(window.ethereum);
  et1: Token = {
    address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    balance: '0',
    contract: new ethers.Contract(
      '0x5FbDB2315678afecb367f032d93F642f64180aa3',
      tokenBuild.abi,
      this.provider
    )
  }
  et2: Token = {
    address: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    balance: '0',
    contract: new ethers.Contract(
      '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
      tokenBuild.abi,
      this.provider
    )
  }
  amm: Amm = {
    address: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
    reserveA: '0',
    reserveB: '0',
    totalShares: 0,
    userShares: 0,
    contract: new ethers.Contract(
      '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
      ammBuild.abi,
      this.provider
    )
  }
  connectedAddr: string = '';
  parsedAddr: string = '';
  // hardhat network id
  private networkId = 31337;
  authorized = false;
  signer: ethers.providers.JsonRpcSigner | undefined = undefined;

  constructor(
    private alertCtrl: AlertController,
    private modalCtrl: ModalController
  ) {

  }

  ngOnInit() {
    this.onChangedWallet().then(async () => {
      await this.init();
    });
    this.onNetworkChange();
  }

  async balanceOf() {

  }

  async connectWallet() {
    if (this.connectedAddr) {
      this.authorized = false;
      this.connectedAddr = "";
      this.parsedAddr = "";
      return;
    }

    if (typeof window.ethereum == 'undefined') {
      this.alert('Please install metamask');
      return;
    }
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

    if (accounts.length == 0) {
      this.alert('Please connect to metamask');
      return;
    }
    this.connectedAddr = accounts[0];
    this.parsedAddr = this.parseAddress(this.connectedAddr);
    this.authorized = true;
    await this.init();
    this.provider = new ethers.providers.Web3Provider(window.ethereum);
    this.signer = this.provider.getSigner();
    this.amm.contract!.connect(this.signer);
    console.log({ signer: this.signer, account: accounts[0] });
  }

  async init() {
    if (!this.authorized) return;
    // get et1 balance
    this.et1.balance = this.formatNumber(
      ethers.utils.formatEther(await this.et1.contract.balanceOf(this.connectedAddr))
    );
    // get et2 balance
    this.et2.balance = this.formatNumber(
      ethers.utils.formatEther(await this.et2.contract.balanceOf(this.connectedAddr))
    );
    // get reserveA
    this.amm.reserveA = this.formatNumber(
      ethers.utils.formatEther(await this.amm.contract.reserveA())
    );
    // get reserveB
    this.amm.reserveB = this.formatNumber(
      ethers.utils.formatEther(await this.amm.contract.reserveB())
    );
    // get total shares
    this.amm.totalShares = this.formatNumber(await this.amm.contract.totalSupply());
    // get user shares
    this.amm.userShares = this.formatNumber(await this.amm.contract.balanceOf(this.connectedAddr));
  }

  formatNumber(num: string | number): string {
    num = Number(num);
    if (num >= 1e30) {
      return (num / 1e30).toFixed(1) + 'N'; // Nonillion
    } else if (num >= 1e27) {
      return (num / 1e27).toFixed(1) + 'O'; // Octillion
    } else if (num >= 1e24) {
      return (num / 1e24).toFixed(1) + 'Sp'; // Septillion
    } else if (num >= 1e21) {
      return (num / 1e21).toFixed(1) + 'Sx'; // Sextillion
    } else if (num >= 1e18) {
      return (num / 1e18).toFixed(1) + 'Qi'; // Quintillion
    } else if (num >= 1e15) {
      return (num / 1e15).toFixed(1) + 'Q'; // Quadrillion
    } else if (num >= 1e12) {
      return (num / 1e12).toFixed(1) + 'T'; // Trillion
    } else if (num >= 1e9) {
      return (num / 1e9).toFixed(1) + 'B'; // Billion
    } else if (num >= 1e6) {
      return (num / 1e6).toFixed(1) + 'M'; // Million
    } else if (num >= 1e3) {
      return (num / 1e3).toFixed(1) + 'k'; // Thousand
    } else {
      return num.toFixed(2).toString();
    }
  }

  private alert(message: string) {
    this.alertCtrl.create({
      message,
      buttons: ['OK']
    }).then(async alert => await alert.present());
  }

  private onNetworkChange() {
    window.ethereum.on('networkChanged', (networkId: number) => {
      if (networkId !== this.networkId) {
        this.alert('Please switch to Eman network');
        this.authorized = false;
      }
    });
  }

  private parseAddress(address: string): string {
    return `${address[0]}${address[1]}${address[2]}...${address[address.length - 4]}${address[address.length - 3]}${address[address.length - 2]}${address[address.length - 1]}`;
  }

  async onChangedWallet() {
    window.ethereum.on('accountsChanged', async (accounts: string[]) => {
      if (accounts.length == 0) {
        this.alert('Please connect to metamask');
        this.authorized = false;
        this.connectedAddr = "";
        this.parsedAddr = "";
        return;
      }
      this.connectedAddr = accounts[0];
      this.parsedAddr = this.parseAddress(this.connectedAddr);
      this.authorized = true;
      await this.init();
    });
  }

  liquidity(action: 'add' | 'remove') {
    this.modalCtrl.create({
      component: Liquidity,
      componentProps: {
        action,
        signer: this.signer,
        provider: this.provider,
        contract: this.amm.contract,
        shares: this.amm.userShares,
        tokens: [this.et1.address, this.et2.address]
      }
    }).then(async modal => await modal.present());
  }

  async swap() {
    let tx = await this.amm.contract!.connect(this.signer).swap(
      this.et1.address,
      ethers.utils.parseEther('1'),
    );
    const receipt = await tx.wait();
    console.log({ receipt });
  }

}

interface Token {
  address: string;
  balance: number | string;
  contract?: any
}

interface Amm {
  address: string;
  reserveA: number | string;
  reserveB: number | string;
  totalShares: number | string;
  userShares: number | string;
  contract?: any
}


