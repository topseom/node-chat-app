var expect = require('expect');
var {isRealString} = require('./validation');

describe('isRealString',()=>{
    it('should return true for send string',()=>{
        var str = 'teststring';
        var result = isRealString(str);
        expect(result).toBe(true);
    });

    it('should reject string with only space',()=>{
        var str = '     ';
        var result = isRealString(str);
        expect(result).toBe(false);
    });

    it('should return false for send is not string',()=>{
        var str = 123;
        var result = isRealString(str);
        expect(result).toBe(false);
    });
});

