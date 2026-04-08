export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).send('Missing id');
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const response = await fetch(
    `${supabaseUrl}/rest/v1/inNEWS?id=eq.${id}&select=Title,Preview,Image`,
    {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    }
  );

  const data = await response.json();
  const article = data[0];

  if (!article) {
    return res.status(404).send('Article not found');
  }

  const title = article.Title || 'inSAIGON News';
  const description = article.Preview || 'Read the latest from inSAIGON';
  const image = article.Image || 'https://insaigon.app/og-image.png';
  const appUrl = `insaigon://insaigon.com/deeplink?articleId=${record.id}`,
  const appStoreUrl = 'https://apps.apple.com/app/id6741071869';
  const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.twc.insaigon';

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:site_name" content="inSAIGON" />
  <meta property="og:type" content="article" />
  <meta name="twitter:card" content="summary_large_image" />
  <title>${title}</title>
</head>
<body>
  <p><strong>inSAIGON</strong></p>
  <p>Opening inSAIGON...</p>
  <script>
    var ua = navigator.userAgent;
    var appUrl = '${appUrl}';
    var storeUrl = /android/i.test(ua) ? '${playStoreUrl}' : '${appStoreUrl}';
    window.location = appUrl;
    setTimeout(function() { window.location = storeUrl; }, 2000);
  <\/script>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html');
  res.send(html);
}
