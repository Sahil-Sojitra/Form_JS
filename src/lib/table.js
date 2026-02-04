/**
 * Table class for data rendering
 * @class
 */
export default class Table {
    /**
     * Create a Table instance
     * @param {string} tableContainerId - ID of the table container element
     * @param {Object} callbacks - Callback functions {onUpdate, onDelete}
     */
    constructor(tableContainerId, callbacks = {}) {
        if (!tableContainerId || typeof tableContainerId !== 'string') {
            throw new Error('Table: tableContainerId must be a non-empty string');
        }

        this.container = document.getElementById(tableContainerId);

        if (!this.container) {
            throw new Error(`Table: Container element with ID "${tableContainerId}" not found`);
        }

        this.onUpdate = typeof callbacks.onUpdate === 'function' ? callbacks.onUpdate : () => { };
        this.onDelete = typeof callbacks.onDelete === 'function' ? callbacks.onDelete : () => { };

        this.eventListeners = []; // Track event listeners for cleanup
    }

    /**
     * Format header name from snake_case to Title Case
     * @param {string} key - Key to format
     * @returns {string} Formatted header name
     */
    formatHeaderName(key) {
        if (typeof key !== 'string') return '';

        return key
            .split('_')
            .map(word => {
                if (!word) return '';
                return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            })
            .join(' ');
    }

    /**
     * Sanitize cell value for display
     * @private
     * @param {*} value - Value to sanitize
     * @returns {string} Sanitized value
     */
    sanitizeCellValue(value) {
        if (value === null || value === undefined || value === '') {
            return '-';
        }

        // Handle arrays (for checkbox values)
        if (Array.isArray(value)) {
            return value.join(', ') || '-';
        }

        // Handle objects
        if (typeof value === 'object') {
            return JSON.stringify(value);
        }

        // Convert to string and limit length
        const stringValue = String(value);
        const maxLength = 100;

        if (stringValue.length > maxLength) {
            return stringValue.substring(0, maxLength) + '...';
        }

        return stringValue;
    }

    /**
     * Render table with data
     * @param {Array} data - Array of data objects to render
     */
    render(data) {
        try {
            // Clear existing content and listeners
            this.cleanup();

            // Validate input
            if (!Array.isArray(data)) {
                console.error('Table: Data must be an array');
                this.hideTable();
                return;
            }

            if (data.length === 0) {
                this.hideTable();
                return;
            }

            // Show table section
            this.showTable();

            // Create table elements
            const table = this.createTable(data);

            // Append to container
            this.container.appendChild(table);
        } catch (error) {
            console.error('Table render error:', error);
            this.container.innerHTML = '<p class="error-message">Error rendering table</p>';
        }
    }

    /**
     * Create table element
     * @private
     * @param {Array} data - Data to render
     * @returns {HTMLElement} Table container
     */
    createTable(data) {
        const wrapper = document.createElement('div');
        wrapper.className = 'table-wrapper';

        // Add count header
        const header = document.createElement('div');
        header.className = 'table-header';
        const count = document.createElement('h3');
        count.textContent = `Total Items: ${data.length}`;
        header.appendChild(count);
        wrapper.appendChild(header);

        // Create table
        const table = document.createElement('table');
        table.className = 'data-table';

        // Get headers from first row
        const headers = this.getHeaders(data[0]);

        // Create thead
        const thead = this.createTableHead(headers);
        table.appendChild(thead);

        // Create tbody
        const tbody = this.createTableBody(data, headers);
        table.appendChild(tbody);

        wrapper.appendChild(table);
        return wrapper;
    }

    /**
     * Get headers from data object
     * @private
     * @param {Object} firstRow - First data row
     * @returns {Array} Array of header keys
     */
    getHeaders(firstRow) {
        if (!firstRow || typeof firstRow !== 'object') {
            return [];
        }

        // Exclude certain fields from display
        const excludeFields = ['id', 'userId', 'createdAt'];

        return Object.keys(firstRow).filter(key => !excludeFields.includes(key));
    }

    /**
     * Create table head
     * @private
     * @param {Array} headers - Array of header keys
     * @returns {HTMLElement} Table head element
     */
    createTableHead(headers) {
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');

        // Add data headers
        headers.forEach((key) => {
            const th = document.createElement('th');
            th.textContent = this.formatHeaderName(key);
            th.setAttribute('data-key', key);
            headerRow.appendChild(th);
        });

        // Add action header
        const thAction = document.createElement('th');
        thAction.textContent = 'Actions';
        thAction.className = 'action-column';
        headerRow.appendChild(thAction);

        thead.appendChild(headerRow);
        return thead;
    }

    /**
     * Create table body
     * @private
     * @param {Array} data - Data array
     * @param {Array} headers - Header keys
     * @returns {HTMLElement} Table body element
     */
    createTableBody(data, headers) {
        const tbody = document.createElement('tbody');

        data.forEach((rowData, index) => {
            try {
                const row = this.createTableRow(rowData, headers, index);
                tbody.appendChild(row);
            } catch (error) {
                console.error(`Error creating row ${index}:`, error);
            }
        });

        return tbody;
    }

    /**
     * Create a table row
     * @private
     * @param {Object} rowData - Row data object
     * @param {Array} headers - Header keys
     * @param {number} index - Row index
     * @returns {HTMLElement} Table row element
     */
    createTableRow(rowData, headers, index) {
        const row = document.createElement('tr');
        row.setAttribute('data-index', index);

        // Add data cells
        headers.forEach((header) => {
            const td = document.createElement('td');
            td.textContent = this.sanitizeCellValue(rowData[header]);
            td.setAttribute('data-key', header);
            row.appendChild(td);
        });

        // Add action cell
        const actionTd = document.createElement('td');
        actionTd.className = 'action-cell';

        const actionButtons = this.createActionButtons(rowData);
        actionButtons.forEach(btn => actionTd.appendChild(btn));

        row.appendChild(actionTd);

        return row;
    }

    /**
     * Create action buttons
     * @private
     * @param {Object} rowData - Row data
     * @returns {Array} Array of button elements
     */
    createActionButtons(rowData) {
        const buttons = [];

        // Update button
        const updateBtn = document.createElement('button');
        updateBtn.textContent = 'Edit';
        updateBtn.className = 'up_btn';
        updateBtn.setAttribute('type', 'button');
        updateBtn.setAttribute('aria-label', 'Edit record');

        const updateHandler = (e) => {
            e.preventDefault();
            e.stopPropagation();

            // Scroll to top
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });

            this.onUpdate(rowData);
        };

        updateBtn.addEventListener('click', updateHandler);
        this.eventListeners.push({ element: updateBtn, event: 'click', handler: updateHandler });
        buttons.push(updateBtn);

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'del_btn';
        deleteBtn.setAttribute('type', 'button');
        deleteBtn.setAttribute('aria-label', 'Delete record');

        const deleteHandler = (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (rowData.userId !== undefined && rowData.userId !== null) {
                this.onDelete(rowData.userId);
            } else {
                console.error('Table: Cannot delete - userId not found');
            }
        };

        deleteBtn.addEventListener('click', deleteHandler);
        this.eventListeners.push({ element: deleteBtn, event: 'click', handler: deleteHandler });
        buttons.push(deleteBtn);

        return buttons;
    }

    /**
     * Show table section
     * @private
     */
    showTable() {
        const tableSection = document.querySelector('.tableSection');
        if (tableSection) {
            tableSection.style.display = 'block';
        }
    }

    /**
     * Hide table section
     * @private
     */
    hideTable() {
        const tableSection = document.querySelector('.tableSection');
        if (tableSection) {
            tableSection.style.display = 'none';
        }
        this.container.innerHTML = '';
    }

    /**
     * Cleanup event listeners and content
     * @private
     */
    cleanup() {
        // Remove event listeners
        this.eventListeners.forEach(({ element, event, handler }) => {
            if (element) {
                element.removeEventListener(event, handler);
            }
        });

        this.eventListeners = [];

        // Clear container
        this.container.innerHTML = '';
    }

    /**
     * Destroy table and cleanup
     */
    destroy() {
        this.cleanup();
        this.hideTable();
    }

    /**
     * Refresh table with same data
     */
    refresh() {
        // This method can be called if needed to re-render
        console.log('Table: Refresh called - use render() with new data instead');
    }
}
