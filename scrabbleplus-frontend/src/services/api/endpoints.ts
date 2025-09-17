export const endpoints = {
  metricsNow: () => "/api/metrics/now",
  liveGames: (limit=8) => `/api/games/live?limit=${limit}`,
  leaderboard: (scope:"today"|"season"|"all"="today") => `/api/leaderboard?scope=${scope}`,
  season: () => "/api/season",
  newsLatest: () => "/api/news/latest",
};
