/**
 * Created by Ben on 03/06/2017.
 */

class Security {
    constructor(service) {
        this.service = service;
    }
    static disableFrameEmbedding(res) {
        // -> Disable Frame Embedding
        res.set('X-Frame-Options', 'deny');
    }

    static enableXssFilter(res){
        // -> Re-enable XSS Fitler if disabled
        res.set('X-XSS-Protection', '1; mode=block');
    }

    static disableMimeSniffing(res){
        // -> Disable MIME-sniffing
        res.set('X-Content-Type-Options', 'nosniff');
    }

    static disableIeCompatibility(res){
        // -> Disable IE Compatibility Mode
        res.set('X-UA-Compatible', 'IE=edge');
    }
}

module.exports = Security;