Create KKT App
---

Create universal React apps in one command.

```bash
npx create-kkt-app my-app
cd my-app
npm start
```

You can also initialize a project from one of the examples.

```bash
npx create-kkt-app --example react-router my-app
cd my-app
npm start
```

Created with yarn: 

```bash
yarn create kkt-app my-app
```

### Command Help

```bash
Usage: create-kkt-app <project-directory> [options]

A baseline for server side rendering for your React application.

Options:
  -v, --version                 output the version number
  -e, --example <example-path>  Example from https://github.com/kktjs/ssr/tree/master/example example-path (default: "basic")
  -h, --help                    output usage information

Examples:

  $ create-kkt-app <project-directory>
  $ create-kkt-app my-app
  $ create-kkt-app -e react-router my-app
```
