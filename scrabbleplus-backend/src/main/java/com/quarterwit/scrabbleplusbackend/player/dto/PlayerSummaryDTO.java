package com.quarterwit.scrabbleplusbackend.player.dto;

/**
 * Lightweight summary view of a player (e.g. leaderboard, lobby list).
 */
public record PlayerSummaryDTO(String username, int score) { }
