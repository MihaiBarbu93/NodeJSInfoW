## Description

A NodeJS endpoint listening for requests with different contents.

## Technologies and tools used

Node.JS, TypeScript, Postman.

This project was created with [Visual Studio Code](https://code.visualstudio.com/).

## Installation

After downloading the repo, open the project with VSCode and run:

```node.js
npm install
```

### Starting the solution

1. In order to start the server, run in terminal:

```js
npm run dev
```

2. Atferwards, open Postman and import the NodeJsApi.postam_collection.json file in the collections tab:

```js
For the post request(application/json) everything is in place, just send the request and test it by changing the body and the 'x-vamf-jwt' header.
```
```js
For the Post request(text/csv), just choose a csv file to upload from your computer and send the request.
```

