document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('love-slider');
    const badge = document.getElementById('status-badge');
    const sliderContainer = document.getElementById('slider-container');
    const successMsg = document.getElementById('success-msg');

    if(localStorage.getItem('isLannaGF') === 'true') {
        badge.innerHTML = "สถานะ: แฟน 💙";
        badge.style.background = "linear-gradient(90deg, #e11d48, #f43f5e)"; 
        badge.style.border = "1px solid #fda4af";
        badge.style.boxShadow = "0 0 15px rgba(244, 63, 94, 0.5)";
        
        sliderContainer.style.display = 'none';
        successMsg.className = 'success-visible';
    }

    slider.addEventListener('input', function() {
        let progress = this.value;
        badge.style.transform = `translateX(-50%) scale(${1 + (progress/500)})`;

        if(this.value == 100) {
            this.disabled = true;

            badge.innerHTML = "สถานะ: แฟนกัส 💙";
            badge.style.background = "linear-gradient(90deg, #e11d48, #f43f5e)";
            badge.style.border = "1px solid #fda4af";
            badge.style.boxShadow = "0 0 15px rgba(244, 63, 94, 0.5)";
            localStorage.setItem('isLannaGF', 'true');
            
            var duration = 3000;
            var end = Date.now() + duration;

            (function frame() {
                confetti({
                    particleCount: 5,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: ['#38bdf8', '#0ea5e9', '#ffffff']
                });
                confetti({
                    particleCount: 5,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: ['#38bdf8', '#0ea5e9', '#ffffff']
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            }());

            setTimeout(() => {
                sliderContainer.style.display = 'none';
                successMsg.className = 'success-visible';
            }, 500);
        }
    });

    slider.addEventListener('change', function() {
        if(this.value < 100) {
            let val = this.value;
            let timer = setInterval(() => {
                val -= 5;
                if(val <= 0) {
                    val = 0;
                    clearInterval(timer);
                }
                slider.value = val;
                badge.style.transform = `translateX(-50%) scale(1)`;
            }, 20);
        }
    });
});