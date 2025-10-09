package com.quarterwit.scrabbleplusbackend.player;
import com.quarterwit.scrabbleplusbackend.player.entity.Player;
import org.springframework.data.jpa.repository.*; import java.util.*;
public interface PlayerRepository extends JpaRepository<Player, Long> {
    Optional<Player> findByUsername(String username);
    List<Player> findTop10ByOrderByScoreDesc();
}
