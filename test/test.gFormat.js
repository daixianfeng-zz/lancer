describe('gFormat', function(){
    describe('string', function(){
        it('是打发ef2 4 => 是打发e...', function(){
            assert.equal('是打发e...', gFormat.limitLength('是打发ef2', 4));
        });
        it('是打发ef2 -4 => ...发ef2', function(){
            assert.equal('...发ef2', gFormat.limitLength('是打发ef2', -4));
        });
        it('是打发ef2 8 => 是打发ef2', function(){
            assert.equal('是打发ef2', gFormat.limitLength('是打发ef2', 8));
        });
        it('是打发ef2 -8 => 是打发ef2', function(){
            assert.equal('是打发ef2', gFormat.limitLength('是打发ef2', -8));
        });
    });
    describe('char', function(){
        it('是打发ef2 2 => 是打...', function(){
            assert.equal('是打...', gFormat.limitCharLength('是打发ef2', 2));
        });
        it('是打e发f2 3 => 是打e...', function(){
            assert.equal('是打e...', gFormat.limitCharLength('是打e发f2', 3));
        });
        it('是打e发f2 4 => 是打e发f...', function(){
            assert.equal('是打e发f...', gFormat.limitCharLength('是打e发f2', 4));
        });
        it('是打e发f2 6 => 是打e发f2', function(){
            assert.equal('是打e发f2', gFormat.limitCharLength('是打e发f2', 6));
        });
        it('是打e发f2 -3 => ...e发f2', function(){
            assert.equal('...e发f2', gFormat.limitCharLength('是打e发f2', -3));
        });
        it('是打e发f2 -4 => ...打e发f2', function(){
            assert.equal('...打e发f2', gFormat.limitCharLength('是打e发f2', -4));
        });
        it('是打e发f2 -6 => 是打e发f2', function(){
            assert.equal('是打e发f2', gFormat.limitCharLength('是打e发f2', -6));
        });
    });
    describe('char length', function(){
        it('12!ab@3c【 】d4#$56{7《e》8}9fg0', function(){
            assert.equal('32', gFormat.getCharLength('12!ab@3c【 】d4#$56{7《e》8}9fg0'));
        });
        it('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', function(){
            assert.equal('52', gFormat.getCharLength('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'));
        });
        it('12345 67890', function(){
            assert.equal('11', gFormat.getCharLength('12345 67890'));
        });
        it('·`~!@#$%^&*()_+{}|:"<>?-=[]\\;\',./', function(){
            assert.equal('33', gFormat.getCharLength('·`~!@#$%^&*()_+{}|:"<>?-=[]\\;\',./'));
        });
        it('！￥…（）【】、：；“”‘’《》，。？、', function(){
            assert.equal('40', gFormat.getCharLength('！￥…（）【】、：；“”‘’《》，。？、'));
        });
    });
    describe('bankcard', function(){
        it('6225757524526473 => 6225 7575 2452 6473', function(){
            assert.equal('6225 7575 2452 6473', gFormat.toBankcard('6225757524526473'));
        });
        it('621226 02000 135 86017 => 6212 2602 0001 3586 017', function(){
            assert.equal('6212 2602 0001 3586 017', gFormat.toBankcard('621226 02000 135 86017'));
        });
    });
});

