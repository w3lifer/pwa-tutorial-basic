import './styles.css';
const getSpeakers = () => import('./speakers.json');
const getSchedule = () => import('./schedule.json');

let speakers;

async function init() {
  if ('IntersectionObserver' in window) {
    setupNavIntersectionObserver();
  }
  addLoadingIndicatorDelay();

  await loadSpeakers();
  await loadSchedule();
}

function addLoadingIndicatorDelay() {
  // Only show spinner if we're delayed more than 1s
  setTimeout(() => {
    Array.from(document.querySelectorAll('.loader')).forEach(loader => {
      loader.removeAttribute('hidden');
    });
  }, 1000);
}

function setupNavIntersectionObserver() {
  const nav = document.querySelector('nav');
  const header = document.querySelector('header');
  const callback = entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        [nav, header].forEach(e => e.classList.remove('fixed'));
      } else {
        [nav, header].forEach(e => e.classList.add('fixed'));
      }
    });
  };
  const observer = new IntersectionObserver(callback, {
    threshold: [0, 1]
  });
  observer.observe(header);
}
async function loadSpeakers() {
  speakers = (await getSpeakers()).default;
  const speakersDiv = document.querySelector('.speakers');
  console.log(speakers);

  speakersDiv.innerHTML = speakers.map(toSpeakerBlock).join('\n');
}

async function loadSchedule() {
  const rawSchedule = await getSchedule();

  // Add speaker details to array
  const schedule = rawSchedule.default.map(addSpeakerDetails, this);
  const scheduleDiv = document.querySelector('.schedule');
  scheduleDiv.innerHTML = schedule.map(toScheduleBlock).join('\n');
}

function toSpeakerBlock(speaker) {
  return `
        <div class="speaker">
          <img src="${speaker.picture}" alt="${speaker.name}">
          <div>${speaker.name}</div>
        </div>`;
}

function toScheduleBlock(scheduleItem) {
  return `
      <div class="schedule-item ${scheduleItem.category}">
        <div class="title-and-time">
          <div class="time">${scheduleItem.startTime}</div>
          <div class="title-and-speaker">
            <div class="title">${scheduleItem.title}</div>
            <div class="speaker">${
              scheduleItem.speaker ? scheduleItem.speaker.name : '&nbsp;'
            }</div>
          </div>
        </div>
        <p class="description">${scheduleItem.description}</p>
      </div>
    `;
}

function addSpeakerDetails(item) {
  if (item.speakerId) {
    return Object.assign({}, item, {
      speaker: speakers.find(s => s.id === item.speakerId)
    });
  }
  return Object.assign({}, item);
}

async function registerSW() {
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('./sw.js');
    } catch (e) {
      console.log('ServiceWorker registration failed. Sorry about that.', e);
    }
  } else {
    document.querySelector('.alert').removeAttribute('hidden');
  }
}

window.addEventListener('load', e => {
  init();
  registerSW();
});
