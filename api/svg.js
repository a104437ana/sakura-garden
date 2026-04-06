export const config = {
  runtime: 'edge',
};

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function getLevel(count) {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 9) return 3;
  return 4;
}

function generateSVG(weeks, theme, username, total, year) {
  const isDark = theme === 'dark';
  const colors = isDark
    ? { bg: 'transparent', text: '#fdf0f5', text2: '#c0899a', accent: '#ff6b9d',
        c0: '#1a0d12', c1: '#6b1f35', c2: '#c2185b', c3: '#e8547a', c4: '#ff8fab', border: '#2a1520' }
    : { bg: 'transparent', text: '#1a0a00', text2: '#7a5a4a', accent: '#e8547a',
        c0: '#f5e6e0', c1: '#ffc8d8', c2: '#ff8fab', c3: '#e8547a', c4: '#c2185b', border: '#f0ddd5' };

  const flowerPetal = ['', '#ffb3cc', '#ff85b3', '#ff3d7f', '#c2005a'];
  const flowerCenter = ['', '#ffe0ee', '#ffcce0', '#ffaacc', '#ff80aa'];

  function flower(cx, cy, level) {
    const fc = flowerPetal[level];
    const cc = flowerCenter[level];
    let out = `<g transform="translate(${cx},${cy})">`;
    for (let a = 0; a < 5; a++) {
      out += `<ellipse cx="0" cy="-3.2" rx="2.2" ry="3.5" fill="${fc}" transform="rotate(${a * 72})"/>`;
    }
    out += `<circle cx="0" cy="0" r="1.8" fill="${cc}"/></g>`;
    return out;
  }

  const cellSize = 11, gap = 2, step = cellSize + gap;
  const paddingLeft = 28, paddingTop = 32, paddingRight = 20, paddingBottom = 36;
  const graphW = weeks.length * step;
  const W = graphW + paddingLeft + paddingRight;
  const H = 7 * step + paddingTop + paddingBottom;

  let cells = '';
  let monthMarkers = {};

  weeks.forEach((week, wi) => {
    const firstDay = week.contributionDays[0];
    if (firstDay) {
      const m = new Date(firstDay.date).getMonth();
      if (monthMarkers[m] === undefined) monthMarkers[m] = wi;
    }
    week.contributionDays.forEach(day => {
      const dow = new Date(day.date).getDay();
      const x = paddingLeft + wi * step;
      const y = paddingTop + dow * step;
      if (day.contributionCount > 0) {
        cells += flower(x + cellSize / 2, y + cellSize / 2, getLevel(day.contributionCount));
      } else {
        cells += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" rx="2" fill="rgba(124, 255, 68, 0.579)" stroke="none" />`;
      }
    });
  });

  let monthLabels = '';
  Object.entries(monthMarkers).forEach(([m, wi]) => {
    const x = paddingLeft + wi * step;
    monthLabels += `<text x="${x}" y="${paddingTop - 8}" font-size="9" fill="${colors.text2}" font-family="monospace">${MONTHS[m]}</text>`;
  });

  const dayNames = ['','Mon','','Wed','','Fri',''];
  let dayLabels = '';
  dayNames.forEach((d, i) => {
    if (d) dayLabels += `<text x="${paddingLeft - 4}" y="${paddingTop + i * step + cellSize - 2}" font-size="8" fill="${colors.text2}" font-family="monospace" text-anchor="end">${d}</text>`;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" rx="10" fill="${colors.bg}" />
  ${monthLabels}
  ${dayLabels}
  ${cells}
</svg>`;
}

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username');
  const year = searchParams.get('year') || new Date().getFullYear();
  const theme = searchParams.get('theme') === 'dark' ? 'dark' : 'light';

  if (!username) {
    return new Response('Username required', { status: 400 });
  }

  const today = new Date();
  const oneYearAgo = new Date(today);
  oneYearAgo.setDate(today.getDate() - 365);
  const fromDate = oneYearAgo.toISOString();
  const toDate = today.toISOString();
  const fromYear = oneYearAgo.getFullYear();
  const toYear = today.getFullYear();
  const yearRange = fromYear === toYear ? `${toYear}` : `${fromYear} - ${toYear}`;

  const query = `
    query($username: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $username) {
        contributionsCollection(from: $from, to: $to) {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
        login
      }
    }
  `;

  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: {
          username,
          from: fromDate,
          to: toDate,
        },
      }),
    });

    const data = await response.json();
    if (data.errors || !data.data.user) {
      return new Response('User not found', { status: 404 });
    }

    const cal = data.data.user.contributionsCollection.contributionCalendar;
    const svg = generateSVG(cal.weeks, theme, username, cal.totalContributions, year);

    return new Response(svg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    return new Response('Error generating SVG', { status: 500 });
  }
}
