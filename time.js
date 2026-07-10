 
let ytPlayer;
let isMusicPlaying = false;
 
window.onYouTubeIframeAPIReady = function() {
    ytPlayer = new YT.Player('yt-player', {
        height: '1',
        width: '1',
        videoId: 'xSC34PLT7jQ',  
        playerVars: {
            'autoplay': 0, 
            'loop': 1,
            'playlist': 'xSC34PLT7jQ',  
            'start': 16  
        },
        events: {
            'onReady': (event) => {
                const musicToggle = document.getElementById('musicToggle');
                musicToggle.addEventListener('click', () => {
                    if (isMusicPlaying) {
                        ytPlayer.pauseVideo();
                        musicToggle.classList.remove('playing');
                        musicToggle.textContent = '🎵';
                    } else {
                        ytPlayer.playVideo();
                        musicToggle.classList.add('playing');
                        musicToggle.textContent = '⏸️';  
                    }
                    isMusicPlaying = !isMusicPlaying;
                });
            }
        }
    });
};
 
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

 
document.addEventListener('DOMContentLoaded', () => { 
    // โหมดมืด/สว่าง
    const modeToggle = document.getElementById('modeToggle');
    const htmlElement = document.documentElement;
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme) htmlElement.setAttribute('data-mode', currentTheme);
    if (modeToggle) {
        modeToggle.addEventListener('click', () => {
            let newMode = htmlElement.getAttribute('data-mode') === 'dark' ? 'light' : 'dark';
            htmlElement.setAttribute('data-mode', newMode);
            localStorage.setItem('theme', newMode);
        });
    }
 
    const dateList = document.getElementById('dateList');
    const cards = document.querySelectorAll('.date-card[data-month]');

    const getNextOccurrence = (month, day, now) => {
        let year = now.getFullYear();
        const endOfTargetDay = new Date(year, month, day, 23, 59, 59, 999);
        if (now > endOfTargetDay) year += 1;
        return new Date(year, month, day, 0, 0, 0, 0);
    };

    const isToday = (month, day, now) => now.getMonth() === month && now.getDate() === day;
    const pad = (n) => String(n).padStart(2, '0');
 
    const sortCards = () => {
        const allCards = Array.from(dateList.querySelectorAll('.date-card'));
        const now = new Date();

        allCards.sort((a, b) => {
            if (!a.dataset.month) return 1;
            if (!b.dataset.month) return -1;

            const m_a = parseInt(a.dataset.month, 10);
            const d_a = parseInt(a.dataset.day, 10);
            const m_b = parseInt(b.dataset.month, 10);
            const d_b = parseInt(b.dataset.day, 10);

            if (isToday(m_a, d_a, now)) return -1;
            if (isToday(m_b, d_b, now)) return 1;

            const target_a = getNextOccurrence(m_a, d_a, now);
            const target_b = getNextOccurrence(m_b, d_b, now);

            return (target_a - now) - (target_b - now);
        });

        allCards.forEach(card => dateList.appendChild(card));
    };

    const updateCard = (card) => {
        const month = parseInt(card.dataset.month, 10);
        const day = parseInt(card.dataset.day, 10);
        const now = new Date();

        const countdownEl = card.querySelector('.countdown');
        const todayMsgEl = card.querySelector('.today-msg');
        const gaugeEl = card.querySelector('.gauge');

        if (isToday(month, day, now)) {
            countdownEl.classList.add('hidden');
            todayMsgEl.classList.remove('hidden');
            gaugeEl.style.setProperty('--pct', 100);
            return;
        }

        countdownEl.classList.remove('hidden');
        todayMsgEl.classList.add('hidden');

        const target = getNextOccurrence(month, day, now);
        const prevOccurrence = new Date(target.getFullYear() - 1, month, day, 0, 0, 0, 0);
        const diff = target - now;

        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / (1000 * 60)) % 60);
        const s = Math.floor((diff / 1000) % 60);

        card.querySelector('[data-unit="d"]').textContent = pad(d);
        card.querySelector('[data-unit="h"]').textContent = pad(h);
        card.querySelector('[data-unit="m"]').textContent = pad(m);
        card.querySelector('[data-unit="s"]').textContent = pad(s);

        const totalCycle = target - prevOccurrence;
        const elapsed = now - prevOccurrence;
        const pct = Math.min(100, Math.max(0, (elapsed / totalCycle) * 100));
        gaugeEl.style.setProperty('--pct', pct.toFixed(2));
    };

    const tick = () => cards.forEach(updateCard);

    sortCards(); 
    tick();
    setInterval(tick, 1000);
});
