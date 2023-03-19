# SABIO UI

This repository contains the user interface for [The SociAl BIas Observatory (SABIO)](https://www.cultural-ai.nl/projects/post-2-4c8dm).

To use this application, you need a [SABIO API](./public/swagger.yml?raw=true), like [valevo/SABIO](https://github.com/valevo/SABIO).

A demo can be found at: https://sabio.sudox.nl/

![SABIO UI screenshot](./screenshot.jpg?raw=true)

## Prerequisites

- [`yarn`](https://classic.yarnpkg.com/en/)
- [`docker`](https://www.docker.com/) (optional)

## Installation

Install the dependencies, by running:

`yarn install`

## Development

Copy `.env.dist` to `.env.development.local` and set the values to match your (API) configuration.

Start the application in development mode, by running:

`yarn start`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Production

Copy `.env.dist` to `.env.production.local` and set the values to match your configuration.

Build the application, using yarn:

`yarn build`

The compiled version and static files can be found in the `build` folder.

## Hosting

The files in the build folder can be hosted as static files on your webserver.

In order for `react-router` to handle the routing, the web server must be configured to redirect unresolved requests to `index.html`.

### Nginx

Include the following lines in your Nginx configuration file

```
# Any route containing a file extension (e.g. /script.js)
location ~ ^.+\..+$ {
  try_files $uri =404;
}

# Any route that doesn't have a file extension (e.g. /browser)
location / {
    try_files $uri $uri/ /index.html;
}
```

### Apache

```
# Rewrite urls to index.html for React router
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

Make sure `mod_rewrite` is enabled.

## Docker

Run `yarn run docker` to build and run the container.

Docker can be used to run this application without requiring the installation of dependencies on your system.

The Dockerfile contains two steps:

1. Build the application
2. Host the resulting files using Nginx on port `8080`

Make sure to configure the environment correctly by file `.env.production.local`, or by providing the environment variables in your build command.

## License

See LICENSE.txt

## About

- Design & Development: [SUDOX](https://www.sudox.nl)
- Project: [The SociAl BIas Observatory (SABIO)](https://www.cultural-ai.nl/projects/post-2-4c8dm), 2021
- Client: [Royal Netherlands Academy of Arts and Sciences (KNAW)](https://www.knaw.nl/)
- Funded by: [Dutch Digital Heritage Network](https://netwerkdigitaalerfgoed.nl/)
