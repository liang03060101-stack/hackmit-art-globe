// api/whisper.js
import { findArtistProfile } from '../lib/artistProfiles.js';
import { sanitizeInput, buildSystemPrompt } from '../lib/promptBuilder.js';

export default async function handler(req, res) {
  // CORS 跨域处理
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: '只允许 POST 请求' });

  try {
    const { paintingTitle, artistName, userQuestion } = req.body || {};

    // 1. 数据清洗与准备
    const cleanTitle = sanitizeInput(paintingTitle, 100);
    const cleanArtist = sanitizeInput(artistName, 50);
    const cleanQuestion = sanitizeInput(userQuestion, 500);

    const artistResult = findArtistProfile(cleanArtist);
    const resolvedName = artistResult?.name || cleanArtist || '艺术守望者';
    const systemPrompt = buildSystemPrompt(cleanArtist, cleanTitle, artistResult);

    const API_KEY = process.env.ZHIPU_API_KEY;
    if (!API_KEY) {
      return res.status(500).json({ whisper: "这位艺术家暂时沉睡了，请稍后再来拜访。" });
    }

    let finalQuestion = cleanQuestion || (artistResult?.profile?.greeting 
      ? `请向我介绍一下你创作这幅${cleanTitle ? `《${cleanTitle}》` : '画作'}时的心境，用你最自然的方式说话。` 
      : `你好，请向我介绍一下你当时创作这幅${cleanTitle ? `《${cleanTitle}》` : '画作'}的心境。`);

    // 2. 调用智谱大模型
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const response = await fetch("https://open.bigmodel.cn/api/paas/v4/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: "glm-4-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: finalQuestion }
        ],
        temperature: 0.75,
        max_tokens: 600,
        top_p: 0.9
      })
    });

    clearTimeout(timeout);
    const data = await response.json();

    if (!response.ok || data.error) {
      return res.status(502).json({ whisper: "这位艺术家暂时迷失在时空隧道中了，请稍后再试。" });
    }

    const aiReply = data?.choices?.[0]?.message?.content;
    if (!aiReply) {
      return res.status(502).json({ whisper: "艺术家似乎陷入了沉思，请再试一次。" });
    }

    // 3. 防护网：检测 AI 破防词
    let cleanReply = aiReply;
    const bannedPatterns = [/作为一个?AI/gi, /人工智能/g, /语言模型/g, /程序|机器人/g];
    
    if (bannedPatterns.some(pattern => pattern.test(cleanReply))) {
      cleanReply = "你说的这些，像是某种遥远国度的方言。来，让我们回到画布前——这里才是我们共同的语言。";
    }

    return res.status(200).json({
      whisper: cleanReply,
      artist: resolvedName
    });

  } catch (error) {
    if (error.name === 'AbortError') {
      return res.status(504).json({ whisper: "这位艺术家思考了太久，请再问一次。" });
    }
    console.error("服务器错误:", error);
    return res.status(500).json({ whisper: "时空隧道出现了一点波动，请稍后再试。" });
  }
}