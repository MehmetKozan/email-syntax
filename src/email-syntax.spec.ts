import { EmailSyntax } from './email-syntax.class';


describe('Common email addresses validations', function(){
  it('must be in form "local-part@domain-name"', () => {
      expect(EmailSyntax.validate('abc@domain')).toBeTruthy();
      expect(EmailSyntax.validate('abc@domain@domain2')).toBeFalsy();
      expect(EmailSyntax.validate('')).toBeFalsy();
  });
  it('local part can be quoted like "abc"@domain.com', () => {
      expect(EmailSyntax.validate('"abc"@domain.com')).toBeTruthy();
      expect(EmailSyntax.validate('"ab"dc"@domain.com')).toBeFalsy();
      expect(EmailSyntax.validate('"ab"dc@domain.com')).toBeFalsy();
  });
  it("can be in form 'abc@172.16.12.3'", () => {
      expect(EmailSyntax.validate('abc@172.16.12.3')).toBeTruthy();
      expect(EmailSyntax.validate('abc@172.16.abc.3')).toBeFalsy();
  });
  it("can't be '.email@domain.com'", () => {
      expect(EmailSyntax.validate('.email@domain.com')).toBeFalsy();
  });
  it("can't be 'email.@domain.com'", () => {
      expect(EmailSyntax.validate('email.@domain.com')).toBeFalsy();
  });
  it("can't be 'ema..il@domain.com'", () => {
      expect(EmailSyntax.validate('ema..il@domain.com')).toBeFalsy();
  });
  it("can't be 'email@-domain.com'", () => {
      expect(EmailSyntax.validate('email@-domain.com')).toBeFalsy();
      expect(EmailSyntax.validate('email@-')).toBeFalsy();
      expect(EmailSyntax.validate('email@--')).toBeFalsy();
  });
  it("can't be 'email@domain..com'", () => {
      expect(EmailSyntax.validate('email@domain..com')).toBeFalsy();
  });
  it("can't be 'email@domain.c'", () => {
      expect(EmailSyntax.validate('email@domain.c')).toBeFalsy();
  });
  it('can\'t be \'"em"ail"@domain.com\'', () => {
      expect(EmailSyntax.validate('em"ail"@domain.com')).toBeFalsy();
  });
  it("can't be 'email@'", () => {
      expect(EmailSyntax.validate('email@')).toBeFalsy();
  });
  it("can't be '@domain.com'", () => {
      expect(EmailSyntax.validate('@domain.com')).toBeFalsy();
  });
  it("can't be 'abc@...'", () => {
    expect(EmailSyntax.validate('abc@...')).toBeFalsy();
    expect(EmailSyntax.validate('abc@....')).toBeFalsy();
  });
});