# Publishing Guide for dynamic-form-builder-js

## Pre-Publishing Checklist

Before publishing, make sure you complete these steps:

### 1. Update Package Information

Edit `package.json` and update:

- `"name"`: Change if "dynamic-form-builder-js" is taken
- `"author"`: Add your name and email
- `"repository"`: Add your GitHub repository URL
- `"bugs"`: Update with your GitHub issues URL
- `"homepage"`: Update with your GitHub repo URL

### 2. Create GitHub Repository

1. Create a new repository on GitHub
2. Initialize git in your project:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/dynamic-form-builder-js.git
   git push -u origin main
   ```

### 3. Update LICENSE

Edit the `LICENSE` file and replace `[Your Name]` with your actual name.

### 4. Create an npm Account

If you don't have one:

1. Go to https://www.npmjs.com/signup
2. Create an account
3. Verify your email

### 5. Test Locally

Test your package locally before publishing:

```bash
# Link the package locally
npm link

# In another project, test it
npm link dynamic-form-builder-js
```

## Publishing Steps

### Step 1: Login to npm

```bash
npm login
```

Enter your npm username, password, and email.

### Step 2: Check Package Name Availability

```bash
npm search dynamic-form-builder-js
```

If the name is taken, update the name in `package.json`.

### Step 3: Verify Package Contents

See what will be published:

```bash
npm pack --dry-run
```

This shows you exactly what files will be included.

### Step 4: Publish to npm

For first-time publishing:

```bash
npm publish
```

If the package is scoped (starts with @):

```bash
npm publish --access public
```

### Step 5: Verify Publication

Check your package page:

```
https://www.npmjs.com/package/dynamic-form-builder-js
```

## Publishing Updates

When you make changes:

1. Update the version in `package.json`:

   - **Patch** (bug fixes): `1.0.0` → `1.0.1`
   - **Minor** (new features): `1.0.0` → `1.1.0`
   - **Major** (breaking changes): `1.0.0` → `2.0.0`

2. Or use npm version:

   ```bash
   npm version patch  # for bug fixes
   npm version minor  # for new features
   npm version major  # for breaking changes
   ```

3. Commit and tag:

   ```bash
   git add .
   git commit -m "Version bump"
   git push
   git push --tags
   ```

4. Publish:
   ```bash
   npm publish
   ```

## Common Issues

### Issue: Package name already exists

**Solution**: Change the name in package.json to something unique, or use a scoped package:

```json
{
  "name": "@yourusername/dynamic-form-builder-js"
}
```

### Issue: Authentication errors

**Solution**:

```bash
npm logout
npm login
```

### Issue: Version already published

**Solution**: Bump the version number in package.json and try again.

## Best Practices

1. **Semantic Versioning**: Follow semver (https://semver.org/)
2. **Changelog**: Keep a CHANGELOG.md to track changes
3. **Git Tags**: Tag releases in git
4. **Testing**: Always test before publishing
5. **Documentation**: Keep README up-to-date

## After Publishing

1. **Add badges** to README:

   ```markdown
   ![npm version](https://img.shields.io/npm/v/dynamic-form-builder-js)
   ![npm downloads](https://img.shields.io/npm/dm/dynamic-form-builder-js)
   ![license](https://img.shields.io/npm/l/dynamic-form-builder-js)
   ```

2. **Share** on social media, dev.to, or Reddit

3. **Monitor** GitHub issues and npm for feedback

## Need Help?

- npm documentation: https://docs.npmjs.com/
- Package.json guide: https://docs.npmjs.com/cli/v8/configuring-npm/package-json
- Semantic versioning: https://semver.org/
