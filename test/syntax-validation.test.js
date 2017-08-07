'use strict';

const assert = require('chai').assert;
const EmailSyntax = require('../');

describe('Syntax validation of email address', function(){
    let syntaxValidate;
    describe('Address splitting', function(){
        beforeEach(function(){
            syntaxValidate = new EmailSyntax();
        });

        it('splits email address to local part and domain name', function(){
            syntaxValidate._split('test1@domain.com');
            assert.strictEqual(syntaxValidate.localPart, 'test1');
            assert.strictEqual(syntaxValidate.domainName, 'domain.com');
        });
        it("doesn't set properties if email address is not valid for splitting", function(){
            syntaxValidate._split('email@domain@com');
            assert.isUndefined(syntaxValidate.localPart);
            assert.isUndefined(syntaxValidate.domainName);

            syntaxValidate._split('email');
            assert.isUndefined(syntaxValidate.localPart);
            assert.isUndefined(syntaxValidate.domainName);

            syntaxValidate._split('');
            assert.isUndefined(syntaxValidate.localPart);
            assert.isUndefined(syntaxValidate.domainName);

            syntaxValidate._split();
            assert.isUndefined(syntaxValidate.localPart);
            assert.isUndefined(syntaxValidate.domainName);
        });
    });
    describe('Local part', function(){
        it("may be quoted", function(){
            assert.equal(syntaxValidate.extractFromQuotes('"abc"'), 'abc');
            assert.equal(syntaxValidate.extractFromQuotes('abc'), 'abc');
            assert.lengthOf(syntaxValidate.extractFromQuotes('"ab"c'), 0);
            assert.lengthOf(syntaxValidate.extractFromQuotes('"ab"cdlkf"'), 0);
        });
        it("may use uppercase and lowercase Latin letters A to Z and a to z", function(){
            syntaxValidate.localPart = 'abc';
            assert.isTrue(syntaxValidate._validateLocalPartSyntax());
            syntaxValidate.localPart = 'aBcxYz';
            assert.isTrue(syntaxValidate._validateLocalPartSyntax());
        });
        it("may use digits 0 to 9", function(){
            syntaxValidate.localPart = 'abc3748374';
            assert.isTrue(syntaxValidate._validateLocalPartSyntax());
            syntaxValidate.localPart = '9894385984abc';
            assert.isTrue(syntaxValidate._validateLocalPartSyntax());
            syntaxValidate.localPart = '9859485984';
            assert.isTrue(syntaxValidate._validateLocalPartSyntax());
        });
        it("may use special characters !#$%&'*+-/=?^_`{|}~", function(){
            syntaxValidate.localPart = '!#$%&\'*+-/=?^_`{|}~';
             assert.isTrue(syntaxValidate._validateLocalPartSyntax());
        });
        it("dot '.' may be used but not first, last or appear consecutively", function(){
            syntaxValidate.localPart = 'ab.c';
            assert.isTrue(syntaxValidate._validateLocalPartSyntax());
            syntaxValidate.localPart = '.abc';
            assert.isFalse(syntaxValidate._validateLocalPartSyntax());
            syntaxValidate.localPart = 'abc.';
            assert.isFalse(syntaxValidate._validateLocalPartSyntax());
            syntaxValidate.localPart = 'ab..c';
            assert.isFalse(syntaxValidate._validateLocalPartSyntax());
        });
    });
    describe('Domain name', function(){
        it("can be valid IP address", function(){
            syntaxValidate.domainName = '172.68.14.55';
            assert.isTrue(syntaxValidate._isValidIpAddress());
            syntaxValidate.domainName = '172.68.314.55';
            assert.isNotTrue(syntaxValidate._isValidIpAddress());
            syntaxValidate.domainName = '172.68.14.55.77';
            assert.isNotTrue(syntaxValidate._isValidIpAddress());
            syntaxValidate.domainName = '172.14.55';
            assert.isNotTrue(syntaxValidate._isValidIpAddress());
        });
        it("every part may use only ASCII letters, digits and '-' case-insensitive", function(){
            syntaxValidate.domainName = 'abc.xyz';
            assert.isTrue(syntaxValidate._validateDomainName());
            syntaxValidate.domainName = 'abc.xyz.';
            assert.isNotTrue(syntaxValidate._validateDomainName());
            syntaxValidate.domainName = 'ab-c.xyz';
            assert.isTrue(syntaxValidate._validateDomainName());
        });
        it("every part may start only with letters or digits", function(){
            syntaxValidate.domainName = '!kdlfd.-lkds';
            assert.isFalse(syntaxValidate._validateDomainName());
            syntaxValidate.domainName = '123.abc';
            assert.isTrue(syntaxValidate._validateDomainName());
        });
        it("every part can't end with hyphen", function(){
            syntaxValidate.domainName = 'abc.xyz-';
            assert.isFalse(syntaxValidate._validateDomainName());
        });
        it("last part must be more then 1 symbol", function(){
            syntaxValidate.domainName = 'abc.x';
            assert.isFalse(syntaxValidate._validateDomainName());
        });
    });
});
describe('Common address validations', function(){
    let syntaxValidate;
    beforeEach(function(){
        syntaxValidate = new EmailSyntax();
    });
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
    it('can\'t be \'"em"ail"@domain.com\'', function(){
        assert.isNotOk(syntaxValidate.validate('em"ail"@domain.com'));
    });
    it("can't be 'email@'", function(){
        assert.isNotOk(syntaxValidate.validate('email@'));
    });
    it("can't be '@domain.com'", function(){
        assert.isNotOk(syntaxValidate.validate('@domain.com'));
    });
});