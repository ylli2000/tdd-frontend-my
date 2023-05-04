# Coding Note

Everything about the project code are in their notes.

Globally Search for `NOTE:` keywoard to see a list of notes. 

# Generic Note

## Server Setup

we removed dotenv `.env` and moved port settings to `package.json` to assert we don't make mistake 
using `.env` for anything in this *front end* project.

in `package.json` we `set PORT=9876 && react-scripts start` for the front end

in `env.js` we set `SERVER_API_URL:http://localhost, SERVER_API_PORT:8080` for api calls

also in `package.json` we could set `"proxy": "http://localhost:8080"` for api calls (which we didn't)

Here is the explanation https://create-react-app.dev/docs/proxying-api-requests-in-development/
## VS setup

Prettier is used to format code on save.

`Shift+Ctrl+P` open Settings (JSON) `settings.json` file. 

```
"markdown.extension.preview.autoShowPreviewToSide": true,
"editor.formatOnSave": true,
"prettier.tabWidth": 4,
"prettier.singleQuote": true,
"workbench.tree.indent": 24,
"workbench.tree.renderIndentGuides": "always",
```
These settings are to define indentation of the file, folder and code.

Also use to display this markdown file automatically.

## ESLint React Plugin

Install eslint either locally or globally. (Note that locally, per project, is strongly preferred)

If you installed eslint globally, you have to install the React plugin globally too. Otherwise, install it locally (strongly preferred)

`npm install eslint --save-dev`

`npm install eslint-plugin-react --save-dev`

`npm install eslint-plugin-import --save-dev`

`npm install eslint-plugin-react-hooks --save-dev`

`npm install eslint-plugin-jsx-a11y --save-dev`

Take a look at `package.json` for the ESLint configs. Don't forget to restart the running server
if you have changed the package file for the new configs to take effect.
## Semantic UI Version 2.0.4 Fix

The main reason for this is an extra ";" at line 19990 of semantic.css
If removed, everything goes fine.

```
@font-face {
  font-family: 'Step';
  src: url(data:application/x-font-ttf;charset=utf-8;;base64,AAEAAAAOAIAAAw... // this line
}
```