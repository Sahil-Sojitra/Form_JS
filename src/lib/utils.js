/**
 * Utility functions for security and validation
 * @module utils
 */

/**
 * Sanitizes HTML to prevent XSS attacks
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
export function sanitizeHTML(str) {
    if (typeof str !== 'string') return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/**
 * Validates field configuration object
 * @param {Object} field - Field configuration
 * @returns {boolean} True if valid
 */
export function validateFieldConfig(field) {
    if (!field || typeof field !== 'object') return false;
    if (!field.type || typeof field.type !== 'string') return false;
    if (!field.key || typeof field.key !== 'string') return false;

    const validTypes = ['text', 'email', 'tel', 'password', 'number', 'date', 'datetime-local',
        'time', 'url', 'search', 'textarea', 'select', 'checkbox', 'radio', 'hidden', 'submit', 'reset'];

    if (!validTypes.includes(field.type)) {
        console.warn(`Invalid field type: ${field.type}`);
        return false;
    }

    // Validate options for select, checkbox, radio
    if (['select', 'checkbox', 'radio'].includes(field.type)) {
        if (!Array.isArray(field.options) || field.options.length === 0) {
            console.warn(`Field type "${field.type}" requires options array`);
            return false;
        }
    }

    return true;
}

/**
 * Safely parse JSON with error handling
 * @param {string} jsonString - JSON string to parse
 * @param {*} defaultValue - Default value if parsing fails
 * @returns {*} Parsed value or default
 */
export function safeJSONParse(jsonString, defaultValue = null) {
    try {
        return JSON.parse(jsonString);
    } catch (error) {
        console.error('JSON parse error:', error);
        return defaultValue;
    }
}

/**
 * Validates localStorage data structure
 * @param {*} data - Data to validate
 * @returns {boolean} True if valid
 */
export function validateStorageData(data) {
    if (!Array.isArray(data)) return false;

    // Check if all items are objects
    return data.every(item => item && typeof item === 'object' && !Array.isArray(item));
}

/**
 * Debounce function to limit execution rate
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Deep clone an object safely
 * @param {*} obj - Object to clone
 * @returns {*} Cloned object
 */
export function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => deepClone(item));
    if (obj instanceof Object) {
        const clonedObj = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                clonedObj[key] = deepClone(obj[key]);
            }
        }
        return clonedObj;
    }
}
