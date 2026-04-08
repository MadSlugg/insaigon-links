export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).send('Missing id');

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const response = await fetch(
    `${supabaseUrl}/rest/v1/restaurants?id=eq.${id}&select=name,cover_image`,
    {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    }
  );
  const data = await response.json();
  const restaurant = data[0];
  if (!restaurant) return res.status(404).send('Restaurant not found');

  const title = restaurant.name || 'inSAIGON Restaurant';
  const image = restaurant.cover_image || 'https://insaigon.app/og-image.png';
  const appUrl = `insaigon://insaigon.com/deeplink?restaurantId=${id}`;
  const appStoreUrl = 'https://apps.apple.com/app/id6741071869';
  const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.twc.insaigon';

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="View on inSAIGON" />
  <meta property="og:image" content="${image}" />
  <meta property="og:site_name" content="inSAIGON" />
  <meta property="og:type" content="website" />
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
    window.location = appUrl;
    setTimeout(function() { window.location = storeUrl; }, 2000);
  <\/script>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html');
  res.send(html);
}
