import moment from 'moment';

moment.locale('ru');

export default class UIManager {
  constructor() {
    this.container = document.querySelector('.time-events');
  }

  static renderEventsHTML(timeEventList) {
    let HTML = '';
    timeEventList.forEach((event) => {
      HTML += `<div class="time-event" data-id=${event.id}>
      <div class="timestamp"></div>
      <div class="time-event_content">
        <div class="time-event_date">${moment(event.date).format('MM.DD.YYYY в HH:mm:ss')}</div>`;
      if (event.type === 'text') {
        HTML += `<div class="time-event_text">${event.text}</div>`;
      } else if (event.type === 'video') {
        HTML += `<video class="time-event_video" controls>
        <source src="${event.video.src}" type='video/mp4'>
        </video>`;
      } else if (event.type === 'audio') {
        HTML += `<audio controls class="time-event_audio">
        <source src="${event.audio.src}" type="audio/mpeg">
        </audio>`;
      }
      HTML += `<div class="time-event_location">Местоположение: [${event.location.latitude}, ${event.location.longitude}]</div>
      </div></div>`;
    });
    HTML += '';
    return HTML;
  }

  drawEvents(eventList) {
    this.container.innerHTML = UIManager.renderEventsHTML(eventList);
  }
}
