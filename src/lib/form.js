export default class Form {
  constructor(formContainerId, formData) {
    this.container = document.getElementById(formContainerId);
    //Container element from HTML in which you have to add form
    // Pass formContainerId to append form element inside of HTML DIV element
    // use formData to create form
    this.formData = formData;
    // form element for storing the form in the formContainerid
    this.formEl = null ;
    // form state
    this.formState = {};
    // hidden type fields
    this.hiddenFields = [];
    // fields which are not hidden
    this.fields = [];

    this.initialize();
    // console.log('Form', formData);
  }
  // create methods/event to create form/ reset form/ submit form, etc

  // initalize the form part
  initialize() {
    this.validateInputs();
    this.saperateFormField();
    this.createForm();
    this.loopingFields();
    this.bindFormSubmit();
  }
  // validation for the form data and the container in which we add the html form
  validateInputs() {
    if (!this.container) {
      console.log('Form: container element not found');
    }

    if (!Array.isArray(this.formData)) {
      console.log('Form: formData must be an array');
    }
  }


  saperateFormField(){
    this.formData.forEach(ele=> {
      if(ele.type === 'hidden'){
        this.hiddenFields.push(ele);
      }else{
        this.fields.push(ele);
      }
    });
  }

  createForm(){
    this.formEl = document.createElement('form');
    this.formEl.noValidate = false;
    this.container.appendChild(this.formEl);
  }

  loopingFields(){
    this.fields.forEach(field => {
      this.formEl.appendChild(this.loopField(field));
    });
  }

  loopField(field){
    let ele;
    switch (field.type) {
      case 'text':
      ele=document.createElement('input');
      ele.type = field.type;
      this.initState(field, field.value || '');
      break;

      case 'email':
      ele=document.createElement('input');
      ele.type = field.type;
      this.initState(field, field.value || '');
      break;

      case 'number':
      ele=document.createElement('input');
      ele.type = field.type;
      this.initState(field, field.value || '');
      break;

      case 'tel':
      ele=document.createElement('input');
      ele.type = field.type;
      this.initState(field, field.value || '');
      break;

      case 'textarea':
      ele=document.createElement('textarea');
      this.initState(field, field.value || '');
      break;
    }
  }


  initState(field , initialValue){
    if(this.formState[field.name] === undefined){
      this.formState[field.name] = initialValue;
    }
  }
}
