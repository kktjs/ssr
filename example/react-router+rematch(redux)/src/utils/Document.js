import React from 'react';

function InitData({ data }) {
  let JSSTR = null;
  try {
    JSSTR = JSON.stringify(data);
  } catch (error) {} // eslint-disable-line
  return (
    <script type="text/javascript" dangerouslySetInnerHTML={{ __html: `var _KKT_SSR = ${JSSTR};` }}/>
  );
}

export class Document extends React.Component {
  static async getInitialProps({ assets, data, renderPage }) {
    const page = await renderPage();
    return { assets, data, ...page };
  }
  render() {
    const { helmet, assets, data } = this.props;
    // get attributes from React Helmet
    const htmlAttrs = helmet.htmlAttributes.toComponent();
    const bodyAttrs = helmet.bodyAttributes.toComponent();

    return (
      <html lang="en" {...htmlAttrs}>
        <head>
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          {helmet.title.toComponent()}
          {helmet.meta.toComponent()}
          {helmet.link.toComponent()}
          {assets.client.css && <link rel="stylesheet" href={assets.client.css} />}
          {assets.loadable && assets.loadable.css.map((item, idx) => {
            return <link rel="stylesheet" id={idx} key={idx} href={item} />;
          })}
        </head>
        <body {...bodyAttrs}>
          <div id="root">___SERVER_SSR_RENDER___</div>
          <InitData data={data} />
          {assets.loadable && assets.loadable.js.map((item, idx) => {
            return <script key={idx} type="text/javascript" src={item} defer crossOrigin="anonymous" />;
          })}
          <script type="text/javascript" src={assets.client.js} defer crossOrigin="anonymous" />
        </body>
      </html>
    );
  }
}
