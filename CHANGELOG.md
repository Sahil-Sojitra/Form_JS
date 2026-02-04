# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2026-02-04

### 🔒 Security Enhancements

- Input validation and sanitization across all classes
- Safe JSON parsing with error handling
- XSS protection through proper text content handling
- localStorage quota exceeded handling
- Deep cloning to prevent data mutation
- Comprehensive input validation for field configurations

### ✨ New Features

- `destroy()` methods for proper cleanup and memory management
- `findById()` method in Storage class
- `clear()`, `exportData()`, `importData()` methods in Storage
- `getSize()` method to check localStorage usage
- New Utils module with security and validation helpers
- Event listener tracking for proper cleanup

### 🐛 Bug Fixes

- Fixed memory leaks from uncleaned event listeners
- Fixed potential XSS vulnerabilities
- Fixed localStorage corruption from invalid data
- Fixed missing null checks that could crash the application
- Removed console.log statements from production code
- Fixed merge conflicts in package.json

### 🎨 Improvements

- Complete refactor of Form, Storage, and Table classes
- Comprehensive JSDoc documentation
- Better error messages and validation
- Better accessibility with ARIA labels
- Defensive programming practices
- Improved code organization and readability

## [1.0.1] - 2026-02-04

### Changed

- Updated README with better documentation
- Fixed package.json metadata

## [1.0.0] - 2026-02-04

### Initial Release

- Form class for dynamic form generation
- Storage class for localStorage management
- Table class for data table rendering
- Support for multiple input types
- CRUD operations
- Zero dependencies
