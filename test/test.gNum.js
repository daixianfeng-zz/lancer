describe('gNum', function(){
    describe('numberToMoney', function(){
        it('123456789 => 123,456,789.00', function(){
            assert.equal('123,456,789.00', gNum.numberToMoney(123456789));
        });
        it('1234.45678 => 1,234.4568', function(){
            assert.equal('1,234.4568', gNum.numberToMoney(1234.45678, 4));
        });
        it('-123 => -123.00', function(){
            assert.equal('-123.00', gNum.numberToMoney(-123));
        });
        it('-123.456 => -123', function(){
            assert.equal('-123', gNum.numberToMoney(-123, 0));
        });
        it('not number: abcdefg => abcdefg', function(){
            assert.equal('abcdefg', gNum.numberToMoney('abcdefg'));
        });
        it('NaN: NaN => ""', function(){
            assert.equal('', gNum.numberToMoney(NaN));
        });
        it('string: 1234.45678 => 1,234.4568', function(){
            assert.equal('1,234.4568', gNum.numberToMoney('1234.45678', 4));
        });
    });
    describe('float', function(){
        it('20.17*100 => 2017', function(){
            assert.equal(2017, gNum.baiToNumber(20.17));
        });
        it('20.17*10000 => 201700', function(){
            assert.equal(201700, gNum.wanToNumber(20.17));
        });
        it('20.17*100000000 => 2017000000', function(){
            assert.equal(2017000000, gNum.yiToNumber(20.17));
        });
        it('20.17% => 0.2017', function(){
            assert.equal(0.2017, gNum.percentToNumber('20.17%'));
        });
    });
    describe('to number', function(){
        it('  20.17万   => 201700', function(){
            assert.equal(201700, gNum.toNumber('  20.17万  '));
        });
        it('20.17万 => 201700', function(){
            assert.equal(201700, gNum.toNumber('20.17万'));
        });
        it('20.17亿 => 2017000000', function(){
            assert.equal(2017000000, gNum.toNumber(' 20.17亿'));
        });
        it('20.172323% => 0.20172323', function(){
            assert.equal(0.20172323, gNum.toNumber('20.172323%'));
        });
    });
});

