export type Metrics = { playersOnline:number; gamesActive:number; avgQueueSeconds:number };
export type LeaderboardRow = { rank:number; player:string; rating:number };
export type LiveGame = { id:string; p1:string; p2:string; turn:number };
