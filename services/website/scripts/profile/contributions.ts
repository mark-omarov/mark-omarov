export type Week = { start: string; days: number[] };
export type Calendar = { total: number; weeks: Week[] };

const QUERY = `query ($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks { firstDay contributionDays { contributionCount } }
      }
    }
  }
}`;

type Response = {
  data?: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number;
          weeks: {
            firstDay: string;
            contributionDays: { contributionCount: number }[];
          }[];
        };
      };
    } | null;
  };
  errors?: { message: string }[];
};

/** The last year of contributions, as on the profile's calendar. */
export async function fetchCalendar(
  login: string,
  token: string
): Promise<Calendar> {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      authorization: `bearer ${token}`,
      'content-type': 'application/json',
      'user-agent': 'omarov.dev-profile',
    },
    body: JSON.stringify({ query: QUERY, variables: { login } }),
  });
  if (!res.ok)
    throw new Error(`GitHub GraphQL ${res.status}: ${await res.text()}`);
  const json = (await res.json()) as Response;
  const cal = json.data?.user?.contributionsCollection.contributionCalendar;
  if (!cal)
    throw new Error(
      `GitHub GraphQL: ${json.errors?.map((e) => e.message).join('; ') ?? 'no data'}`
    );
  return {
    total: cal.totalContributions,
    weeks: cal.weeks.map((w) => ({
      start: w.firstDay,
      days: w.contributionDays.map((d) => d.contributionCount),
    })),
  };
}

/** A made-up year, for previews without a token. */
export function sampleCalendar(now: Date): Calendar {
  let seed = 1;
  const rand = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 2 ** 32;
  };
  const day = 86_400_000;
  const today = Math.floor(now.getTime() / day);
  const sunday = today - ((today + 4) % 7);
  const weeks: Week[] = [];
  let total = 0;
  for (let w = 52; w >= 0; w--) {
    const first = sunday - w * 7;
    const mood = 0.35 + 0.3 * Math.sin(w / 5) + 0.25 * rand();
    const days: number[] = [];
    for (let d = 0; d < 7 && first + d <= today; d++) {
      const weekend = d === 0 || d === 6;
      const n =
        rand() < mood * (weekend ? 0.6 : 1)
          ? Math.ceil(rand() ** 2 * 14 * mood)
          : 0;
      days.push(n);
      total += n;
    }
    weeks.push({
      start: new Date(first * day).toISOString().slice(0, 10),
      days,
    });
  }
  return { total, weeks };
}
