export default {
  async fetch(request: Request, env: any) {
    const url = new URL(request.url);
    
    // Remover query string e hash para buscar no assets
    const assetKey = url.pathname === '/' ? '/index.html' : url.pathname;
    
    let asset = await env.ASSETS.get(assetKey);
    
    // Se o arquivo não existir e não for raiz, tentar index.html (para SPA routing)
    if (!asset && url.pathname !== '/index.html') {
      asset = await env.ASSETS.get('/index.html');
    }
    
    if (!asset) {
      return new Response('Not Found', { status: 404 });
    }
    
    const response = new Response(asset.body, {
      headers: asset.metadata?.headers || {},
    });
    
    // Adicionar headers apropriados para cache
    if (assetKey.includes('.')) {
      response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    } else if (assetKey === '/index.html') {
      response.headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
      response.headers.set('Content-Type', 'text/html;charset=utf-8');
    }
    
    return response;
  },
} as ExportedHandler;
