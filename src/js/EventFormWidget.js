export default class EventFormWidget {
  constructor() {
    this.container = document.querySelector('.event-form-container');
    this.videoPrevContainer = this.container.querySelector('.event-form_video-preview-container');
    this.videoPrev = this.videoPrevContainer.querySelector('.video-preview');
    this.form = this.container.querySelector('.event-form');
    this.textInput = this.form.querySelector('.event-form_text-input');
    this.createBtnContainer = this.form.querySelector('.event-form_create-buttons');
    this.audioBtn = this.createBtnContainer.querySelector('.event-form_audio-btn');
    this.videoBtn = this.createBtnContainer.querySelector('.event-form_video-btn');
    this.controlBtnContainer = this.form.querySelector('.event-form_control-buttons');
    this.controlInfo = this.controlBtnContainer.querySelector('.event-form_control-info');
    this.resetBtn = this.controlBtnContainer.querySelector('.event-form_reset-btn');
    this.submitBtn = this.controlBtnContainer.querySelector('.event-form_submit-btn');
    this.state = 'create';
    this.resetListeners = [];
    this.submitListeners = [];
    this.createAudioListeners = [];
    this.createVideoListeners = [];
    this.createTextListeners = [];
    this.inputTextListeners = [];

    this.registerEvents();
  }

  toggleControlState(info = '') {
    this.createBtnContainer.classList.add('hidden');
    this.controlBtnContainer.classList.remove('hidden');
    this.controlInfo.innerText = info;
    this.state = 'control';
  }

  toggleCreateState() {
    this.createBtnContainer.classList.remove('hidden');
    this.controlBtnContainer.classList.add('hidden');
    this.state = 'create';
  }

  vildate() {
    this.hideErrors();
    if (this.form.elements.text.value === '') {
      this.errors.push({
        key: 'text',
        text: 'Поле не может быть пустым',
      });
      return false;
    }
    return true;
  }

  showVideoPreview(stream) {
    this.videoPrevContainer.classList.remove('hidden');
    this.videoPrev.srcObject = stream;
    this.videoPrev.play();
  }

  hideVideoPreview() {
    this.videoPrevContainer.classList.add('hidden');
    this.videoPrev.srcObject = null;
  }

  addCreateTextListener(callback) {
    this.createTextListeners.push(callback);
  }

  addCreateAudioListener(callback) {
    this.createAudioListeners.push(callback);
  }

  addCreateVideoListener(callback) {
    this.createVideoListeners.push(callback);
  }

  addResetListener(callback) {
    this.resetListeners.push(callback);
  }

  addSubmitListener(callback) {
    this.submitListeners.push(callback);
  }

  addInputTextListener(callback) {
    this.inputTextListeners.push(callback);
  }

  onSubmit(e) {
    e.preventDefault();
    if (this.textInput.value !== '') {
      this.createTextListeners.forEach((o) => o.call(null, this.textInput.value));
      this.textInput.value = '';
      this.toggleCreateState();
      return;
    }
    this.submitListeners.forEach((o) => o.call(null));
  }

  onReset(e) {
    e.preventDefault();
    if (this.textInput.value !== '') {
      this.textInput.value = '';
    } else {
      this.resetListeners.forEach((o) => o.call(null));
    }
    this.toggleCreateState();
  }

  onCreateAudio(e) {
    e.preventDefault();
    this.createAudioListeners.forEach((o) => o.call(null));
  }

  onCreateVideo(e) {
    e.preventDefault();
    this.toggleControlState();
    this.createVideoListeners.forEach((o) => o.call(null));
  }

  onInputText() {
    if (this.textInput.value === '') this.toggleCreateState();
    else {
      this.inputTextListeners.forEach((o) => o.call(null));
    }
  }

  registerEvents() {
    this.form.addEventListener('submit', this.onSubmit.bind(this));
    this.form.addEventListener('reset', this.onReset.bind(this));
    this.audioBtn.addEventListener('click', this.onCreateAudio.bind(this));
    this.videoBtn.addEventListener('click', this.onCreateVideo.bind(this));
    this.textInput.addEventListener('input', this.onInputText.bind(this));
  }
}
