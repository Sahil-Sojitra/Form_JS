export default class Table {
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

        this.eventListeners = [];
    }

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

    sanitizeCellValue(value) {
        if (value === null || value === undefined || value === '') {
            return '-';
        }

        if (Array.isArray(value)) {
            return value.join(', ') || '-';
        }

        if (typeof value === 'object') {
            return JSON.stringify(value);
        }

        const stringValue = String(value);
        const maxLength = 100;

        if (stringValue.length > maxLength) {
            return stringValue.substring(0, maxLength) + '...';
        }

        return stringValue;
    }

    render(data) {
        try {
            this.cleanup();

            if (!Array.isArray(data)) {
                console.error('Table: Data must be an array');
                this.hideTable();
                return;
            }

            if (data.length === 0) {
                this.hideTable();
                return;
            }

            this.showTable();

            const table = this.createTable(data);

            this.container.appendChild(table);
        } catch (error) {
            console.error('Table render error:', error);
            this.container.innerHTML = '<p class="error-message">Error rendering table</p>';
        }
    }

    createTable(data) {
        const wrapper = document.createElement('div');
        wrapper.className = 'table-wrapper';

        const header = document.createElement('div');
        header.className = 'table-header';
        const count = document.createElement('h3');
        count.textContent = `Total Items: ${data.length}`;
        header.appendChild(count);
        wrapper.appendChild(header);

        const table = document.createElement('table');
        table.className = 'data-table';

        const headers = this.getHeaders(data[0]);

        const thead = this.createTableHead(headers);
        table.appendChild(thead);

        const tbody = this.createTableBody(data, headers);
        table.appendChild(tbody);

        wrapper.appendChild(table);
        return wrapper;
    }

    getHeaders(firstRow) {
        if (!firstRow || typeof firstRow !== 'object') {
            return [];
        }

        const excludeFields = ['id', 'userId', 'createdAt'];

        return Object.keys(firstRow).filter(key => !excludeFields.includes(key));
    }

    createTableHead(headers) {
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');

        headers.forEach((key) => {
            const th = document.createElement('th');
            th.textContent = this.formatHeaderName(key);
            th.setAttribute('data-key', key);
            headerRow.appendChild(th);
        });

        const thAction = document.createElement('th');
        thAction.textContent = 'Actions';
        thAction.className = 'action-column';
        headerRow.appendChild(thAction);

        thead.appendChild(headerRow);
        return thead;
    }

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

    createTableRow(rowData, headers, index) {
        const row = document.createElement('tr');
        row.setAttribute('data-index', index);

        headers.forEach((header) => {
            const td = document.createElement('td');
            td.textContent = this.sanitizeCellValue(rowData[header]);
            td.setAttribute('data-key', header);
            row.appendChild(td);
        });

        const actionTd = document.createElement('td');
        actionTd.className = 'action-cell';

        const actionButtons = this.createActionButtons(rowData);
        actionButtons.forEach(btn => actionTd.appendChild(btn));

        row.appendChild(actionTd);

        return row;
    }

    createActionButtons(rowData) {
        const buttons = [];

        const updateBtn = document.createElement('button');
        updateBtn.textContent = 'Edit';
        updateBtn.className = 'up_btn';
        updateBtn.setAttribute('type', 'button');
        updateBtn.setAttribute('aria-label', 'Edit record');

        const updateHandler = (e) => {
            e.preventDefault();
            e.stopPropagation();

            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });

            this.onUpdate(rowData);
        };

        updateBtn.addEventListener('click', updateHandler);
        this.eventListeners.push({ element: updateBtn, event: 'click', handler: updateHandler });
        buttons.push(updateBtn);

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

    showTable() {
        const tableSection = document.querySelector('.tableSection');
        if (tableSection) {
            tableSection.style.display = 'block';
        }
    }

    hideTable() {
        const tableSection = document.querySelector('.tableSection');
        if (tableSection) {
            tableSection.style.display = 'none';
        }
        this.container.innerHTML = '';
    }

    cleanup() {
        this.eventListeners.forEach(({ element, event, handler }) => {
            if (element) {
                element.removeEventListener(event, handler);
            }
        });

        this.eventListeners = [];

        this.container.innerHTML = '';
    }

    destroy() {
        this.cleanup();
        this.hideTable();
    }
}
