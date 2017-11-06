
// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'      : '300567987026262', // your App ID
        'clientSecret'  : 'db093673597de3ffac8c244c44d5d056', // your App Secret
        'callbackURL'     : 'http://localhost/auth/facebook/callback',
        'profileURL': 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email'

    },

    'twitterAuth' : {
        'consumerKey'       : 'cE4zo8tfh4jAU5TUaPf5w0LKM',
        'consumerSecret'    : 'ZAympHrbHHUGHEHyuVzVXEX1POJsJYpbTU8UcGoC7deSN96drT',
        'callbackURL'        : 'http://localhost/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : '299655230729-3ap3e03a3ft08k4111676dvkjtel5qst.apps.googleusercontent.com',
        'clientSecret'  : 'rI93oiFCuOsmp3ADIoajSLqI',
        'callbackURL'      : 'http://localhost/auth/google/callback'
    }

};
