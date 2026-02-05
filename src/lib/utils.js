export function sanitizeHTML(str) {
    if (typeof str !== 'string') return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

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

    if (['select', 'checkbox', 'radio'].includes(field.type)) {
        if (!Array.isArray(field.options) || field.options.length === 0) {
            console.warn(`Field type "${field.type}" requires options array`);
            return false;
        }
    }

    return true;
}

export function safeJSONParse(jsonString, defaultValue = null) {
    try {
        return JSON.parse(jsonString);
    } catch (error) {
        console.error('JSON parse error:', error);
        return defaultValue;
    }
}

export function validateStorageData(data) {
    if (!Array.isArray(data)) return false;

    return data.every(item => item && typeof item === 'object' && !Array.isArray(item));
}

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
