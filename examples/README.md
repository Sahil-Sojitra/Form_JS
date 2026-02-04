# Examples

This folder contains a complete working example of the Dynamic Form Builder library.

## Running the Example

1. Make sure you have a local development server installed (like Live Server for VS Code)
2. Open `index.html` with your local server
3. The example demonstrates:
   - Dynamic form generation from JSON configuration
   - localStorage data persistence
   - Table rendering with CRUD operations
   - Form validation
   - Update and delete functionality

## Files

- `index.html` - Main HTML file
- `main.js` - Application logic connecting Form, Storage, and Table
- `formData.js` - Form configuration (JSON definition of all form fields)
- `main.css` - Styling for the example

## Features Demonstrated

- ✅ Text, email, phone inputs
- ✅ Textarea for addresses
- ✅ Select dropdowns (country, state, gender)
- ✅ Radio buttons (languages)
- ✅ Checkboxes (skills)
- ✅ Hidden fields with auto-generated values (userId, createdAt)
- ✅ Form validation
- ✅ CRUD operations
- ✅ Data persistence in localStorage
- ✅ Edit existing records
- ✅ Delete records
- ✅ Success/error messages

## Customization

Feel free to modify `formData.js` to experiment with different field types and configurations!
