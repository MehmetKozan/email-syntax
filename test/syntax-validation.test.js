'use strict';

const assert = require('chai').assert;
const syntaxValidate = require('../');

describe('Syntax validation of email address', function(){
    describe('Address splitting', function(){
        it('splits email address to local part and domain name', function(){
            assert.deepEqual(syntaxValidate.split('email@domain.com'), { localPart: 'email', domainName: 'domain.com'});
        });
        it('returns empty object if email address is not valid for splitting', function(){
            assert.deepEqual(syntaxValidate.split('email@domain@com'), {});
            assert.deepEqual(syntaxValidate.split('email'), {});
            assert.deepEqual(syntaxValidate.split(''), {});
            assert.deepEqual(syntaxValidate.split(), {});
        });
    });
    describe('Local part', function(){
        it("may be quoted", function(){
            assert.equal(syntaxValidate.extractFromQuotes('"abc"'), 'abc');
            assert.lengthOf(syntaxValidate.extractFromQuotes('"ab"c'), 0);
            assert.lengthOf(syntaxValidate.extractFromQuotes('"ab"cdlkf"'), 0);
        });
        it("may use uppercase and lowercase Latin letters A to Z and a to z", function(){
            assert(syntaxValidate.validateLocalPartSyntax('abc'));
            assert(syntaxValidate.validateLocalPartSyntax('aBcxYz'));
        });
        it("may use digits 0 to 9", function(){
            assert(syntaxValidate.validateLocalPartSyntax('abc3748374'));
            assert(syntaxValidate.validateLocalPartSyntax('9894385984abc'));
            assert(syntaxValidate.validateLocalPartSyntax('9859485984'));
        });
        it("may use special characters !#$%&'*+-/=?^_`{|}~", function(){
             assert(syntaxValidate.validateLocalPartSyntax('!#$%&\'*+-/=?^_`{|}~'));
        });
        it("dot '.' may be used but not first, last or appear consecutively", function(){
            assert(syntaxValidate.validateLocalPartSyntax('ab.c'));
            assert.isNotOk(syntaxValidate.validateLocalPartSyntax('.abc'));
            assert.isNotOk(syntaxValidate.validateLocalPartSyntax('abc.'));
            assert.isNotOk(syntaxValidate.validateLocalPartSyntax('ab..c'));
        });
    });
    describe('Domain name', function(){
        it("can be valid IP address", function(){
            assert(syntaxValidate.isValidIpAddress('172.68.14.55'));
            assert.isNotOk(syntaxValidate.isValidIpAddress('172.68.314.55'));
            assert.isNotOk(syntaxValidate.isValidIpAddress('172.68.14.55.77'));
            assert.isNotOk(syntaxValidate.isValidIpAddress('172.14.55'));
        });
        it("every part may use only ASCII letters, digits and '-' case-insensitive", function(){
            assert(syntaxValidate.validateDomainName('abc.xyz'));
            assert.isNotOk(syntaxValidate.validateDomainName('abc.xyz.'));
            assert(syntaxValidate.validateDomainName('ab-c.xyz'));
        });
        it("every part may start only with letters or digits", function(){
            assert.isNotOk(syntaxValidate.validateDomainName('!kdlfd.-lkds'));
            assert(syntaxValidate.validateDomainName('123.abc'));
        });
        it("every part can't end with hyphen", function(){
            assert.isNotOk(syntaxValidate.validateDomainName('abc.xyz-'));
        });
        it("last part must be more then 1 symbol", function(){
            assert.isNotOk(syntaxValidate.validateDomainName('abc.x'));
        });
    });
});
describe('Common address validations', function(){
    it('must be in form "local-part@domain-name"', function(){
        assert(syntaxValidate.validate('abc@domain'));
        assert.isNotOk(syntaxValidate.validate('abc@domain@domain2'));
    });
    it("can be in form 'abc@172.16.12.3'", function(){
        assert(syntaxValidate.validate('abc@172.16.12.3'));
    });
    it("can't be '.email@domain.com'", function(){
        assert.isNotOk(syntaxValidate.validate('.email@domain.com'));
    });
    it("can't be 'email.@domain.com'", function(){
        assert.isNotOk(syntaxValidate.validate('email.@domain.com'));
    });
    it("can't be 'ema..il@domain.com'", function(){
        assert.isNotOk(syntaxValidate.validate('ema..il@domain.com'));
    });
    it("can't be 'email@-domain.com'", function(){
        assert.isNotOk(syntaxValidate.validate('email@-domain.com'));
    });
    it("can't be 'email@domain..com'", function(){
        assert.isNotOk(syntaxValidate.validate('email@domain..com'));
    });
    it("can't be 'email@'", function(){
        assert.isNotOk(syntaxValidate.validate('email@'));
    });
    it("can't be '@domain.com'", function(){
        assert.isNotOk(syntaxValidate.validate('@domain.com'));
    });
});