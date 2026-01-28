export default class Storage {
  constructor(storageId) {
    this.storageId = storageId; // use this.storageId with localStorage as a unique key to store data
    // Pass storageId to save json string data after each operation in localStorage
    // local storageId is important to retrieve old saved data
    this.employees = this.loadFromStorage();
    
    window.addEventListener('storeData', (e)=> {
      this.add(e.detail);
      const tableEvent = new CustomEvent('table:render', { detail: this.employees });
      window.dispatchEvent(tableEvent);
    });


      // const sendEvent = new CustomEvent('SendData', { detail: this.employees });
      // window.dispatchEvent(sendEvent);
    // window.addEventListener('updateData', (e)=> {
    //   this.update(e.detail.id, e.detail);
    // });
    // window.addEventListener('deleteData', (e)=> {
    //   this.delete(e.detail);
    // });
  }


  loadFromStorage() {
  const data = localStorage.getItem(this.storageId);
  return data ? JSON.parse(data) : [];
}


  saveToStorage() {
    localStorage.setItem(this.storageId, JSON.stringify(this.employees));
  }
  // create methods to perform operations like save/edit/delete/add data
  getAll() {
  return [...this.employees];
  }


  add(record) {
    record.id = Date.now(); // unique id
    this.employees.push(record);
    this.saveToStorage();
  }

  update(id,updateData){
      this.employees = this.employees.map(emp =>
      emp.id === id ? { ...emp, ...updateData } : emp
    );
    this.saveToStorage();
  }

   delete(id) {
    this.employees = this.employees.filter(emp => emp.id !== id);
    this.saveToStorage();
  }

}
