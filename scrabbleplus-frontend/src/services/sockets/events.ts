// Event name constants (to be used with socket.io or native WS later)
export const LOBBY_EVENTS = {
  PlayersOnline: "players:online",
  GamesLive: "games:live",
  QueueETA: "queue:eta",
} as const;

export const CHAT_EVENTS = {
  New: "chat:new",
  Typing: "chat:typing",
} as const;
