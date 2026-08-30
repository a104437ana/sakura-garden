export const config = {
  runtime: 'edge',
};

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const FONT_FAMILY = "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif";

function getLevel(count) {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 9) return 3;
  return 4;
}

function generateSVG(weeks, theme, username, total, year, animate) {
  const isDark = theme === 'dark';
  const colors = isDark
    ? { bg: 'transparent', text: '#fdf0f5', text2: '#ffffffff', accent: '#ff6b9d',
        c0: '#1a0d12', c1: '#6b1f35', c2: '#c2185b', c3: '#e8547a', c4: '#ff8fab', border: '#2a1520' }
    : { bg: 'transparent', text: '#1a0a00', text2: '#000000ff', accent: '#e8547a',
        c0: '#f5e6e0', c1: '#ffc8d8', c2: '#ff8fab', c3: '#e8547a', c4: '#c2185b', border: '#f0ddd5' };

  const flowerPetal = ['', '#ffb3cc', '#ff85b3', '#ff3d7f', '#c2005a'];
  const flowerCenter = ['', '#ffe0ee', '#ffcce0', '#ffaacc', '#ff80aa'];

  // wi = índice da semana (coluna), dow = dia da semana (linha) — usados para o delay do bloom
  function flower(cx, cy, level, wi, dow) {
    const fc = flowerPetal[level];
    const cc = flowerCenter[level];
    let petals = '';
    for (let a = 0; a < 5; a++) {
      petals += `<ellipse cx="0" cy="-3.2" rx="2.2" ry="3.5" fill="${fc}" transform="rotate(${a * 72})"/>`;
    }
    if (!animate) {
      return `<g transform="translate(${cx},${cy})">${petals}<circle cx="0" cy="0" r="1.8" fill="${cc}"/></g>`;
    }
    const delay = wi * 20 + dow * 10;
    return `<g transform="translate(${cx},${cy})"><g class="bloom" style="animation-delay:${delay}ms">${petals}<circle cx="0" cy="0" r="1.8" fill="${cc}"/></g></g>`;
  }

  const cellSize = 11, gap = 2, step = cellSize + gap;
  const paddingLeft = 28, paddingTop = 32, paddingRight = 20, paddingBottom = 20;
  const graphW = weeks.length * step;
  const W = graphW + paddingLeft + paddingRight;
  const H = 7 * step + paddingTop + paddingBottom;

  let cells = '';
  let monthMarkers = [];
  let lastMonth = -1;
  let lastLabelWeek = -10;

  weeks.forEach((week, wi) => {
    const firstDay = week.contributionDays.find(d => d.date);
    if (firstDay) {
      const date = new Date(firstDay.date);
      const m = date.getMonth();
      const d = date.getDate();
      if (m !== lastMonth && d <= 7 && (wi - lastLabelWeek) > 2) {
        monthMarkers.push({ m, wi });
        lastMonth = m;
        lastLabelWeek = wi;
      }
    }
    week.contributionDays.forEach(day => {
      const dow = new Date(day.date).getDay();
      const x = paddingLeft + wi * step;
      const y = paddingTop + dow * step;
      if (day.contributionCount > 0) {
        cells += flower(x + cellSize / 2, y + cellSize / 2, getLevel(day.contributionCount), wi, dow);
      } else {
        cells += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" rx="2" fill="transparent" stroke="${isDark ? '#4a7a44' : '#52c41a'}" stroke-width="0.8" />`;
      }
    });
  });

  let monthLabels = '';
  monthMarkers.forEach(({ m, wi }) => {
    const x = paddingLeft + wi * step;
    monthLabels += `<text x="${x}" y="${paddingTop - 8}" font-size="9" fill="${isDark ? '#ffffff' : '#000000'}" font-family="${FONT_FAMILY}">${MONTHS[m]}</text>`;
  });

  const dayNames = ['','Mon','','Wed','','Fri',''];
  let dayLabels = '';
  dayNames.forEach((d, i) => {
    if (d) dayLabels += `<text x="${paddingLeft - 4}" y="${paddingTop + i * step + cellSize - 2}" font-size="8" fill="${isDark ? '#ffffff' : '#000000'}" font-family="${FONT_FAMILY}" text-anchor="end">${d}</text>`;
  });

  const style = animate ? `
  <style>
    @keyframes bloom {
      0% { transform: scale(0) rotate(-15deg); opacity: 0; }
      100% { transform: scale(1) rotate(0deg); opacity: 1; }
    }
    .bloom {
      transform-origin: 0px 0px;
      animation: bloom 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
    }
    @media (prefers-reduced-motion: reduce) {
      .bloom { animation: none; }
    }
  </style>` : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  ${style}
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
  const animate = searchParams.get('animate') !== 'false';

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
    const svg = generateSVG(cal.weeks, theme, username, cal.totalContributions, year, animate);

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
