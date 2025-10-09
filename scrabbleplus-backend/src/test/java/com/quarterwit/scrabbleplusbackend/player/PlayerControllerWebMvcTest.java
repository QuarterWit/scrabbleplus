package com.quarterwit.scrabbleplusbackend.player;

import com.quarterwit.scrabbleplusbackend.player.dto.PlayerDTO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
// 🆕
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PlayerController.class)
class PlayerControllerWebMvcTest {

    @Autowired MockMvc mvc;

    // 🆕 replace @MockBean with @MockitoBean
    @MockitoBean PlayerService playerService;

    @Test
    void getById_returns200AndBody() throws Exception {
        // ✅ record has (Long, String, int)
        when(
                // ⬇️ use the real method name your service exposes:
                // e.g., playerService.findById(1L)
                playerService.findById(1L)
        ).thenReturn(new PlayerDTO(1L, "alice", 0));

        // ⬇️ align with your controller mapping (adjust if /api/players/{id})
        // URL
        mvc.perform(get("/api/players/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.username").value("alice"))
                .andExpect(jsonPath("$.score").value(0));

    }
}
