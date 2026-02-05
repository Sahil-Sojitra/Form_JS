import { safeJSONParse, validateStorageData, deepClone } from './utils.js';

export default class Storage {
    constructor(storageId, callbacks = {}) {
        if (!storageId || typeof storageId !== 'string') {
            throw new Error('Storage: storageId must be a non-empty string');
        }

        this.storageId = storageId;
        this.employees = [];
        this.onDataChange = typeof callbacks.onDataChange === 'function' ? callbacks.onDataChange : () => { };

        this.initialize();
    }

    initialize() {
        try {
            this.employees = this.loadFromStorage();
        } catch (error) {
            console.error('Storage initialization error:', error);
            this.employees = [];
        }
    }

    loadFromStorage() {
        try {
            const data = localStorage.getItem(this.storageId);

            if (!data) {
                return [];
            }

            const parsed = safeJSONParse(data, []);

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

    saveToStorage() {
        try {
            const jsonString = JSON.stringify(this.employees);
            localStorage.setItem(this.storageId, jsonString);
            return true;
        } catch (error) {
            if (error.name === 'QuotaExceededError') {
                console.error('Storage: localStorage quota exceeded');
                this.handleQuotaExceeded();
            } else {
                console.error('Storage: Error saving to localStorage:', error);
            }
            return false;
        }
    }

    handleQuotaExceeded() {
        console.warn('Storage: Consider reducing data or implementing pagination');
    }

    getAllEmployeeData() {
        return deepClone(this.employees);
    }

    addEmployeeData(employeeData) {
        if (!employeeData || typeof employeeData !== 'object') {
            console.error('Storage: Invalid employee data provided');
            return false;
        }

        try {
            const cleanData = deepClone(employeeData);

            this.employees.push(cleanData);

            if (this.saveToStorage()) {
                this.onDataChange(this.getAllEmployeeData());
                return true;
            }

            this.employees.pop();
            return false;
        } catch (error) {
            console.error('Storage: Error adding employee data:', error);
            return false;
        }
    }

    deleteEmployeeData(userId) {
        if (userId === undefined || userId === null) {
            console.error('Storage: Invalid userId provided for deletion');
            return false;
        }

        try {
            const originalLength = this.employees.length;
            const originalData = [...this.employees];

            this.employees = this.employees.filter((emp) => emp.userId !== userId);

            if (this.employees.length === originalLength) {
                console.warn(`Storage: No employee found with userId: ${userId}`);
                return false;
            }

            if (this.saveToStorage()) {
                this.onDataChange(this.getAllEmployeeData());
                return true;
            }

            this.employees = originalData;
            return false;
        } catch (error) {
            console.error('Storage: Error deleting employee data:', error);
            return false;
        }
    }

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

            this.employees[index] = originalData;
            return false;
        } catch (error) {
            console.error('Storage: Error updating employee data:', error);
            return false;
        }
    }

    findById(userId) {
        if (userId === undefined || userId === null) {
            return null;
        }

        const employee = this.employees.find((emp) => emp.userId === userId);
        return employee ? deepClone(employee) : null;
    }

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

    getSize() {
        try {
            const data = localStorage.getItem(this.storageId);
            return data ? new Blob([data]).size : 0;
        } catch (error) {
            console.error('Storage: Error calculating size:', error);
            return 0;
        }
    }

    exportData() {
        try {
            return JSON.stringify(this.employees, null, 2);
        } catch (error) {
            console.error('Storage: Error exporting data:', error);
            return '[]';
        }
    }

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

            this.employees = originalData;
            return false;
        } catch (error) {
            console.error('Storage: Error importing data:', error);
            return false;
        }
    }
}
