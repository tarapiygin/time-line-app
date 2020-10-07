import locationValidation from './utils';

export default class LocationFormWidget {
  constructor() {
    this.container = document.querySelector('.location-form-container');
    this.form = this.container.querySelector('.location-form');
    this.resetBtn = this.form.querySelector('.location-form_reset-btn');
    this.submitBtn = this.form.querySelector('.location-form_submit-btn');
    this.submitFormListener = null;

    this.registerEvents();
  }

  showForm(coordinates = '') {
    this.form.elements.coordinates.value = coordinates;
    this.container.classList.remove('hidden');
  }

  hideForm() {
    this.hideErrors();
    this.container.classList.add('hidden');
  }

  vildate() {
    this.hideErrors();
    if (this.form.elements.coordinates.value === '') {
      this.errors.push({
        key: 'coordinates',
        text: 'Поле не может быть пустым',
      });
      return false;
    }
    if (!locationValidation(this.form.elements.coordinates.value)) {
      this.errors.push({
        key: 'coordinates',
        text: `Укажите коордианты в одном из форматов:
        1) 51.50851, -0.12572
        2) 51.50851,-0.12572
        3) [51.50851, -0.12572]`,
      });
      return false;
    }
    return true;
  }

  showErrors() {
    this.errors.forEach((error) => {
      const errorEl = document.createElement('div');
      errorEl.classList.add('location-form_error');
      errorEl.innerText = error.text;
      this.form.elements[error.key].after(errorEl);
    });
  }

  hideErrors() {
    this.errors = [];
    const errorsEl = this.form.querySelectorAll('.location-form_error');
    errorsEl.forEach((element) => element.remove());
  }

  onSubmitForm(event) {
    event.preventDefault();
    if (this.vildate()) {
      const { coordinates } = this.form.elements;
      this.hideForm();
      this.submitFormListener.call(null, coordinates.value);
    } else this.showErrors();
  }

  onClickResetForm() {
    this.hideForm();
  }

  registerEvents() {
    this.form.addEventListener('submit', this.onSubmitForm.bind(this));
    this.resetBtn.addEventListener('click', this.onClickResetForm.bind(this));
  }
}
