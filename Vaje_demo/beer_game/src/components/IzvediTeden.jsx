import { useState } from "react";
import { useGame } from "../game/useGame";
import { MAX_LAST_WEEK, MIN_LAST_WEEK, isGameOver } from "../game/engine";

const IzvediTeden = () => {
  const { game, advanceWeek, reset, setLastWeek } = useGame();
  const over = isGameOver(game);
  const started = game.history.length > 0;
  // What is typed in the length field; only valid numbers reach the game, so typing
  // "30" does not briefly set the game to 3 weeks.
  const [draft, setDraft] = useState(null);

  return (
    <div className="controls">
      <div className="controls-status">
        {over ? "Konec igre" : `Teden ${game.week} / ${game.lastWeek}`}
      </div>
      <div className="controls-buttons">
        <button onClick={advanceWeek} disabled={over}>
          Izvedi teden
        </button>
        <button onClick={reset} disabled={!started}>
          Nova igra
        </button>
      </div>
      <label className="controls-length" title={started ? "Dolžino lahko spremeniš pred prvim tednom ali po »Nova igra«." : undefined}>
        Število tednov:
        <input
          type="number"
          min={MIN_LAST_WEEK}
          max={MAX_LAST_WEEK}
          disabled={started}
          value={draft ?? game.lastWeek}
          onChange={(e) => {
            setDraft(e.target.value);
            setLastWeek(e.target.value);
          }}
          onBlur={() => setDraft(null)}
        />
      </label>
    </div>
  );
};

export default IzvediTeden;
