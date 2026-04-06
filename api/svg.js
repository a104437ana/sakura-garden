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
    ? { bg: '#0d0709', text: '#fdf0f5', text2: '#c0899a', accent: '#ff6b9d',
        c0: '#1a0d12', c1: '#6b1f35', c2: '#c2185b', c3: '#e8547a', c4: '#ff8fab', border: '#2a1520' }
    : { bg: '#fdf6f0', text: '#1a0a00', text2: '#7a5a4a', accent: '#e8547a',
        c0: '#f5e6e0', c1: '#ffc8d8', c2: '#ff8fab', c3: '#e8547a', c4: '#c2185b', border: '#f0ddd5' };

  const cellSize = 11, gap = 2, step = cellSize + gap;
  const paddingLeft = 28, paddingTop = 52, paddingRight = 20, paddingBottom = 36;
  const graphW = weeks.length * step;
  const W = graphW + paddingLeft + paddingRight;
  const H = 7 * step + paddingTop + paddingBottom;

  const flowerPetal = isDark
    ? ['', '#6b1f35', '#c2185b', '#e8547a', '#ff8fab']
    : ['', '#ffb3cc', '#ff85b3', '#ff3d7f', '#c2005a'];
  const flowerCenter = isDark
    ? ['', '#3d0f1f', '#7a0e38', '#c2185b', '#ffaacc']
    : ['', '#ffe0ee', '#ffcce0', '#ffaacc', '#ff80aa'];

  function flower(cx, cy, level) {
    const fc = flowerPetal[level];
    const cc = flowerCenter[level];
    const pr = 2.2, py = 3.2;
    let out = `<g transform="translate(${cx},${cy})">`;
    for (let a = 0; a < 5; a++) {
      out += `<ellipse cx="0" cy="-${py}" rx="${pr}" ry="3.5" fill="${fc}" transform="rotate(${a * 72})"/>`;
    }
    out += `<circle cx="0" cy="0" r="1.8" fill="${cc}"/></g>`;
    return out;
  }

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
      const level = getLevel(day.contributionCount);
      if (day.contributionCount > 0) {
        cells += flower(x + cellSize / 2, y + cellSize / 2, level);
      } else {
        cells += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" rx="2" fill="none" stroke="${colors.border}" stroke-width="1"/>`;
      }
    });
  });

  let monthLabels = '';
  Object.entries(monthMarkers).forEach(([m, wi]) => {
    const x = paddingLeft + Number(wi) * step;
    monthLabels += `<text x="${x}" y="${paddingTop - 8}" font-size="9" fill="${colors.text2}" font-family="monospace">${MONTHS[Number(m)]}</text>`;
  });

  const dayNames = ['','Mon','','Wed','','Fri',''];
  let dayLabels = '';
  dayNames.forEach((d, i) => {
    if (d) dayLabels += `<text x="${paddingLeft - 4}" y="${paddingTop + i * step + cellSize - 2}" font-size="8" fill="${colors.text2}" font-family="monospace" text-anchor="end">${d}</text>`;
  });

  const levelColor = l => [colors.c0, colors.c1, colors.c2, colors.c3, colors.c4][l];
  const legend = [1,2,3,4].map((l,i) => {
    const lx = paddingLeft + i * (cellSize + 4) + cellSize / 2;
    const ly = H - 20 + cellSize / 2;
    return flower(lx, ly, l);
  }).join('') + `<text x="${paddingLeft + 4*(cellSize+4) + 4}" y="${H - 11}" font-size="8" fill="${colors.text2}" font-family="monospace">more blooms →</text>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" rx="10" fill="${colors.bg}" />
  <rect x="0.5" y="0.5" width="${W-1}" height="${H-1}" rx="9.5" fill="none" stroke="${colors.border}" />
  <text x="${paddingLeft}" y="22" font-size="13" font-family="Georgia,serif" font-style="italic" fill="${colors.accent}">sakura.garden</text>
  <text x="${W - paddingRight}" y="22" font-size="10" font-family="monospace" fill="${colors.text2}" text-anchor="end">@${username} · ${year} · ${total} contributions</text>
  ${monthLabels}
  ${dayLabels}
  ${cells}
  ${legend}
</svg>`;
}

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username');
  const year = searchParams.get('year') || new Date().getFullYear();
  const theme = searchParams.get('theme') === 'dark' ? 'dark' : 'light';
  // &half=1 → last 26 weeks only (fits narrow screens / README mobile view)
  const half = searchParams.get('half') === '1';

  if (!username) {
    return new Response('Username required', { status: 400 });
  }

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
          from: `${year}-01-01T00:00:00Z`,
          to: `${year}-12-31T23:59:59Z`,
        },
      }),
    });

    const data = await response.json();
    if (data.errors || !data.data.user) {
      return new Response('User not found', { status: 404 });
    }

    const cal = data.data.user.contributionsCollection.contributionCalendar;
    let weeks = cal.weeks;

    // For the mobile/half variant, keep only the last 26 weeks
    if (half) {
      weeks = weeks.slice(-26);
    }

    const svg = generateSVG(weeks, theme, username, cal.totalContributions, year);

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
