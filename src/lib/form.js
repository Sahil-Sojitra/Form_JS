import { sanitizeHTML, validateFieldConfig } from './utils.js';

/**
 * Form class for dynamic form generation and management
 * @class
 */
export default class Form {
  /**
   * Create a Form instance
   * @param {string} formContainerId - ID of the form container element
   * @param {Array} formData - Array of field configuration objects
   * @param {Object} callbacks - Callback functions {onSubmit, onReset}
   */
  constructor(formContainerId, formData, callbacks = {}) {
    // Validate inputs
    if (!formContainerId || typeof formContainerId !== 'string') {
      throw new Error('Form: formContainerId must be a non-empty string');
    }

    this.container = document.getElementById(formContainerId);

    if (!this.container) {
      throw new Error(`Form: Container element with ID "${formContainerId}" not found`);
    }

    if (!Array.isArray(formData) || formData.length === 0) {
      throw new Error('Form: formData must be a non-empty array of field definitions');
    }

    this.formData = formData;
    this.hiddenFields = [];
    this.fields = [];
    this.editingId = null;
    this.formState = {};
    this.eventListeners = []; // Track listeners for cleanup

    // Validate and set callbacks
    this.onSubmit = typeof callbacks.onSubmit === 'function' ? callbacks.onSubmit : () => { };
    this.onReset = typeof callbacks.onReset === 'function' ? callbacks.onReset : () => { };

    this.initialize();
  }

  /**
   * Initialize the form
   * @private
   */
  initialize() {
    try {
      this.validateInputs();
      this.separateFormField();
      this.loopingAllInputFields();
      this.attachFormHandlers();
    } catch (error) {
      console.error('Form initialization error:', error);
      throw error;
    }
  }

  /**
   * Validate form inputs
   * @private
   */
  validateInputs() {
    const invalidFields = this.formData.filter(field => !validateFieldConfig(field));

    if (invalidFields.length > 0) {
      console.warn('Invalid field configurations found:', invalidFields);
      // Filter out invalid fields
      this.formData = this.formData.filter(field => validateFieldConfig(field));
    }

    if (this.formData.length === 0) {
      throw new Error('Form: No valid fields found after validation');
    }
  }

  /**
   * Separate hidden fields from visible fields
   * @private
   */
  separateFormField() {
    this.formData.forEach((field) => {
      if (field.type === 'hidden') {
        this.hiddenFields.push(field);
      } else {
        this.fields.push(field);
      }
    });
  }

  /**
   * Loop through and create all input fields
   * @private
   */
  loopingAllInputFields() {
    this.fields.forEach((field) => {
      try {
        this.createInputField(field);
      } catch (error) {
        console.error(`Error creating field "${field.key}":`, error);
      }
    });
  }

  /**
   * Create a single input field
   * @private
   * @param {Object} field - Field configuration
   */
  createInputField(field) {
    let ele;

    switch (field.type) {
      case 'textarea':
        ele = this.createTextarea(field);
        break;

      case 'select':
        ele = this.createSelect(field);
        break;

      case 'checkbox':
        ele = this.createCheckboxGroup(field);
        break;

      case 'radio':
        ele = this.createRadioGroup(field);
        break;

      case 'submit':
      case 'reset':
        ele = this.createButton(field);
        break;

      default:
        ele = this.createInput(field);
        break;
    }

    if (ele) {
      this.appendFieldToForm(field, ele);
    }
  }

  /**
   * Create textarea element
   * @private
   */
  createTextarea(field) {
    const ele = document.createElement('textarea');
    ele.name = field.key;
    this.applyAttributes(ele, field.attr);
    return ele;
  }

  /**
   * Create select element
   * @private
   */
  createSelect(field) {
    const ele = document.createElement('select');
    ele.name = field.key;

    if (Array.isArray(field.options)) {
      field.options.forEach((opt) => {
        const option = document.createElement('option');
        option.value = opt.value !== undefined ? opt.value : '';
        option.textContent = opt.innerText || opt.label || opt.value || '';
        ele.appendChild(option);
      });
    }

    this.applyAttributes(ele, field.attr);
    return ele;
  }

  /**
   * Create checkbox group
   * @private
   */
  createCheckboxGroup(field) {
    const container = document.createElement('div');
    container.className = 'checkbox-group';

    if (Array.isArray(field.options)) {
      field.options.forEach((opt, index) => {
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.name = field.key;
        input.value = opt.value !== undefined ? opt.value : '';

        // Generate safe IDs
        const safeId = opt.attr?.id || `${field.key}_${index}`;
        input.id = safeId;

        if (opt.attr?.className) {
          input.className = opt.attr.className;
        }

        const label = document.createElement('label');
        label.className = 'radio_check_label';
        label.textContent = opt.innerText || opt.label || opt.value || '';
        label.htmlFor = safeId;

        container.appendChild(input);
        container.appendChild(label);
      });
    }

    return container;
  }

  /**
   * Create radio group
   * @private
   */
  createRadioGroup(field) {
    const container = document.createElement('div');
    container.className = 'radio-group';

    if (Array.isArray(field.options)) {
      field.options.forEach((opt, index) => {
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = field.key;
        input.value = opt.value !== undefined ? opt.value : '';

        // Generate safe IDs
        const safeId = opt.attr?.id || `${field.key}_${index}`;
        input.id = safeId;

        if (opt.attr?.className) {
          input.className = opt.attr.className;
        }

        const label = document.createElement('label');
        label.className = 'radio_check_label';
        label.textContent = opt.innerText || opt.label || opt.value || '';
        label.htmlFor = safeId;

        container.appendChild(input);
        container.appendChild(label);
      });
    }

    return container;
  }

  /**
   * Create button element
   * @private
   */
  createButton(field) {
    const ele = document.createElement('button');
    ele.type = field.type;
    ele.textContent = field.attr?.value || field.type;
    this.applyAttributes(ele, field.attr);
    return ele;
  }

  /**
   * Create input element
   * @private
   */
  createInput(field) {
    const ele = document.createElement('input');
    ele.type = field.type || 'text';
    ele.name = field.key;
    this.applyAttributes(ele, field.attr);
    return ele;
  }

  /**
   * Append field to form with label
   * @private
   */
  appendFieldToForm(field, element) {
    if (field.label) {
      const wrapper = document.createElement('div');
      wrapper.className = 'form-field';

      const label = document.createElement('label');
      label.textContent = field.label;
      label.htmlFor = element.id || field.key;

      wrapper.appendChild(label);
      wrapper.appendChild(element);
      this.container.appendChild(wrapper);
    } else {
      this.container.appendChild(element);
    }
  }

  /**
   * Apply attributes to element safely
   * @private
   */
  applyAttributes(element, attr) {
    if (!attr || typeof attr !== 'object') {
      element.className = 'default_input';
      return;
    }

    // Set default class if not provided
    if (!attr.className) {
      element.className = 'default_input';
    }

    Object.keys(attr).forEach((key) => {
      const value = attr[key];

      // Skip functions and name (handled separately)
      if (typeof value === 'function' || key === 'name') return;

      switch (key) {
        case 'className':
          element.className = value;
          break;

        case 'required':
          if (value === true) {
            element.setAttribute('required', '');
          } else {
            element.removeAttribute('required');
          }
          break;

        case 'value':
          // Don't set value attribute for buttons
          break;

        default:
          // Sanitize string values
          if (typeof value === 'string') {
            element.setAttribute(key, value);
          } else if (typeof value === 'number' || typeof value === 'boolean') {
            element.setAttribute(key, String(value));
          }
          break;
      }
    });
  }

  /**
   * Update form with data
   * @param {Object} data - Data to populate form
   */
  updateForm(data) {
    if (!data || typeof data !== 'object') {
      console.warn('Form: Invalid data provided to updateForm');
      return;
    }

    this.fields.forEach((field) => {
      const value = data[field.key];
      if (value === undefined) return;

      const elements = this.container.querySelectorAll(`[name="${field.key}"]`);
      if (elements.length === 0) return;

      try {
        switch (field.type) {
          case 'select':
          case 'textarea':
            elements[0].value = value;
            break;

          case 'checkbox':
            const checkboxValues = Array.isArray(value) ? value : [value];
            elements.forEach((cb) => {
              cb.checked = checkboxValues.includes(cb.value);
            });
            break;

          case 'radio':
            elements.forEach((radio) => {
              radio.checked = radio.value === value;
            });
            break;

          default:
            elements[0].value = value;
            break;
        }
      } catch (error) {
        console.error(`Error updating field "${field.key}":`, error);
      }
    });
  }

  /**
   * Get form data as object
   * @returns {Object} Form data
   */
  getFormDataObject() {
    const formDataObject = new FormData(this.container);
    const data = {};

    // Process visible fields
    this.fields.forEach((field) => {
      const key = field.key;

      try {
        if (field.type === 'checkbox') {
          const values = formDataObject.getAll(key);
          data[key] = values.filter(v => v !== ''); // Filter empty values
        } else if (field.type !== 'submit' && field.type !== 'reset') {
          data[key] = formDataObject.get(key) || '';
        }
      } catch (error) {
        console.error(`Error getting data for field "${key}":`, error);
        data[key] = '';
      }
    });

    // Process hidden fields
    this.hiddenFields.forEach((field) => {
      try {
        if (typeof field.getValue === 'function') {
          data[field.key] = field.getValue(data);
        } else if (field.value !== undefined) {
          data[field.key] = field.value;
        }
      } catch (error) {
        console.error(`Error processing hidden field "${field.key}":`, error);
      }
    });

    return data;
  }

  /**
   * Attach form event handlers
   * @private
   */
  attachFormHandlers() {
    // Submit handler
    const submitHandler = (e) => {
      e.preventDefault();

      try {
        const data = this.getFormDataObject();

        if (this.editingId) {
          data.userId = this.editingId;
        }

        this.onSubmit(data);
        this.container.reset();
        this.editingId = null;
        this.formState = {};
      } catch (error) {
        console.error('Form submit error:', error);
        this.showMessage('An error occurred while submitting the form', 'error');
      }
    };

    // Reset handler
    const resetHandler = () => {
      this.editingId = null;
      this.formState = {};
      this.onReset();
    };

    this.container.addEventListener('submit', submitHandler);
    this.container.addEventListener('reset', resetHandler);

    // Track listeners for cleanup
    this.eventListeners.push(
      { element: this.container, event: 'submit', handler: submitHandler },
      { element: this.container, event: 'reset', handler: resetHandler }
    );
  }

  /**
   * Update form with data for editing
   * @param {Object} data - Data to edit
   */
  updateFormData(data) {
    if (!data || !data.userId) {
      console.warn('Form: Invalid data provided to updateFormData');
      return;
    }

    this.editingId = data.userId;
    this.updateForm(data);
  }

  /**
   * Show message to user
   * @param {string} message - Message text
   * @param {string} type - Message type ('success' or 'error')
   */
  showMessage(message, type = 'success') {
    if (!this.container.parentElement) return;

    // Remove existing message
    const existingMsg = this.container.parentElement.querySelector('.form-message');
    if (existingMsg) {
      existingMsg.remove();
    }

    // Create new message
    const msgDiv = document.createElement('div');
    msgDiv.className = `form-message form-message-${type}`;
    msgDiv.textContent = message;

    // Insert before form
    this.container.parentElement.insertBefore(msgDiv, this.container);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      if (msgDiv.parentElement) {
        msgDiv.remove();
      }
    }, 3000);
  }

  /**
   * Reset form to initial state
   */
  reset() {
    this.container.reset();
    this.editingId = null;
    this.formState = {};
  }

  /**
   * Destroy form and cleanup
   */
  destroy() {
    // Remove event listeners
    this.eventListeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });

    // Clear references
    this.eventListeners = [];
    this.formData = [];
    this.hiddenFields = [];
    this.fields = [];

    // Clear container
    if (this.container) {
      this.container.innerHTML = '';
    }
  }
}
