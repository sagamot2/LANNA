exports.handler = async function(event, context) {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK_URL;
    const payload = event.body;

    try {
        const response = await fetch(DISCORD_WEBHOOK, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: payload
        });
        
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "ส่งสำเร็จ!" })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "ระบบขัดข้อง" })
        };
    }
};