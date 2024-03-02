# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

## Installation of MONGODB

- Create account in the mongodb site
- Create a database
- Create collection
- Click Connect
- Install Mongo Db for VS Code extension
- Search mongodb connection in Command Palette
- Copy the string in the connect 
- Change the password
- Connect!

- Install Mongo DB Community Server
- Install Mongo DB Compass

## Installation of Express JS

- Add api folder
- Type in terminal npm i -y

- Type in terminal npm i express mongoose cors nodemon
- Type in terminal npm i express --save
- Type in terminal npm i cors
- Type in terminal npm i mongodb --save
- Type in terminal npm i multer --save


## Install FontAwesome

- npm config delete "@fortawesome:registry"
- npm install --save @fortawesome/fontawesome-svg-core
- npm install --save @fortawesome/free-solid-svg-icons
- npm install --save @fortawesome/react-fontawesome

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
