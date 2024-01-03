import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ttt',
  templateUrl: './ttt.page.html',
  styleUrls: ['./ttt.page.scss'],
})
export class TttPage implements OnInit {
  player: 'player1' | 'player2' = 'player1';
  err_msg: string = "";


  constructor() { }

  ngOnInit() {
  }

  // play tile
  playTile(
    id: string
  ) {
    if (this.err_msg) this.err_msg = "";


    // determine if the tile has been selected
    const tile = document.getElementById(id)!;
    if (tile.innerHTML) {
      this.err_msg = "Select another tile";
      return;
    }
    // if not, select tile for the user
    const value = this.player == 'player1' ? 'X' : 'O';
    tile.innerHTML = value;
    // switch user
    this.player = value == 'X' ? 'player2' : 'player1';
  }
  // restart game
  restartGame() {
    this.err_msg = "";
    for (let i = 1; i < 10; i++) {
      const tile = document.getElementById(`${i}`)!;
      tile.innerHTML = "";
      this.player = 'player1';

    }
  }
}


