// netlify/functions/spotifyHandler.js
const fetch = require('node-fetch');

exports.handler = async () => {
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const refreshToken = process.env.REFRESH_TOKEN;

  // Función para obtener el token de acceso
  const getAccessToken = async () => {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(clientId + ':' + clientSecret).toString('base64')}`,
      },
      body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
    });
    const data = await response.json();
    return data.access_token;
  };

  // Función para obtener la canción que está sonando
  const getNowPlaying = async (accessToken) => {
    const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === 204) {
      return null; // No hay música sonando
    }

    const data = await response.json();
    return data;
  };

  try {
    const accessToken = await getAccessToken();
    const nowPlaying = await getNowPlaying(accessToken);

    return {
      statusCode: 200,
      body: JSON.stringify({ nowPlaying }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error al procesar la solicitud' }),
    };
  }
};
