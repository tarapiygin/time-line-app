import moment from 'moment';
import EventFormWidget from './EventFormWidget';
import LocationFormWidget from './LocationFormWidget';
import UIManager from './UIManager';
import PopupWidget from './PopupWidget';
import { locationParse } from './utils';

export default class EventController {
  constructor() {
    this.eventForm = new EventFormWidget();
    this.locationForm = new LocationFormWidget();
    this.UIManager = new UIManager();
    this.popup = new PopupWidget();
    this.location = null;
    this.stopRecordFunc = null;
    this.stateEventForm = null;
    this.events = [];
    this.registerEvents();
  }

  async recordAudio() {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });
    const recorder = new MediaRecorder(stream);
    const chunks = [];
    let interval = null;
    const timeRecord = Date.now();
    recorder.addEventListener('start', () => {
      interval = setInterval(() => {
        const recordingDuration = moment(Date.now() - timeRecord).format('mm:ss');
        this.eventForm.toggleControlState(recordingDuration);
      }, 1000);
    });
    recorder.addEventListener('dataavailable', (evt) => {
      chunks.push(evt.data);
    });
    recorder.addEventListener('stop', () => {
      clearInterval(interval);
      if (this.stateEventForm === 'submit') {
        const blob = new Blob(chunks);
        const event = {
          id: `sdfsdfsf0${Date.now()}`,
          type: 'audio',
          location: this.location,
          date: Date.now(),
          audio: {
            src: URL.createObjectURL(blob),
          },
        };
        this.events.push(event);
        this.UIManager.drawEvents(this.events);
        this.eventForm.toggleCreateState();
        this.stateEventForm = null;
      }
    });
    recorder.start();
    return () => {
      recorder.stop();
      stream.getTracks().forEach((track) => track.stop());
    };
  }

  async recordVideo() {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const mutedStream = stream.clone();
    const audioTracks = mutedStream.getAudioTracks();
    audioTracks.forEach((track) => {
      // eslint-disable-next-line no-param-reassign
      track.enabled = false;
    });
    this.eventForm.showVideoPreview(mutedStream);
    const recorder = new MediaRecorder(stream);
    const chunks = [];
    let interval = null;
    const timeRecord = Date.now();
    recorder.addEventListener('start', () => {
      interval = setInterval(() => {
        const recordingDuration = moment(Date.now() - timeRecord).format('mm:ss');
        this.eventForm.toggleControlState(recordingDuration);
      }, 1000);
    });
    recorder.addEventListener('dataavailable', (evt) => {
      chunks.push(evt.data);
    });
    recorder.addEventListener('stop', () => {
      clearInterval(interval);
      this.eventForm.hideVideoPreview();
      if (this.stateEventForm === 'submit') {
        const blob = new Blob(chunks);
        const event = {
          id: `sdfsdfsf0${Date.now()}`,
          type: 'video',
          location: this.location,
          date: Date.now(),
          video: {
            src: URL.createObjectURL(blob),
          },
        };
        this.events.push(event);
        this.UIManager.drawEvents(this.events);
        this.eventForm.toggleCreateState();
        this.stopRecordFunc = null;
        this.stateEventForm = null;
      }
    });
    recorder.start();
    return () => {
      recorder.stop();
      stream.getTracks().forEach((track) => track.stop());
    };
  }

  getLocation(callback) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          this.location = { latitude, longitude };
          callback.call(null);
        }, () => {
          this.locationForm.submitFormListener = (coordinates) => {
            this.location = locationParse(coordinates);
            callback.call(null);
          };
          this.locationForm.showForm();
        },
      );
    } else {
      this.locationForm.showForm();
    }
  }

  async onCreateVideoEvent() {
    if (this.location !== null) {
      if (!window.MediaRecorder) {
        this.popup.show(
          'Что то пошло не так...',
          'Во время записи аудио произошла непредвиденная ошибка. Попробуйте еще раз или смените браузер.',
        );
        this.eventForm.toggleCreateState();
        return;
      }
      try {
        this.stopRecordFunc = await this.recordVideo();
      } catch (error) {
        this.popup.show(
          'Что то пошло не так...',
          'Во время записи видео произошла непредвиденная ошибка. Проверьте доступ к веб-камере и попробуйте еще раз.',
        );
        this.eventForm.toggleCreateState();
      }
    } else {
      this.getLocation(this.onCreateVideoEvent.bind(this));
    }
  }

  async onCreateAudioEvent() {
    if (this.location !== null) {
      if (!window.MediaRecorder) {
        this.popup.show(
          'Что то пошло не так...',
          'Запись аудио недоступна, Вам необходимо сменить браузер',
        );
        this.eventForm.toggleCreateState();
        return;
      }
      try {
        this.stopRecordFunc = await this.recordAudio();
      } catch (error) {
        this.popup.show(
          'Что то пошло не так...',
          'Запись аудио недоступна. Проверьте доступ к микрофону и попробуйте еще раз.',
        );
        this.eventForm.toggleCreateState();
      }
    } else {
      this.getLocation(this.onCreateAudioEvent.bind(this));
    }
  }

  onResetEventForm() {
    if (this.stopRecordFunc === null) return;
    this.stateEventForm = 'reset';
    this.stopRecordFunc();
  }

  onSubmitEventForm() {
    if (this.stopRecordFunc === null) return;
    this.stateEventForm = 'submit';
    this.stopRecordFunc();
  }

  onCreateTextEvent(text) {
    const event = {
      id: `sdfsdfsf0${Date.now()}`,
      type: 'text',
      location: this.location,
      date: Date.now(),
      text,
    };
    this.events.push(event);
    this.UIManager.drawEvents(this.events);
  }

  onInputTextEvent() {
    if (this.location !== null) {
      this.eventForm.toggleControlState();
    } else {
      this.getLocation(this.onInputTextEvent.bind(this));
    }
  }

  init() {
    return this.location;
  }

  registerEvents() {
    this.eventForm.addCreateVideoListener(this.onCreateVideoEvent.bind(this));
    this.eventForm.addCreateAudioListener(this.onCreateAudioEvent.bind(this));
    this.eventForm.addResetListener(this.onResetEventForm.bind(this));
    this.eventForm.addCreateTextListener(this.onCreateTextEvent.bind(this));
    this.eventForm.addInputTextListener(this.onInputTextEvent.bind(this));
    this.eventForm.addSubmitListener(this.onSubmitEventForm.bind(this));
  }
}
