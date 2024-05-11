// Run Blink!
// npx ts-node .\src\Rp2040.ts

import { loadHex } from "./intelhex";
import fs from 'fs';

const RAM_START_ADDRESS = 0x20000000;


export class RP2040 {
  readonly sram  = new Uint8Array(264 * 1024);
  readonly sramView = new DataView(this.sram.buffer);
  readonly flash = new Uint8Array(16 * 1024 * 1024);
  readonly flash16 = new Uint16Array(this.flash.buffer);
  readonly registers = new Uint32Array(16);

  constructor(hex: string) {
    this.flash.fill(0xff);
    loadHex(hex, this.flash);
    this.SP = 0x41000;
  }

  get SP() {
    return this.registers[13];
  }

  set SP(value: number) {
    this.registers[13] = value;
  }

  get LR() {
    return this.registers[14];
  }

  set LR(value: number) {
    this.registers[14] = value;
  }

  get PC() {
    return this.registers[15];
  }

  set PC(value: number) {
    this.registers[15] = value;
  }

  executeInstruction() {
    // ARM Thumb instruction encoding 16bits / 2bytes
    const opcode = this.flash16[this.PC / 2];

    // PUSH
    function save_register_in_stack(iR: number): void {
      let adr = this.SP - RAM_START_ADDRESS;
      this.sramView.setInt32(adr, this.registers[iR]); // copy 4 bytes
    }
    if( opcode>>9 === 0b1011010 ) {
      if( opcode & 0x0100 ) { // M==1?
        this.SP -= 4;
        save_register_in_stack(14); // LR
      }
      for(let iR=7; iR>=0; iR--) {
        if(opcode & 1<<iR) {
          this.SP -= 4;
          save_register_in_stack(iR);
        }
      }
    } // end PUSH
    console.log(opcode.toString(16));
  }

  // ROM   at 0x0 (16 kb)
  // SRAM  at 0x10000000
  // FLASH at 0x20000000
}


// Create an array with the compiled code of blink
// Execute the instructions from this array, one by one.
console.log("Hello World!");
//const hex = fs.readFileSync('./blink.hex', 'utf8');
//const mcu = new RP2040(hex);
//mcu.executeInstruction();