export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    console.log("Kling proxy triggered");
    console.log("Method:", req.method);
    console.log("Body:", req.body);

    const { KLING_ACCESS_KEY, KLING_ACCESS_SECRET } = process.env;

    if (!KLING_ACCESS_KEY || !KLING_ACCESS_SECRET) {
      console.error("Missing Kling API credentials");
      return res.status(500).json({ error: "Kling API credentials are missing" });
    }

    const response = await fetch("https://api.klingai.com/v1/video/submit/async", {
      method: "POST",
      headers: {
        "X-Access-Key": KLING_ACCESS_KEY,
        "X-Access-Secret": KLING_ACCESS_SECRET,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    console.log("Kling response:", data);

    if (!response.ok) {
      return res.status(500).json({ error: "Kling API error", details: data });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error("Unhandled error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
