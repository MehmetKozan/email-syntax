'use strict';

const localPartRegex = /^[A-Za-z0-9=?\/^_`{}|~!#$%&'*+-](\.?[A-Za-z0-9=?\/^_`{}|~!#$%&'*+-])*/g;
const domainPartRegex = /^[A-Za-z0-9](\-?[A-Za-z0-9])*/i

module.exports = {
    /**
     * Main module method.
     * 
     * @param {string} address - Email Address for testing
     * @returns {boolean}
     */
    validate: function(address){
        const splittedAddress = address.split('@');
        if (splittedAddress.length !== 2) return false;
        let localPart = splittedAddress[0];
        let domainName = splittedAddress[1];

        /* Local Part Checks */
        localPart = this.extractFromQuotes(localPart);
        if (localPart.length === 0) return false;
        if (!this.validateLocalPartSyntax(localPart)) return false;

        /* Domain Name Checks */
        if (!this.isValidIpAddress(domainName)){
            if (!this.validateDomainName(domainName)) return false;
        }
        return true;
    },
    /**
     * Splits email address to local part and domain name
     * @param {string} address - email address
     * @returns {Object}
     */
    split: function(address){

    },
    /**
     * Method for validation of local-part of address
     * @param {string} localPart - local part of address
     */
    validateLocalPartSyntax: function(localPart){
        const regexResult = localPart.match(localPartRegex);
        if (regexResult === null || localPart !== regexResult[0]) return false;
        return true;
    },
    /**
     * Method for validation of domain name syntaxis
     * @param {string} domainName - domain name like 'gmail.com'
     */
    validateDomainName: function(domainName){
        const parts = domainName.split('.');
        if (parts.length === 0) return false;
        for(let i = 0; i < parts.length; i++){
            let p = parts[i].match(domainPartRegex);
            if (p === null || p[0] !== parts[i]) return false;
        }
        if (parts[parts.length - 1].length < 2) return false;
        return true;
    },
    /**
     * Method to find out is domain name is a valid ip address like 1.2.3.4
     * @param {string} domain - domain name like 'gmail.com' or '1.2.3.4'
     */
    isValidIpAddress: function (domain){
        let ip = domain.split('.');
        if (ip.length !== 4) return false;
        ip = ip.map(o => +o);
        for(let i = 0; i < 4; i++){
            if (isNaN(ip[i]) || ip[i] > 254) return false;
        }
        return true;
    },
    /**
     * Check if quoted and extract local part
     * @param {string} localPart - local part of address
     */
    extractFromQuotes: function(localPart){
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
};
