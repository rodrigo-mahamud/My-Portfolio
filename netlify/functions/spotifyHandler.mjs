// netlify/functions/spotifyHandler.js

export default async (request) => {
  const clientId = process.env.PUBLIC_CLIENT_ID;
  const clientSecret = process.env.PUBLIC_CLIENT_SECRET;
  const refreshToken = process.env.PUBLIC_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    return new Response('Credenciales de Spotify faltantes', { status: 500 });
  }

  if (request.method === 'POST') {
    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: 'Basic ' + btoa(`${clientId}:${clientSecret}`),
        },
        body: 'grant_type=refresh_token&refresh_token=' + refreshToken,
      });

      const data = await response.json();
      const accessToken = data.access_token;
      const spotifyResponse = await fetch(`https://api.spotify.com/v1/me/player/currently-playing`, {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      });

      if (spotifyResponse.status === 204) {
        return new Response(JSON.stringify({ playing: false }), {
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const songData = await spotifyResponse.json();
      return new Response(JSON.stringify({ playing: true, songData: songData }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response('Error en la solicitud a Spotify', { status: 500 });
    }
  } else {
    return new Response('Método no permitido', { status: 405 });
  }
};
