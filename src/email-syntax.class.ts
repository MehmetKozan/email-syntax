export class EmailSyntax{
    private static _localPartRegex: RegExp = /^[A-Za-z0-9=?\/^_`{}|~!#$%&'*+-](\.?[A-Za-z0-9=?\/^_`{}|~!#$%&'*+-])*/g;
    private static _domainPartRegex: RegExp = /^[A-Za-z0-9](\-?[A-Za-z0-9])*/i;
    /**
     * Validates given email address
     * @param {string} address - Email address to validate
     */
    static validate(address: string){
        const splittedAddress: {localPart: string; domainName: string;} | boolean = this._split(address);
        if (!splittedAddress) return false;
        /* Local Part Checks */
        splittedAddress['localPart'] = this.extractFromQuotes(splittedAddress['localPart']);
        if (splittedAddress['localPart'].length === 0) return false;
        if (!this._validateLocalPartSyntax(splittedAddress['localPart'])) return false;
        /* Domain Name Checks */
        if (!this._isValidIpAddress(splittedAddress['domainName'])){
            if (!this._validateDomainName(splittedAddress['domainName'])) return false;
        }
        return true;
    }
    /**
     * Splits email address to local part and domain name
     * @param {string} address - email address
     */
    private static _split(address: string): boolean | {localPart: string; domainName: string}{
        if (address && address.length > 0){
            const splittedAddress: Array<string> = address.split('@');
            return (splittedAddress.length === 2)?
                { localPart: splittedAddress[0].trim(), domainName: splittedAddress[1].trim()} : false;
        }
        return false;
    }
    /**
     * Check if quoted and extract local part
     * @param {string} localPart - local part of address
     */
    private static extractFromQuotes(localPart: string){
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
    /**
     * Method for validation of domain name syntaxis
     */
    private static _validateDomainName(domainName: string): boolean{
        const parts: Array<string> = domainName.split('.');
        if (parts.length === 0) return false;
        for(let i = 0; i < parts.length; i++){
            if (parts[i].length === 0) return false;
            let p: RegExpMatchArray = parts[i].match(this._domainPartRegex);
            if (p === null || p[0] !== parts[i]) return false;
        }
        if (parts[parts.length - 1].length < 2) return false;
        return true;
    }
    /**
     * Method for validation of local-part of address
     */
    private static _validateLocalPartSyntax(localPart: string): boolean{
        const regexResult: RegExpMatchArray = localPart.match(this._localPartRegex);
        if (regexResult === null || localPart !== regexResult[0]) return false;
        return true;
    }
    /**
     * Method to find out is domain name is a valid ip address like 1.2.3.4
     */
    private static _isValidIpAddress(domainName: string): boolean{
        const ip: Array<string> = domainName.split('.');
        if (ip.length !== 4) return false;
        const _ip: Array<number> = ip.map(o => +o);
        for(let i = 0; i < 4; i++){
            if (isNaN(_ip[i]) || _ip[i] > 254 || _ip[i] < 1) return false;
        }
        return true;
    }
}
