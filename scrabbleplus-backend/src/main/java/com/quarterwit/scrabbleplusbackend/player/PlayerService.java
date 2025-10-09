package com.quarterwit.scrabbleplusbackend.player;
import com.quarterwit.scrabbleplusbackend.player.dto.*; import com.quarterwit.scrabbleplusbackend.player.entity.Player;
import org.springframework.stereotype.Service; import org.springframework.transaction.annotation.Transactional;

@Service
public class PlayerService {
    private final PlayerRepository repo;
    public PlayerService(PlayerRepository repo){ this.repo = repo; }

    @Transactional
    public PlayerDTO create(PlayerCreateRequest r){
        var p = new Player(); p.setUsername(r.username()); p.setScore(0);
        p = repo.save(p);
        return new PlayerDTO(p.getId(), p.getUsername(), p.getScore());
    }

    public PlayerDTO findById(Long id){
        var p = repo.findById(id).orElseThrow();
        return new PlayerDTO(p.getId(), p.getUsername(), p.getScore());
    }
}
