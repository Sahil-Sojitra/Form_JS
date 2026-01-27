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
    this.getFormDataObject();
    // this.bindFormSubmit();
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
      const el = this.loopField(field);
      if (el){
      this.formEl.appendChild(el);
      }
    });
  }

  loopField(field){
    let ele;
    switch (field.type) {
      case 'text':
      ele=document.createElement('input');
      ele.type = field.type;
      ele.name = field.key;
      this.initState(field, field.value || '');
      break;

      case 'email':
      ele=document.createElement('input');
      ele.type = field.type;
      ele.name = field.key;
      this.initState(field, field.value || '');
      break;

      case 'number':
      ele=document.createElement('input');
      ele.type = field.type;
      ele.name = field.key;
      this.initState(field, field.value || '');
      break;

      case 'tel':
      ele=document.createElement('input');
      ele.type = field.type;
      ele.name = field.key;
      this.initState(field, field.value || '');
      break;

      case 'textarea':
      ele=document.createElement('textarea');
      this.initState(field, field.value || '');
      break;

      case 'select':
      ele = document.createElement('select');
      field.options.forEach(opt => {
        const option = document.createElement('option');
        option.innerText = opt.innerText;
        option.value = opt.value;
        ele.appendChild(option);
      }) 
      this.initState(field, field.value || '');
      break;

      case 'checkbox':
        ele = document.createElement('div');
        this.formState[field.key] = field.value || [];
        field.options.forEach(opt => {
          const input = document.createElement('input');
          input.type = 'checkbox';
          input.value = opt.value;
          // input.id = opt.attr.id;
          input.name = opt.name;

          input.addEventListener('change' , (e)=>{
            const arr = this.formState[field.key];
            if(e.target.checked){
              arr.push(opt.value);
            }
            else this.formState[field.key] = arr.filter(v => v !== opt.value);
            console.log(this.formState);
          })
          const label = document.createElement('label');
          label.innerText = opt.innerText;
          label.htmlFor = opt.value;
          ele.appendChild(input);
          ele.appendChild(label);
        });
        break;

      case 'radio' :
        ele = document.createElement('div');
        this.formState[field.key] = field.value || '';
        field.options.forEach(opt => {
          const input = document.createElement('input');
          input.type = 'radio';
          input.value = opt.value;
          // input.id = opt.attr.id;
          input.name = opt.name;

          input.addEventListener('change' , (e)=>{
            this.formState[field.key] = e.target.value;
            console.log(this.formState);
          })

          const label = document.createElement('label');
          label.innerText = opt.innerText;
          label.htmlFor = opt.value;
          ele.appendChild(input);
          ele.appendChild(label);
        });
        break;

        case 'submit':
        case 'reset':
        ele = document.createElement('button');
        ele.type = field.type;
        ele.textContent = field.value;
        break;

      default:
        break;
    }

    if (field.attr) {
      this.applyAttributes(ele, field.attr);
    }
    this.bindInput(ele, field);
    return ele;
  }


  initState(field , initialValue){
    const k = field.key || field.name;
    if (!k) return;

    if (this.formState[k] === undefined) {
      this.formState[k] = initialValue;
    }
  }

  applyAttributes(ele, attr) {
    if(!ele ||!attr) return;
    else{
    Object.entries(attr).forEach(([key, value]) => {
      if (key.startsWith('on') && typeof value === 'function') {
        console.log(ele[key] = value);
      } else {
        console.log(ele[key] = value);
      }
    });
    }
  }

  bindInput(ele,field){
    const k = field.key || field.name;
    if (!k || !ele) return;

    ele.addEventListener('input', e => {
      this.formState[k] = e.target.value;
      console.log(this.formState);
    });
  }

  getFormDataObject(){
    console.log(this.formState); 
  }

}
