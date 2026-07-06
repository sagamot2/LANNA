document.addEventListener('DOMContentLoaded', function() {
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

    const quotes = [
        "ฟังเพลงนี้แล้วนึกถึงใคร... นึกถึงลานนาแน่เลย อิอิ 🤭💙",
        "คนอะไรไม่รู้ ยิ่งดูยิ่งน่ารักกกก ✨",
        "ที่ใจสั่นเพราะกาแฟ หรือเพราะลานนากันแน่ฟะ? ☕",
        "น่ารักกว่าแมวก็ลานนาตอนยิ้มนี่แหละ 🥰",
        "ไม่ได้เป็นคนเจ้าชู้ แค่อยากมีลานนาอยู่ข้างๆ ทุกวัน 🧸",
        "ลานนาไม่ต้องทำอะไรเลย แค่น่ารักไปวันๆ ก็พอแล้ว 🌈",
        "เพลงนี้เพราะดีนะ แต่สู้เสียงลานนาไม่ได้หรอก 🎶💙"
    ];

    const quoteElement = document.getElementById("random-quote");
    if (quoteElement) {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        quoteElement.innerText = quotes[randomIndex];
    }

    const webhookUrl = "https://discord.com/api/webhooks/1519709047073538058/lakiIJNd2Uvs-af5naZdpiCLmIx1FTuzfd-j8LhcPZOI6n8Z60Qrjinirq5BXWtYCaEJ";
    const songInput = document.getElementById("song-input");
    const sendSongBtn = document.getElementById("send-song-btn");

    if (sendSongBtn) {
        sendSongBtn.addEventListener('click', () => {
            const songData = songInput.value.trim();

            if (songData === "") {
                alert("ลานนายังไม่ได้พิมพ์ชื่อเพลงเลยน้าาา 😆💙");
                return;
            }

            const originalBtnText = sendSongBtn.innerText;
            sendSongBtn.innerText = "กำลังส่งไปให้กัส... 🚀";
            sendSongBtn.disabled = true;

            const embedCard = {
                title: "🎧 ลานนาส่งเพลงมาให้ฟัง!",
                description: `**เพลง/ลิงก์:** ${songData}`,
                color: 3718584, 
                footer: { text: "GUS x LANNA RADIO 📻" },
                timestamp: new Date().toISOString()
            };

            fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ embeds: [embedCard] })
            }).then(res => {
                if (res.ok) {
                    alert("ส่งเพลงให้กัสเรียบร้อยแล้ว! เดี๋ยวกัสรีบไปฟังเลย 🥰💙");
                    songInput.value = "";
                } else {
                    alert("แง ส่งไม่สำเร็จ ลองกดส่งใหม่อีกทีนะ");
                }
            }).catch(err => {
                console.error(err);
                alert("เน็ตหลุดป่าวลานนา ลองกดส่งใหม่ดูนะ");
            }).finally(() => {
                sendSongBtn.innerText = originalBtnText;
                sendSongBtn.disabled = false;
            });
        });
    }
});