import { safeJSONParse, validateStorageData, deepClone } from './utils.js';

/**
 * Storage class for localStorage management
 * @class
 */
export default class Storage {
    /**
     * Create a Storage instance
     * @param {string} storageId - localStorage key
     * @param {Object} callbacks - Callback functions {onDataChange}
     */
    constructor(storageId, callbacks = {}) {
        if (!storageId || typeof storageId !== 'string') {
            throw new Error('Storage: storageId must be a non-empty string');
        }

        this.storageId = storageId;
        this.employees = [];
        this.onDataChange = typeof callbacks.onDataChange === 'function' ? callbacks.onDataChange : () => { };

        this.initialize();
    }

    /**
     * Initialize storage
     * @private
     */
    initialize() {
        try {
            this.employees = this.loadFromStorage();
        } catch (error) {
            console.error('Storage initialization error:', error);
            this.employees = [];
        }
    }

    /**
     * Load data from localStorage with validation
     * @returns {Array} Stored data or empty array
     */
    loadFromStorage() {
        try {
            const data = localStorage.getItem(this.storageId);

            if (!data) {
                return [];
            }

            const parsed = safeJSONParse(data, []);

            // Validate data structure
            if (!validateStorageData(parsed)) {
                console.warn('Storage: Invalid data structure detected, resetting to empty array');
                return [];
            }

            return parsed;
        } catch (error) {
            console.error('Storage: Error loading from localStorage:', error);
            return [];
        }
    }

    /**
     * Save data to localStorage with error handling
     * @returns {boolean} Success status
     */
    saveToStorage() {
        try {
            const jsonString = JSON.stringify(this.employees);
            localStorage.setItem(this.storageId, jsonString);
            return true;
        } catch (error) {
            // Handle quota exceeded error
            if (error.name === 'QuotaExceededError') {
                console.error('Storage: localStorage quota exceeded');
                this.handleQuotaExceeded();
            } else {
                console.error('Storage: Error saving to localStorage:', error);
            }
            return false;
        }
    }

    /**
     * Handle quota exceeded situation
     * @private
     */
    handleQuotaExceeded() {
        // Could implement cleanup strategy here
        console.warn('Storage: Consider reducing data or implementing pagination');
    }

    /**
     * Get all employee data (returns copy to prevent direct mutation)
     * @returns {Array} Copy of employee data
     */
    getAllEmployeeData() {
        return deepClone(this.employees);
    }

    /**
     * Add employee data with validation
     * @param {Object} employeeData - Employee data to add
     * @returns {boolean} Success status
     */
    addEmployeeData(employeeData) {
        if (!employeeData || typeof employeeData !== 'object') {
            console.error('Storage: Invalid employee data provided');
            return false;
        }

        try {
            // Create a clean copy
            const cleanData = deepClone(employeeData);

            this.employees.push(cleanData);

            if (this.saveToStorage()) {
                this.onDataChange(this.getAllEmployeeData());
                return true;
            }

            // Rollback on save failure
            this.employees.pop();
            return false;
        } catch (error) {
            console.error('Storage: Error adding employee data:', error);
            return false;
        }
    }

    /**
     * Delete employee data by userId
     * @param {string|number} userId - User ID to delete
     * @returns {boolean} Success status
     */
    deleteEmployeeData(userId) {
        if (userId === undefined || userId === null) {
            console.error('Storage: Invalid userId provided for deletion');
            return false;
        }

        try {
            const originalLength = this.employees.length;
            const originalData = [...this.employees];

            this.employees = this.employees.filter((emp) => emp.userId !== userId);

            // Check if any record was deleted
            if (this.employees.length === originalLength) {
                console.warn(`Storage: No employee found with userId: ${userId}`);
                return false;
            }

            if (this.saveToStorage()) {
                this.onDataChange(this.getAllEmployeeData());
                return true;
            }

            // Rollback on save failure
            this.employees = originalData;
            return false;
        } catch (error) {
            console.error('Storage: Error deleting employee data:', error);
            return false;
        }
    }

    /**
     * Update employee data
     * @param {Object} employeeData - Updated employee data
     * @returns {boolean} Success status
     */
    updateEmployeeData(employeeData) {
        if (!employeeData || typeof employeeData !== 'object' || !employeeData.userId) {
            console.error('Storage: Invalid employee data provided for update');
            return false;
        }

        try {
            const index = this.employees.findIndex((emp) => emp.userId === employeeData.userId);

            if (index === -1) {
                console.warn(`Storage: No employee found with userId: ${employeeData.userId}`);
                return false;
            }

            const originalData = this.employees[index];
            const cleanData = deepClone(employeeData);

            this.employees[index] = cleanData;

            if (this.saveToStorage()) {
                this.onDataChange(this.getAllEmployeeData());
                return true;
            }

            // Rollback on save failure
            this.employees[index] = originalData;
            return false;
        } catch (error) {
            console.error('Storage: Error updating employee data:', error);
            return false;
        }
    }

    /**
     * Find employee by userId
     * @param {string|number} userId - User ID to find
     * @returns {Object|null} Employee data or null
     */
    findById(userId) {
        if (userId === undefined || userId === null) {
            return null;
        }

        const employee = this.employees.find((emp) => emp.userId === userId);
        return employee ? deepClone(employee) : null;
    }

    /**
     * Clear all data
     * @returns {boolean} Success status
     */
    clear() {
        try {
            this.employees = [];
            localStorage.removeItem(this.storageId);
            this.onDataChange([]);
            return true;
        } catch (error) {
            console.error('Storage: Error clearing data:', error);
            return false;
        }
    }

    /**
     * Get storage size in bytes
     * @returns {number} Size in bytes
     */
    getSize() {
        try {
            const data = localStorage.getItem(this.storageId);
            return data ? new Blob([data]).size : 0;
        } catch (error) {
            console.error('Storage: Error calculating size:', error);
            return 0;
        }
    }

    /**
     * Export data as JSON string
     * @returns {string} JSON string
     */
    exportData() {
        try {
            return JSON.stringify(this.employees, null, 2);
        } catch (error) {
            console.error('Storage: Error exporting data:', error);
            return '[]';
        }
    }

    /**
     * Import data from JSON string
     * @param {string} jsonString - JSON string to import
     * @returns {boolean} Success status
     */
    importData(jsonString) {
        try {
            const data = safeJSONParse(jsonString, null);

            if (!validateStorageData(data)) {
                console.error('Storage: Invalid data format for import');
                return false;
            }

            const originalData = [...this.employees];
            this.employees = data;

            if (this.saveToStorage()) {
                this.onDataChange(this.getAllEmployeeData());
                return true;
            }

            // Rollback on failure
            this.employees = originalData;
            return false;
        } catch (error) {
            console.error('Storage: Error importing data:', error);
            return false;
        }
    }
}
