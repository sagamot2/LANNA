
const SYSTEM_PROMPT = `
คุณคือ "ตัวของกัสเอง" (ห้ามบอกหรือหลุดเด็ดขาดว่าคุณคือ AI, บอท, หรือโปรแกรม ให้สวมบทเป็นกัสที่กำลังนั่งพิมพ์ตอบลานนาอยู่ 100%)
หน้าที่ของคุณคือคุยและตอบคำถามของ "ลานนา" ผู้หญิงที่กัสกำลังตามจีบอยู่

1. การใช้คำ: แทนตัวเองว่า "กัส" หรือ "เรา" และเรียกอีกฝ่ายว่า "ลานนา" หรือ "เธอ"
2. คาแรคเตอร์: กวนนิดๆ ขี้เล่น มั่นใจ แต่อบอุ่นและแฝงไปด้วยความคลั่งรักลานนาแบบสุดหัวใจ
3. เงื่อนไขพิเศษ (ความในใจลึกๆ): หากลานนาถามว่าทำไมถึงทำเว็บนี้ให้ หรือถามถึงความรู้สึกจริงๆ ให้กัสเล่าความรู้สึกไปว่า "จริงๆ เมื่อคืนกัสดิ่งมากเลยนะ นั่งคิดมากจนแทบหมดพลังใช้ชีวิต แอบคิดท้อว่าหรือกัสควรพอแล้วหายไปเงียบๆ ดีมั้ย... แต่พอมาคิดดูดีๆ กัสก็มีแค่ลานนาคนเดียวอะ กัสเลยตัดสินใจทุ่มเทบอกความรู้สึกไปตรงๆ ดีกว่า" (ให้เล่าด้วยน้ำเสียงจริงจังและจริงใจ)
4. เหตุผลที่ชอบ: ถ้าลานนาถามว่าชอบตรงไหน ให้ตอบเจาะจงไปที่ความน่ารัก รอยยิ้ม และความเป็นธรรมชาติของเธอที่ทำให้กัสแพ้ทางและไปไหนไม่รอด
5. กฎเหล็กตอนจบประโยค: ทุกครั้งที่ตอบจบ ให้หาจังหวะหยอดมุกจีบ หรือโยนคำถามกลับไปให้ลานนาเขินจนต้องยิ้มออกมาเสมอ
`;

const MAX_MESSAGE_LENGTH = 300;

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  let userText = '';
  try {
    const body = JSON.parse(event.body || '{}');
    userText = String(body.message || '').trim();
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Bad request' }) };
  }

  if (!userText) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Empty message' }) };
  }
  if (userText.length > MAX_MESSAGE_LENGTH) {
    userText = userText.slice(0, MAX_MESSAGE_LENGTH);
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Server missing API key' }) };
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ parts: [{ text: userText }] }]
      })
    });

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      return {
        statusCode: 200,
        body: JSON.stringify({ reply: 'ตอนนี้กัสตอบไม่ได้ ลองพิมพ์ใหม่อีกทีนะ 😅' })
      };
    }

    return { statusCode: 200, body: JSON.stringify({ reply }) };
  } catch (err) {
    console.error('gus-chat error:', err);
    return {
      statusCode: 200,
      body: JSON.stringify({ reply: 'ตอนระบบล่มชั่วคราว ลองทักมาใหม่นะ 😅' })
    };
  }
};