package com.quarterwit.scrabbleplusbackend.player.dto;

/**
 * Standard response DTO for returning player info.
 */
public record PlayerDTO(Long id, String username, int score) { }
