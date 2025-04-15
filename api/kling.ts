export default async function handler(req: Request): Promise<Response> {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Only POST supported" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }
  
    try {
      const { prompt, images, width, height, fps, duration } = await req.json();
  
      const klingKey = process.env.KLING_ACCESS_KEY;
      const klingSecret = process.env.KLING_ACCESS_SECRET;
  
      if (!klingKey || !klingSecret) {
        throw new Error("Missing Kling API credentials");
      }
  
      const klingRes = await fetch("https://api.klingai.com/v1/video/submit/async", {
        method: "POST",
        headers: {
          "X-Access-Key": klingKey,
          "X-Access-Secret": klingSecret,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          images,
          width,
          height,
          fps,
          duration,
        }),
      });
  
      const data = await klingRes.json();
  
      return new Response(JSON.stringify(data), {
        status: klingRes.status,
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: (err as Error).message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
  