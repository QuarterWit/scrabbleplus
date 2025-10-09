package com.quarterwit.scrabbleplusbackend.player;
import com.quarterwit.scrabbleplusbackend.player.dto.*; import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/players")
public class PlayerController {
    private final PlayerService svc;
    public PlayerController(PlayerService svc){ this.svc = svc; }

    @PostMapping public PlayerDTO create(@RequestBody @Valid PlayerCreateRequest r){ return svc.create(r); }
    @GetMapping("/{id}") public PlayerDTO findById(@PathVariable Long id){ return svc.findById(id); }
}
