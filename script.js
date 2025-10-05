const zones = document.querySelectorAll('.zone');
const gates = document.querySelectorAll('.gate');
const dispatchedArea = document.getElementById('dispatched');
const waitingArea = document.getElementById('zoneList');

zones.forEach(zone => zone.addEventListener('dragstart', e => {
  e.dataTransfer.setData('text/plain', zone.id);
}));

[...gates, dispatchedArea, waitingArea].forEach(area => {
  area.addEventListener('dragover', e => e.preventDefault());
  area.addEventListener('drop', e => {
    e.preventDefault();
    const zoneId = e.dataTransfer.getData('text/plain');
    const zone = document.getElementById(zoneId);

    // Clear timers
    if(zone.dataset.interval){
      clearInterval(zone.dataset.interval);
      delete zone.dataset.interval;
    }

    // Remove old classes/timers
    zone.classList.remove('in-gate','dispatched','waiting');
    const oldTimer = zone.querySelector('.gate-timer');
    if(oldTimer) oldTimer.remove();
    const oldDispatchedTime = zone.querySelector('.dispatched-time');
    if(oldDispatchedTime) oldDispatchedTime.remove();

    // Append to new parent
    e.currentTarget.appendChild(zone);

    // Gate timer
    if(e.currentTarget.classList.contains('gate')){
      zone.classList.add('in-gate');
      const timerDisplay = document.createElement('span');
      timerDisplay.classList.add('gate-timer');
      zone.appendChild(timerDisplay);

      const start = new Date();
      const interval = setInterval(()=>{
        const diff = Math.floor((new Date() - start)/1000);
        timerDisplay.textContent = `⏱ ${diff}s`;
      },1000);
      zone.dataset.interval = interval;
    }

    // Dispatched
    else if(e.currentTarget.id === 'dispatched'){
      zone.classList.add('dispatched');
      const dispatchedTime = document.createElement('span');
      dispatchedTime.classList.add('dispatched-time');
      dispatchedTime.textContent = `(Dispatched at: ${new Date().toLocaleTimeString()})`;
      zone.appendChild(dispatchedTime);
    }

    // Waiting
    else if(e.currentTarget.id === 'zoneList'){
      zone.classList.add('waiting');
    }
  });
});
