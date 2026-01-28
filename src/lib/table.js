export default class Table {
  constructor(tableContainerId) {
    this.container = document.getElementById(tableContainerId); // Use this container to create table inside of it
    // Pass tableContainerId to append table inside of HTML DIV element
    // console.log('Table');
    window.addEventListener('table:render', (e) => {
      console.log(e.detail);      
        this.render_Basic_Employee_Table(e.detail);
      console.log('this', this);
    })
  }
  // create methods/event to refresh table data,add data row, update data row, delete data row, etc
  render_Basic_Employee_Table(data) {
    const container = this.container;
    container.innerHTML = '';
    if(!container) {
      console.log('Table: container element not found');
    }
    
    const table = document.createElement('table');

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    const headers = ['Name', 'Email', 'Phone', 'Address','Street-Address', 'City', 'State','Pincode', 'Country','Gender','Hobbies'];

    headers.forEach((header) => {
      const th = document.createElement('th');
      th.innerText = header;
      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    data.forEach((emp) => {
      const row = document.createElement('tr');
      [
        emp.name,
        emp.email,
        emp.phone,
        emp.address,
        emp.street_address,
        emp.city,
        emp.state,
        emp.pin_code,
        emp.country,
        emp.gender,
        emp.hobbies.join(', ')
      ].forEach((value) => {
        const td = document.createElement('td');
        td.innerText = value;
        if(!value){
          td.innerText = ' - ';
        }
        row.appendChild(td);
      });
      // const td = document.createElement('td');

      tbody.appendChild(row);
    });

    const thaction = document.createElement('th');
    thaction.innerText = 'Action';
    thaction.classList.add('basic-view-action');
    headerRow.appendChild(thaction);

    table.appendChild(tbody);
    container.appendChild(table);
  }
}
