kkt-ssr
---

Create [React](https://github.com/facebook/react) server-side rendering universal JavaScript applications with no configuration.

## Usage

You will need [`Node.js`](https://nodejs.org) installed on your system.

### Install

```bash
npm i @kkt/ssr
```

### development

Runs the project in development mode.  

```bash
npm run start
```

### production

Builds the app for production to the build folder.

```bash
npm run build
```

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

Runs the compiled app in production.

```bash
npm run server
```

## Example

A complete [`react + react-router + rematch(redux)`](example/react-router+rematch(redux)) example is recommended for production projects.

- [`basic`](example/basic) Server-side rendering of the React base application.
- [`dynamic-loadable`](example/dynamic-loadable) A dynamic loadable for server side rendering for your React application.
- [`mock-api`](example/mock-api) Server-side rendering mock api of the React base application.
- [`reach-router-loadable`](example/reach-router-loadable) A reach-router loadable for server side rendering for your React application.
- [`react-router`](example/react-router) React uses server-side rendering of the react-router.
- [`react + react-router + rematch(redux)`](example/react-router+rematch(redux)) This is a sophisticated example of server-side rendering.

## License

[MIT © Kenny Wong](./LICENSE)
