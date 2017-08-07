'use strict';

class EmailSyntax{
    constructor(){
        this._localPartRegex = /^[A-Za-z0-9=?\/^_`{}|~!#$%&'*+-](\.?[A-Za-z0-9=?\/^_`{}|~!#$%&'*+-])*/g;
        this._domainPartRegex = /^[A-Za-z0-9](\-?[A-Za-z0-9])*/i;
    }
    /**
     * Main class method that validates given email address
     * @param {string} address - Email address to validate
     */
    validate(address){
        this._split(address);
        if (!this.localPart || !this.domainName) return false;
        /* Local Part Checks */
        this.localPart = this.extractFromQuotes(this.localPart);
        if (!this.localPart || this.localPart.length === 0) return false;
        if (!this._validateLocalPartSyntax()) return false;
        /* Domain Name Checks */
        if (!this._isValidIpAddress()){
            if (!this._validateDomainName()) return false;
        }
        return true;
    }

    /**
     * Check if quoted and extract local part
     * @param {string} localPart - local part of address
     */
    extractFromQuotes(localPart){
        if (localPart.charAt(0) === '"'){
            if (localPart.charAt(localPart.length - 1) === '"'){
                localPart = localPart.slice(1, localPart.length - 1);
                if ( localPart.indexOf('"') !== -1) return '';
            } else {
                return '';
            }
        }
        return localPart;
    }

    /* Private Methods */

    /**
     * Splits email address to local part and domain name
     * @param {string} address - email address
     */

    _split(address){
        if (address && address.length > 0){
            const splittedAddress = address.split('@');
            if (splittedAddress.length === 2){
                this.localPart = splittedAddress[0];
                this.domainName = splittedAddress[1];
            } else {
                delete this.localPart;
                delete this.domainName;
            }
        }
    }
    /**
     * Method for validation of domain name syntaxis
     */
    _validateDomainName(){
        const parts = this.domainName.split('.');
        if (parts.length === 0) return false;
        for(let i = 0; i < parts.length; i++){
            let p = parts[i].match(this._domainPartRegex);
            if (p === null || p[0] !== parts[i]) return false;
        }
        if (parts[parts.length - 1].length < 2) return false;
        return true;
    }
    /**
     * Method for validation of local-part of address
     */
    _validateLocalPartSyntax(){
        const regexResult = this.localPart.match(this._localPartRegex);
        if (regexResult === null || this.localPart !== regexResult[0]) return false;
        return true;
    }
    /**
     * Method to find out is domain name is a valid ip address like 1.2.3.4
     */
    _isValidIpAddress(){
        let ip = this.domainName.split('.');
        if (ip.length !== 4) return false;
        ip = ip.map(o => +o);
        for(let i = 0; i < 4; i++){
            if (isNaN(ip[i]) || ip[i] > 254) return false;
        }
        return true;
    }
}

module.exports = EmailSyntax;