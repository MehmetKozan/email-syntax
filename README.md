# email-syntax
Email addresses syntax validations library

[![Build Status](https://travis-ci.org/agroupp/email-syntax.svg?branch=master)](https://travis-ci.org/agroupp/email-syntax)
[![Coverage Status](https://coveralls.io/repos/github/agroupp/email-syntax/badge.svg?branch=master)](https://coveralls.io/github/agroupp/email-syntax?branch=master)

Syntax email addresses verification based on [RFC5321](https://tools.ietf.org/html/rfc5321) and 
[RFC5322](https://tools.ietf.org/html/rfc5322).


## Installation
Install Email Syntax as an npm module and save it to your package.json file as a dependency:
    
    npm install --save email-syntax


## Usage
To use validator, you need to create instance of EmailSyntax class and use its main method validate(). Furthermore, 
you can use method extractFromQuotes() to get local part of address without quotes.

```javascript
    const emailSyntax = new EmailSyntax();
    if (emailSyntax.validate('test@some-mail.com')){
        console.log('This address is valid');
    }
```


## Tests

    npm test

