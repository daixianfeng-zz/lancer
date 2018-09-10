describe('gDate', function(){
    describe('format', function(){
        it('1525257102279 => 2018-05-02 18:31:42', function(){
            assert.equal('2018-05-02 18:31:42', gDate.datetimeFormat(1525257102279, 'YYYY-MM-DD HH:mm:ss'));
        });
        it('1525257102279 => 2018-05-02 18:31:42', function(){
            assert.equal('2018-05-02 18:31', gDate.datetimeFormat(1525257102279, 'YYYY-MM-DD HH:mm'));
        });
        it('1525257102279 => 2018-05', function(){
            assert.equal('2018-05', gDate.datetimeFormat(1525257102279, 'YYYY-MM'));
        });
        it('1525257102279 => 2018-05-02', function(){
            assert.equal('2018-05-02', gDate.datetimeFormat(1525257102279));
        });
    });
    describe('trans', function(){
        it('2018-05-02 +3 month => 2018-08-02', function(){
            assert.equal('2018-08-02', gDate.datetimeFormat(gDate.transMonth('2018-05-02', 3)));
        });
        it('2018-05-31 -3 month => 2018-02-28', function(){
            assert.equal('2018-02-28', gDate.datetimeFormat(gDate.transMonth('2018-05-31', -3)));
        });
        it('2016-02-29 +2 year => 2018-02-28', function(){
            assert.equal('2018-02-28', gDate.datetimeFormat(gDate.transYear('2016-02-29', 2)));
        });
        it('2020-12-28 -2 year => 2018-12-28', function(){
            assert.equal('2018-12-28', gDate.datetimeFormat(gDate.transYear('2020-12-28', -2)));
        });
        it('2018-12-28 +4 day => 2019-01-01', function(){
            assert.equal('2019-01-01', gDate.datetimeFormat(gDate.transDay('2018-12-28', 4)));
        });
        it('2018-12-28 -28 day => 2018-11-30', function(){
            assert.equal('2018-11-30', gDate.datetimeFormat(gDate.transDay('2018-12-28', -28)));
        });
        it('2018-12-28 12:56:43 -2 minute => 2018-12-28 12:54:43', function(){
            assert.equal('2018-12-28 12:54:43', gDate.datetimeFormat(gDate.transMinute('2018-12-28 12:56:43', -2), 'YYYY-MM-DD HH:mm:ss'));
        });
        it('2018-12-28 12:56:43 +4 minute => 2018-12-28 13:00:43', function(){
            assert.equal('2018-12-28 13:00:43', gDate.datetimeFormat(gDate.transMinute('2018-12-28 12:56:43', 4), 'YYYY-MM-DD HH:mm:ss'));
        });
        it('2018-12-28 12:56:43 -2 hour => 2018-12-28 10:56:43', function(){
            assert.equal('2018-12-28 10:56:43', gDate.datetimeFormat(gDate.transHour('2018-12-28 12:56:43', -2), 'YYYY-MM-DD HH:mm:ss'));
        });
        it('2018-12-28 12:56:43 +12 hour => 2018-12-29 00:56:43', function(){
            assert.equal('2018-12-29 00:56:43', gDate.datetimeFormat(gDate.transHour('2018-12-28 12:56:43', 12), 'YYYY-MM-DD HH:mm:ss'));
        });
        it('2018-12-28 12:56:43 -2 second => 2018-12-28 12:56:41', function(){
            assert.equal('2018-12-28 12:56:41', gDate.datetimeFormat(gDate.transSecond('2018-12-28 12:56:43', -2), 'YYYY-MM-DD HH:mm:ss'));
        });
        it('2018-12-31 23:59:59 +1 second => 2019-01-01 00:00:00', function(){
            assert.equal('2019-01-01 00:00:00', gDate.datetimeFormat(gDate.transSecond('2018-12-31 23:59:59', 1), 'YYYY-MM-DD HH:mm:ss'));
        });
    });
});