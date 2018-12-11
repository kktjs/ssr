@kkt/react-ssr-enhanced
---

This is an enhancement to [@kkt/ssr](https://github.com/jaywcjlove/kkt-ssr), used with [react-router 4](https://github.com/ReactTraining/react-router). 
`React Router 4` supports all routes to `@kkt/react-ssr-enhanced`. You can use any and all parts of `React Router 4`.

[`React`](https://github.com/facebook/react) + [`React Router`](https://github.com/ReactTraining/react-router) + [`Rematch`](https://github.com/rematch/rematch) + [`Express`](https://expressjs.com/)


## Quick Start

> ⚠️ A perfect example [`react-router+rematch`](https://github.com/jaywcjlove/kkt-ssr/tree/master/example/react-router+rematch) is recommended for production environments.

```bash
npx create-kkt-app my-app -e react-router+rematch
cd my-app
npm start
```

### `getInitialProps: (ctx) => Data`

Within `getInitialProps`, you have access to all you need to fetch data on both the client and the server:

```js
class Home extends React.Component {
  static async getInitialProps({ req, res, match, store, history, location, ...ctx }) {
    store.dispatch.global.verify();
    return { whatever: 'Home stuff' };
  }
  render() {
    return (
      <div>
        <h1>Home</h1>
        {this.props.whatever ? this.props.whatever : 'Loading...'}
      </div>
    );
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

