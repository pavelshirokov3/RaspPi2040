import {RP2040} from './Rp2040'

describe('RP2040', () => {
  describe('executeInstruction', () => {
    it('should execute a PUSH instruction', () => {
      const rp2040 = new RP2040('');
      rp2040.PC = 0;
      rp2040.flash[rp2040.PC] = 0xb570;
      rp2040.executeInstruction();
      // проверка, что R4,R5,R6,LR были помещены в стек
    });
  });
}); 