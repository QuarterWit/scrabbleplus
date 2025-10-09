package com.quarterwit.scrabbleplusbackend.player;

import com.quarterwit.scrabbleplusbackend.player.entity.Player;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest(properties = "spring.jpa.hibernate.ddl-auto=create-drop")
class PlayerRepositoryTest {
    @Autowired PlayerRepository repo;

    @Test
    void save_and_findById() {
        var p = new Player();
        p.setUsername("carol"); p.setScore(0);

        var saved = repo.save(p);
        var found = repo.findById(saved.getId()).orElseThrow();

        assertThat(found.getId()).isNotNull();
        assertThat(found.getUsername()).isEqualTo("carol");
    }
}

