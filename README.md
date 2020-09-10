# ESLint GitHub Action

Checks you files against ESLint and errors if there are any issues. Does not edit any of your files.

## Inputs

### `eslintBinary`

**Required** Where your ESLint binary is stored. Default "node_modules/.bin/eslint"

### `eslintFolder`

**Required** Where ESLint should look for the files. Defaults to "."

## Example usage

```yaml
uses: dunklesToast/eslint-action@v1
with:
  eslintBinary: 'custom/path/to/eslint'
  eslintFolder: 'src'
```
