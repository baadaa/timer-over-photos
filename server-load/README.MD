# Create Resource List for Player

## Summary
- Running as a server-side app, this creates a `JSON` file at `../data/` with list of imagesfrom Cloudinary.
- Not meant to be _constantly_ running on the server as the client-side app loads the `JSON`s only at first load. Run this **_only if/when_** there's an update to Cloudinary resource archive—i.e. files added or/and removed.

## Setup
Make sure to create `api-creds.js` file as below. _(Not included in this repo)_

```javascript
// api-creds.js

const key = "[API-KEY-STRING-HERE]",
  secret = "[API-SECRET-STRING-HERE]",
  url = "api.cloudinary.com/v1_1/[ACCOUNT-NAME-HERE]/resources";

module.exports = { key, secret, url };
```


## Usage
With Node installed, run:
```javascript
$ npm run build
```

or run:
```javascript
$ node create-list
```


## Notes
1. The build command above needs to be executed in this directory (`/server-load/`), _before_ running any build in `/js/` folder.
2. It contains `async/await` syntax; make sure you have `Node.JS 7.6` or greater.
3. Cloudinary API call structure might change after the time of this writing. 