react-router+rematch
---

A simple for server side rendering for your React application.

[Rematch](https://github.com/rematch/rematch) is [Redux](https://github.com/reduxjs/redux) best practices without the boilerplate. No more action types, action creators, switch statements or thunks.

[`React`](https://github.com/facebook/react) + [`React Router`](https://github.com/ReactTraining/react-router) + [`Rematch`](https://github.com/rematch/rematch) + [`Express`](https://expressjs.com/)

### development

Runs the project in development mode.  

```bash
npm install
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


### `getInitialProps: (ctx) => Data`

Within `getInitialProps`, you have access to all you need to fetch data on both the client and the server:

```js
class Home extends React.Component {
  static async getInitialProps({ req, res, match, store, history, location, ...ctx }) {
    store.dispatch.global.verify();
    return { whatever: 'Home stuff', ...ctx };
  }
}
```

Within getInitialProps, you have access to all you need to fetch data on both the client and the server:

- `req?: Request`: (server-only) A [`Express`](https://expressjs.com/) request object
- `res?: Request`: (server-only) An [`Express`](https://expressjs.com/) response object
- `store`: A [`Rematch`](https://github.com/rematch/rematch) store request object
- `match`: React Router 4's `match` object.
- `history`: React Router 4's `history` object.
- `location`: (client-only) React Router 4's `location` object.
