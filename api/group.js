import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  const { id } = req.query

  if (!id) {
    return res.status(400).send('Missing id')
  }

  const { data, error } = await supabase
    .from('groupchats')
    .select('chat_name, chat_image')
    .eq('id', id)
    .single()

  if (error || !data) {
    return res.status(404).send('Group not found')
  }

  const title = data.chat_name ?? 'inGROUP'
  const image = data.chat_image ?? ''
  const deepLink = `insaigon://insaigon.com/GroupChat?groupId=${id}`
  const appStoreUrl = 'https://apps.apple.com/app/id6741071869'
  const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.twc.insaigon'

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="Join this group on inSAIGON" />
  <meta property="og:image" content="${image}" />
  <meta property="og:site_name" content="inSAIGON" />
  <meta name="twitter:card" content="summary_large_image" />
  <title>${title}</title>
</head>
<body>
  <script>
    const ua = navigator.userAgent || '';
    const isIOS = /iPhone|iPad|iPod/i.test(ua);
    const isAndroid = /Android/i.test(ua);
    const storeUrl = isAndroid ? '${playStoreUrl}' : '${appStoreUrl}';
    const deepLink = '${deepLink}';

    window.location.href = deepLink;
    setTimeout(() => {
      window.location.href = storeUrl;
    }, 2000);
  </script>
</body>
</html>`

  res.setHeader('Content-Type', 'text/html')
  res.status(200).send(html)
}
