// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: true,
  firebase: {
    apiKey: 'AIzaSyDZ7be6HZrnwQqt0-z3j2fnnOnjqEPkE1o',
    authDomain: 'mechapp-dev.firebaseapp.com',
    databaseURL: 'https://mechapp-dev.firebaseio.com',
    projectId: 'mechapp-dev',
    storageBucket: 'mechapp-dev.appspot.com',
    messagingSenderId: '948120423616'
  }
};
