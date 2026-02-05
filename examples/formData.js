const formData = [
  {
    type: 'hidden',
    key: 'userId',
    label: 'User Id',
    unique: true,
    getValue: function (obj) {
      return obj.userId || Math.floor(100000 + Math.random() * 900000);
    },
  },
  {
    type: 'hidden',
    key: 'createdAt',
    label: 'Created At',
    getValue: function (obj) {
      return obj.createdAt || new Date().getTime();
    },
  },
  {
    type: 'text',
    label: 'Name',
    key: 'name',
    value: '',
    attr: {
      id: 'txtName1',
      className: 'form-control textInput',
      placeholder: 'Enter name',
      name: 'txtName',
      required: true,
      onchange: function () { },
    },
  },
  {
    type: 'email',
    label: 'Email',
    key: 'email',
    value: '',
    attr: {
      id: 'txtEmail',
      className: 'form-control textInput',
      placeholder: 'Enter email',
      name: 'txtName',
      required: true,
      onchange: function () { },
    },
  },
  {
    type: 'tel',
    label: 'Phone',
    key: 'phone',
    value: '',
    attr: {
      required: true,
    }
  },
  {
    type: 'textarea',
    label: 'Address',
    key: 'address',
    value: '',
    attr: {
      id: 'txtAddress',
      className: 'form-control textInput',
      placeholder: 'Enter Address',
      rows: '5',
      name: 'txtName',
      required: true,
      onchange: function () { },
    },
  },
  {
    type: 'text',
    label: 'Street Address',
    key: 'street_address',
    value: '',
    attr: {
      id: 'txtStreet',
      className: 'form-control textInput',
      placeholder: 'Enter Street Address',
      name: 'txtName',
      required: true,
      onchange: function () { },
    },
  },
  {
    type: 'text',
    label: 'City',
    key: 'city',
    value: '',
    attr: {
      id: 'txtCity',
      className: 'form-control textInput',
      placeholder: 'Enter City',
      name: 'txtName',
      required: true,
      onchange: function () { },
    },
  },
  {
    type: 'text',
    label: 'State',
    key: 'state',
    value: '',
    attr: {
      id: 'txtState',
      className: 'form-control textInput',
      placeholder: 'Enter State',
      name: 'txtName',
      required: true,
      onchange: function () { },
    },
  },
  {
    type: 'number',
    label: 'Pin Code',
    key: 'pin_code',
    value: '',
    attr: {
      id: 'txtPincode',
      className: 'form-control textInput',
      placeholder: 'Enter Pin Code',
      name: 'txtName',
      required: true,
      onchange: function () { },
    },
  },
  {
    type: 'select',
    label: 'Country',
    key: 'country',
    value: [],
    attr: {
      id: 'txtCountry',
      name: 'country',
      required: true,
      className: 'form-control columns',
      onchange: function () { },
    },
    options: [
      {
        innerText: 'Select Country',
        value: '',
      },
      {
        innerText: 'India',
        value: 'india',
      },
      {
        innerText: 'United States',
        value: 'united-states',
      },
      {
        innerText: 'Sri Lanka',
        value: 'sri-lanka',
      },
    ],
  },
  {
    type: 'radio',
    label: 'Gender',
    key: 'gender',
    value: '',
    options: [
      {
        innerText: 'Male',
        value: 'male',
        name: 'gender',
        attr: {
          id: 'male',
          className: 'form-check-input radioGender',
          required: true,
          onchange: function () { },
        },
      },
      {
        innerText: 'Female',
        value: 'female',
        name: 'gender',
        attr: {
          id: 'female',
          className: 'form-check-input radioGender',
          required: true,
          onchange: function () { },
        },
      },
    ],
  },
  {
    type: 'checkbox',
    label: 'Hobbies',
    key: 'hobbies',
    value: [],
    options: [
      {
        innerText: 'Swimming',
        value: 'swimming',
        name: 'hobbies',
        attr: {
          id: 'swimming',
          className: 'form-check-input radioHobbies',
          onchange: function () { },
        },
      },
      {
        innerText: 'Singing',
        value: 'singing',
        name: 'hobbies',
        attr: {
          id: 'singing',
          className: 'form-check-input radioHobbies',
          onchange: function () { },
        },
      },
      {
        innerText: 'Writing',
        value: 'writing',
        name: 'hobbies',
        attr: {
          id: 'writing',
          className: 'form-check-input radioHobbies',
          onchange: function () { },
        },
      },
    ],
  },
  {
    type: 'submit',
    attr: {
      id: 'btnSubmit',
      name: 'btnSubmit',
      className: 'btn btn-block btn-primary submit',
      value: 'Submit',
    },
  },
  {
    type: 'reset',
    attr: {
      id: 'btnReset',
      name: 'btnReset',
      className: 'btn btn-block btn-primary reset',
      value: 'Reset',
      onclick: function () { },
    },
  },
];
export default formData;
