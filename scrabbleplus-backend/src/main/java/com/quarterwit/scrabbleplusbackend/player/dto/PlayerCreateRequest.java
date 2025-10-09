package com.quarterwit.scrabbleplusbackend.player.dto;

/**
 * Sent from client to create a new player.
 */
public record PlayerCreateRequest(String username) { }
