export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Método no permitido',
    };
  }

  function currentDate() {
    const now = new Date();
    return now.toISOString();
  }

  function oneYearAgo() {
    const now = new Date();
    now.setFullYear(now.getFullYear() - 1);
    now.setDate(now.getDate() - 5);
    return now.toISOString();
  }

  const token = process.env.SECRET_GITHUB_TOKEN; // Tu token de acceso personal
  const url = process.env.SECRET_GITHUB_URL;
  const usuario = process.env.SECRET_GITHUB_USER; // Tu nombre de usuario
  const toNow = currentDate();
  const fromOneYear = oneYearAgo();
  if (!token || !url || !usuario) {
    console.error('Variables de entorno no definidas');
    return {
      statusCode: 500,
      body: 'Error del servidor debido a configuración faltante',
    };
  }

  const consulta = {
    query: `
        {
          user(login: "${usuario}") {
            email
            createdAt
            contributionsCollection(from: "${fromOneYear}", to: "${toNow}") {
              contributionCalendar {
                totalContributions
                weeks {
                  contributionDays {
                    weekday
                    date
                    contributionCount
                    color
                  }
                }
                months {
                  name
                  year
                  firstDay
                  totalWeeks
                }
              }
            }
          }
        }
      `,
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(consulta),
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return {
        statusCode: 500,
        body: `Error en la respuesta de GitHub: ${response.status}`,
      };
    }

    const responseData = await response.json();
    if (responseData && responseData.data && responseData.data.user && responseData.data.user.contributionsCollection) {
      const contributions = responseData.data.user.contributionsCollection.contributionCalendar.weeks.flatMap((week) =>
        week.contributionDays.map((day) => ({
          date: day.date,
          count: day.contributionCount,
          color: day.color,
        }))
      );

      return {
        statusCode: 200,
        body: JSON.stringify({ contributions }),
      };
    } else {
      return {
        statusCode: 500,
        body: 'Estructura de datos inesperada en la respuesta de GitHub',
      };
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: `Error interno del servidor: ${error.message}`,
    };
  }
}
