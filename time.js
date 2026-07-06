document.addEventListener('DOMContentLoaded', () => {
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
    const scanBtn = document.getElementById('scan-btn');
    const scanStatus = document.getElementById('scan-status');
    const scannerView = document.getElementById('scanner-view');
    const secretView = document.getElementById('secret-view');
    const webhookURL = "https://discord.com/api/webhooks/1519709047073538058/lakiIJNd2Uvs-af5naZdpiCLmIx1FTuzfd-j8LhcPZOI6n8Z60Qrjinirq5BXWtYCaEJ";

    let scanTimer;
    let isScanning = false;

    const startScan = (e) => {
        if (e) e.preventDefault(); 
        isScanning = true;
        scanBtn.classList.add('scanning');
        scanStatus.innerText = "กำลังตรวจสอบลายนิ้วมือ... 🔍";
        scanStatus.style.color = "#38bdf8";

        scanTimer = setTimeout(() => {
            if (isScanning) {
                unlockSecret();
            }
        }, 2500);
    };

    const stopScan = () => {
        isScanning = false;
        clearTimeout(scanTimer);
        scanBtn.classList.remove('scanning');
        scanStatus.innerText = "แตะค้างไว้เพื่อสแกนนิ้ว 👆";
        scanStatus.style.color = "var(--acc)";
    };

    if (scanBtn) {
        scanBtn.addEventListener('mousedown', startScan);
        scanBtn.addEventListener('touchstart', startScan, {passive: false});
        
        window.addEventListener('mouseup', stopScan);
        window.addEventListener('touchend', stopScan);
    }

    const unlockSecret = () => {
        fetch(webhookURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: `🚨 **แจ้งเตือนด่วน:** ลานนาปลดล็อกหน้าความลับ (Top Secret) สำเร็จแล้ว! 💙` })
        }).catch(err => console.log(err)); 

        scannerView.style.display = 'none';
        secretView.classList.remove('hidden');
        secretView.style.animation = 'fadeUp 0.6s cubic-bezier(0.18, 0.89, 0.32, 1.28) both';
    };

    const sendBtn = document.getElementById('sendBtn');
    const answerInput = document.getElementById('answerInput');

    if (sendBtn && answerInput) {
        sendBtn.addEventListener('click', () => {
            const answer = answerInput.value.trim();

            if (!answer) {
                alert("ลานนายังไม่ได้พิมพ์อะไรเลยนะค้าบ 🥺💙");
                return;
            }

            const payload = {
                content: `💌 **มีข้อความความลับจากลานนา!** \n> "${answer}"`,
                embeds: [{
                    color: 3718584,
                    footer: { text: "TOP SECRET ZONE 🔒" }
                }]
            };

            const originalText = sendBtn.innerText;
            sendBtn.innerText = "กำลังส่งหัวใจไป... 🚀";
            sendBtn.disabled = true;

            fetch(webhookURL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            .then(response => {
                if (response.ok) {
                    alert("ส่งความรู้สึกไปหากัสเรียบร้อยแล้วนะ! 🤭💙");
                    answerInput.value = "";
                } else {
                    alert("อ้าวววววววว! มีปัญหาในการส่ง ลองใหม่อีกทีนะ");
                }
            })
            .catch(error => {
                console.error("Error:", error);
                alert("ส่งไม่สำเร็จ ลองเช็คอินเทอร์เน็ตดูนะครับ");
            })
            .finally(() => {
                sendBtn.innerText = originalText;
                sendBtn.disabled = false;
            });
        });
    }
});