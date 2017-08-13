export class EmailSyntax{
    private static localPartRegex: RegExp = /^[A-Za-z0-9=?\/^_`{}|~!#$%&'*+-](\.?[A-Za-z0-9=?\/^_`{}|~!#$%&'*+-])*/g;
    private static domainPartRegex: RegExp = /^[A-Za-z0-9](\-?[A-Za-z0-9])*/i;
    /**
     * Validates given email address
     * @param {string} address - Email address to validate
     * @return {boolean}
     */
    static validate(address: string): boolean{
        const splittedAddress: {localPart: string; domainName: string;} | boolean = this.split(address);
        if (!splittedAddress) return false;
        /* Local Part Checks */
        splittedAddress['localPart'] = this.extractFromQuotes(splittedAddress['localPart']);
        if (splittedAddress['localPart'].length === 0) return false;
        if (!this.validateLocalPart(splittedAddress['localPart'])) return false;
        /* Domain Name Checks */
        if (!this.isValidIpAddress(splittedAddress['domainName'])){
            if (!this.validateDomainName(splittedAddress['domainName'])) return false;
        }
        return true;
    }
    /**
     * Splits email address to local part and domain name
     * @param {string} address - email address
     * @return {Object | boolean}
     */
    private static split(address: string): boolean | {localPart: string; domainName: string}{
        if (address && address.length > 0){
            const splittedAddress: Array<string> = address.split('@');
            return (splittedAddress.length === 2)?
                { localPart: splittedAddress[0].trim(), domainName: splittedAddress[1].trim()} : false;
        }
        return false;
    }
    /**
     * Checks if quoted and extracts local part
     * @param {string} localPart - local part of address
     * @return {string}
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
     * Validates domain name syntaxis
     * @param {string} domainName - domain name
     * @return {boolean}
     */
    private static validateDomainName(domainName: string): boolean{
        const parts: Array<string> = domainName.split('.');
        if (parts.length === 0) return false;
        for(let i = 0; i < parts.length; i++){
            if (parts[i].length === 0) return false;
            let p: RegExpMatchArray = parts[i].match(this.domainPartRegex);
            if (p === null || p[0] !== parts[i]) return false;
        }
        if (parts[parts.length - 1].length < 2) return false;
        return true;
    }
    /**
     * Validates local-part of address
     * @param {string} localPart - local part of address
     * @return {boolean}
     */
    private static validateLocalPart(localPart: string): boolean{
        const regexResult: RegExpMatchArray = localPart.match(this.localPartRegex);
        if (regexResult === null || localPart !== regexResult[0]) return false;
        return true;
    }
    /**
     * Checks if domain name is a valid ip address like 1.2.3.4
     * @param {string} domainName - domain name
     * @return {boolean}
     */
    private static isValidIpAddress(domainName: string): boolean{
        const ip: Array<string> = domainName.split('.');
        if (ip.length !== 4) return false;
        const _ip: Array<number> = ip.map(o => +o);
        for(let i = 0; i < 4; i++){
            if (isNaN(_ip[i]) || _ip[i] > 254 || _ip[i] < 1) return false;
        }
        return true;
    }
}
