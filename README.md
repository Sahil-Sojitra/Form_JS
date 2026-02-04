# Dynamic Form Builder JS

A lightweight, flexible JavaScript library for building dynamic forms with built-in table rendering and localStorage management. Create complex forms from JSON configurations without writing HTML.

## Features

- ✨ **Dynamic Form Generation** - Create forms from JSON configuration
- 📊 **Built-in Table Rendering** - Display data in sortable tables
- 💾 **localStorage Integration** - Automatic data persistence
- 🎯 **CRUD Operations** - Full Create, Read, Update, Delete support
- 🎨 **Customizable** - Flexible callbacks and styling options
- 📦 **Zero Dependencies** - Pure vanilla JavaScript
- 🔧 **ES6 Modules** - Modern JavaScript syntax

## Installation

```bash
npm install @sahil_sojitra_007/dynamic-form-builder-js
```

**⚠️ Important:** This is a **browser-only** library that requires DOM APIs. It will not work in Node.js server-side code.

## Quick Start

### Step 1: Create HTML File

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Form App</title>
</head>
<body>
    <div id="myFormContainer">
        <form id="myForm"></form>
    </div>
    <div id="myTable"></div>
    
    <script type="module" src="app.js"></script>
</body>
</html>
```

### Step 2: Create JavaScript File (app.js)

```javascript
import { Form, Storage, Table } from '@sahil_sojitra_007/dynamic-form-builder-js';

// Define your form fields
const formConfig = [
  {
    type: 'text',
    label: 'Name',
    key: 'name',
    attr: {
      required: true,
      placeholder: 'Enter name',
    },
  },
  {
    type: 'email',
    label: 'Email',
    key: 'email',
    attr: {
      required: true,
      placeholder: 'Enter email',
    },
  },
];

// Initialize Form
const form = new Form('myFormId', formConfig, {
  onSubmit: (data) => {
    storage.addEmployeeData(data);
    console.log('Form submitted:', data);
  },
});

// Initialize Storage
const storage = new Storage('myStorageKey', {
  onDataChange: (data) => {
    table.render(data);
  },
});

// Initialize Table
const table = new Table('myTableId', {
  onDelete: (id) => {
    storage.deleteEmployeeData(id);
  },
  onUpdate: (data) => {
    form.updateFormData(data);
  },
});

// Render initial data
table.render(storage.getAllEmployeeData());
```

## API Reference

### Form Class

Creates a dynamic form from JSON configuration.

#### Constructor

```javascript
new Form(formContainerId, formData, callbacks);
```

**Parameters:**

- `formContainerId` (string): ID of the container element
- `formData` (array): Array of field configuration objects
- `callbacks` (object): Optional callbacks
  - `onSubmit(data)`: Called when form is submitted
  - `onReset()`: Called when form is reset

#### Field Configuration

Each field object can have:

```javascript
{
  type: 'text|email|tel|textarea|select|checkbox|radio|hidden|submit|reset',
  label: 'Field Label',
  key: 'fieldKey',
  value: 'default value',
  attr: {
    id: 'elementId',
    className: 'css-class',
    placeholder: 'placeholder text',
    required: true,
    // ... any HTML attributes
  },
  options: [ // for select, checkbox, radio
    { value: 'val1', innerText: 'Option 1', attr: { id: 'opt1', className: 'option' } }
  ],
  getValue: function(formData) { // for hidden fields
    return computedValue;
  }
}
```

#### Methods

- `updateFormData(data)` - Populate form with existing data for editing
- `showMessage(message, type)` - Display success/error messages
- `getFormDataObject()` - Get current form data as object

#### Supported Field Types

- **text, email, tel, password, number, date** - Standard input fields
- **textarea** - Multi-line text input
- **select** - Dropdown selection
- **checkbox** - Multiple selections
- **radio** - Single selection from options
- **hidden** - Hidden fields with computed values
- **submit, reset** - Form action buttons

### Storage Class

Manages data persistence using localStorage.

#### Constructor

```javascript
new Storage(storageId, callbacks);
```

**Parameters:**

- `storageId` (string): localStorage key
- `callbacks` (object): Optional callbacks
  - `onDataChange(data)`: Called when data changes

#### Methods

- `getAllEmployeeData()` - Returns all stored data
- `addEmployeeData(data)` - Add new record
- `updateEmployeeData(data)` - Update existing record
- `deleteEmployeeData(userId)` - Delete record by ID
- `loadFromStorage()` - Load data from localStorage
- `saveToStorage()` - Save data to localStorage

### Table Class

Renders data in a table with action buttons.

#### Constructor

```javascript
new Table(tableContainerId, callbacks);
```

**Parameters:**

- `tableContainerId` (string): ID of the container element
- `callbacks` (object): Optional callbacks
  - `onDelete(userId)`: Called when delete button clicked
  - `onUpdate(data)`: Called when update button clicked

#### Methods

- `render(data)` - Render table with provided data array
- `formatHeaderName(key)` - Format column headers (snake_case to Title Case)

## Complete Example

See the [examples](./examples) folder for a full working example with:

- Employee management form
- Data table with CRUD operations
- localStorage persistence
- Custom styling

To run the example:

```bash
cd examples
# Open index.html with a local server (e.g., Live Server in VS Code)
```

## Hidden Fields & Computed Values

You can use hidden fields to generate automatic values:

```javascript
{
  type: 'hidden',
  key: 'userId',
  getValue: function(formData) {
    // formData contains current form values
    return formData.userId || Math.floor(100000 + Math.random() * 900000);
  }
}
```

## Event Handling

Add event handlers to any field:

```javascript
{
  type: 'text',
  label: 'Name',
  key: 'name',
  attr: {
    onchange: function(e, formData) {
      console.log('Name changed:', e.target.value);
    }
  }
}
```

## Styling

The library adds default classes you can style:

- `.default_input` - Default input styling
- `.form-message` - Message container
- `.form-message-success` - Success messages
- `.form-message-error` - Error messages
- `.radio_check_label` - Radio/checkbox labels

## Browser Support

Works in all modern browsers that support:

- ES6 Modules
- localStorage
- FormData API

**⚠️ This library requires a browser environment and will NOT work in:**
- Node.js server-side code
- Server-Side Rendering (SSR) during build time
- Backend APIs

## Common Issues & Solutions

### ❌ Issue: "Cannot use import statement outside a module"
**✅ Solution:** Add `type="module"` to your script tag:
```html
<script type="module" src="app.js"></script>
```

### ❌ Issue: Package not found after installation
**✅ Solution:** Use the correct scoped package name:
```javascript
import { Form, Storage, Table } from '@sahil_sojitra_007/dynamic-form-builder-js';
```

### ❌ Issue: "document is not defined" / "window is not defined"
**✅ Solution:** This is a browser-only library. If using Next.js/React:
```javascript
'use client'; // Next.js
import { Form, Storage, Table } from '@sahil_sojitra_007/dynamic-form-builder-js';
```

### ❌ Issue: Form not appearing
**✅ Solution:**
1. Ensure container exists: `<form id="myForm"></form>`
2. Check browser console for errors
3. Verify IDs match between HTML and JavaScript

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Author

Your Name

## Changelog

### 1.0.0

- Initial release
- Form, Storage, and Table classes
- Full CRUD support
- localStorage integration
