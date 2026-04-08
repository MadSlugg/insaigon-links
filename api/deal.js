export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).send('Missing id');
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const response = await fetch(
    `${supabaseUrl}/rest/v1/random_food_drink_deals?id=eq.${id}&select=EventName,EventDescription,Flyer`,
    {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    }
  );

  const data = await response.json();
  const deal = data[0];

  if (!deal) {
    return res.status(404).send('Deal not found');
  }

  const title = deal.EventName || 'inSAIGON Deal';
  const description = deal.EventDescription?.substring(0, 200) || 'Check out this deal on inSAIGON';
  const image = deal.Flyer || 'https://insaigon.app/og-image.png';
  const appUrl = `insaigon://insaigon.com/deeplink?eventId=${id}`;
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
    var appUrl = '${appUrl}';
    var ua = navigator.userAgent;
    var storeUrl = /android/i.test(ua) ? '${playStoreUrl}' : '${appStoreUrl}';

    var t = setTimeout(function() {
      window.location = storeUrl;
    }, 2000);

    function cancel() { clearTimeout(t); }

    document.addEventListener('visibilitychange', function() {
      if (document.hidden) cancel();
    });
    window.addEventListener('pagehide', cancel);
    window.addEventListener('blur', cancel);

    window.location = appUrl;
  <\/script>
</body>
</html>`;
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
}
