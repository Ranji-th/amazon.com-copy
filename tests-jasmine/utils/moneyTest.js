import { formatCurrency } from '../../script/utils/money.js';

describe('test suite: formatCurrency', () => {
    it('convery cents into dollars', () => {
      expect(formatCurrency(2095)).toEqual('20.95');
    });

    it('compare with 0', () => {
      expect(formatCurrency(0)).toEqual('0.00');
    });

    it('rounds up to the nearest cent', () => {
      expect(formatCurrency(2000.5)).toEqual('20.01');
      expect(formatCurrency(2000.4)).toEqual('20.00');  
    });

    it('works with nagative number', () => {
      expect(formatCurrency(-106)).toEqual('-1.06');
    });
});