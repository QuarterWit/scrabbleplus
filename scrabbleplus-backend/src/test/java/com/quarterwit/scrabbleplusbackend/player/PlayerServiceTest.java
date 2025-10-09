package com.quarterwit.scrabbleplusbackend.player;

import com.quarterwit.scrabbleplusbackend.player.dto.PlayerCreateRequest;
import com.quarterwit.scrabbleplusbackend.player.dto.PlayerDTO;
import com.quarterwit.scrabbleplusbackend.player.entity.Player;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class PlayerServiceTest {

    @Test
    void findById_mapsEntityToDto() {
        PlayerRepository repo = mock(PlayerRepository.class);
        PlayerService service = new PlayerService(repo);

        Long id = 1L;

        // Build the entity in whatever way your class supports:
        // Player p = new Player(id, "alice", 0);
        Player p = new Player();     // <-- if you only have no-arg + setters
        p.setId(id);
        p.setUsername("alice");
        p.setScore(0);

        when(repo.findById(id)).thenReturn(Optional.of(p));

        PlayerDTO dto = service.findById(id);

        assertThat(dto.id()).isEqualTo(id);
        assertThat(dto.username()).isEqualTo("alice");
        // assertThat(dto.score()).isEqualTo(0);
        verify(repo).findById(id);
    }

    @Test
    void create_savesMappedEntity_andReturnsId() {
        PlayerRepository repo = mock(PlayerRepository.class);
        PlayerService service = new PlayerService(repo);

        ArgumentCaptor<Player> captor = ArgumentCaptor.forClass(Player.class);

        when(repo.save(any(Player.class))).thenAnswer(inv -> {
            Player saved = inv.getArgument(0);
            saved.setId(42L); // simulate DB-generated id
            return saved;
        });

        PlayerCreateRequest req = new PlayerCreateRequest("bob" /* add other fields if needed */);

        PlayerDTO dto = service.create(req);

        assertThat(dto.id()).isEqualTo(42L);

        verify(repo).save(captor.capture());
        assertThat(captor.getValue().getUsername()).isEqualTo("bob");
    }
}
