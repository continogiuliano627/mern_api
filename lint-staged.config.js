/* eslint-env node */
import "path";

const eslintCommand = (filenames) =>
  `eslint --fix ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(" ")}`;

const formatCommand = "prettier --write";

const funct = {
  "*.{js,mjs,cjs}": [formatCommand, eslintCommand],
  "*.{css,scss}": [formatCommand], // si luego agregas estilos
  "!*.{js,mjs,cjs,css,scss}": [formatCommand],
};

module.exports = funct;
