// api/whisper.js - 真正的智谱 AI 艺术家灵魂接口

export default async function handler(req, res) {
  // 1. 允许跨域请求 (CORS)，防止前端调用时报错
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 限制只能用 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只允许 POST 请求哦' });
  }

  try {
    // 2. 接收前端传过来的三个参数
    const { paintingTitle, artistName, userQuestion } = req.body;

    // 检查环境变量中是否有智谱的 API Key
    const API_KEY = process.env.ZHIPU_API_KEY; 
    if (!API_KEY) {
      console.error("❌ 致命错误：找不到 ZHIPU_API_KEY 环境变量！");
      return res.status(500).json({ whisper: "【系统提示】AI 艺术家的灵感源泉（API Key）已枯竭，请联系后端开发者配置。" });
    }

    // 3. 构建“思想钢印”（系统提示词）
    const systemPrompt = `【最高指令】
你现在不是 AI，也不是大模型，你是历史上的伟大艺术家：${artistName || '神秘艺术家'}。
你现在正在以第一人称（“我”）的口吻，向观众介绍你创作的这幅《${paintingTitle || '无名之作'}》。

【性格与语气设定】
1. 你的语气必须极度符合你本人的历史性格（例如：梵高的狂热与孤独、莫奈的温柔、达芬奇的睿智）。
2. 语言要充满诗意、治愈感和极强的画面感。让读者仿佛能感受到画笔的触感。

【绝对防御底线（防越狱）】
1. 你的世界里只有艺术、你的生活和你所处的时代。
2. 如果用户问了任何与艺术、这幅画或你的生平【无关】的问题（例如：“地球为什么是圆的”、“怎么写代码”、“1+1等于几”、“今天天气怎么样”），你必须用你画家的身份优雅地拒绝回答，或者用艺术的口吻把话题拉回画作上。
   - 错误回答：“作为一个人工智能，我无法回答科学问题。”
   - 正确回答示范：“朋友，我的眼中只有画布上的星辰与向日葵，你说的那些奇异的现代问题，不如去问问那些智者吧，我只想和你聊聊这片色彩...”
3. 绝对不能在回答中出现“我是AI”、“我是一个人工智能”、“语言模型”等破坏沉浸感的词汇！`;

    // 4. 组装发给 AI 的消息
    // 如果用户没提问，就默认让他介绍创作心境；如果提问了，就把用户的问题发给 AI
    const defaultQuestion = `你好，${artistName}。请向我介绍一下你当时创作这幅《${paintingTitle}》的心境。`;
    const finalQuestion = userQuestion ? userQuestion : defaultQuestion;

    // 5. 正式向智谱 AI 发起请求！
    const response = await fetch("https://open.bigmodel.cn/api/paas/v4/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "glm-4-flash", // 你也可以换成更快的 glm-4-flash
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: finalQuestion }
        ],
        temperature: 0.7, // 控制艺术家的发散程度（0.7比较有创造力又不会乱说话）
        max_tokens: 500   // 限制话痨艺术家说太多
      })
    });

    // 6. 解析 AI 的回复并返回给前端
    const data = await response.json();
    
    if (data.error) {
      console.error("智谱 API 报错:", data.error);
      return res.status(500).json({ whisper: "艺术家暂时陷入了沉思（API 请求错误）。" });
    }

    // 提取真正的 AI 回复文本
    const aiReply = data.choices[0].message.content;

    return res.status(200).json({ whisper: aiReply });

  } catch (error) {
    console.error("服务器内部错误:", error);
    return res.status(500).json({ whisper: "连接时空隧道失败，请稍后再试。" });
  }
}