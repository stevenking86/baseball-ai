const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Allow all origins

// Helper to get yesterday's date in YYYY-MM-DD
function getYesterdayDate() {
  const d = new Date(Date.now() - 86400000);
  return d.toISOString().split('T')[0];
}

// Route: /furthest-homer
app.get('/furthest-homer', async (req, res) => {
  const date = getYesterdayDate();
  console.log("DATE", date);
  try {
    // 1. Get all games on that date
    const scheduleRes = await fetch(`https://statsapi.mlb.com/api/v1/schedule?date=${date}&sportId=1`);
    const scheduleData = await scheduleRes.json();
    const gamePks = scheduleData.dates?.[0]?.games.map(g => g.gamePk) || [];
    let maxHR = { distance: 0, player: null, game: null };

    // 2. Loop through each game and get play-by-play data
    for (const gamePk of gamePks) {
      const pbpRes = await fetch(`https://statsapi.mlb.com/api/v1.1/game/${gamePk}/feed/live`);
      if (!pbpRes.ok) {
      console.warn(`Game ${gamePk} fetch failed with status ${pbpRes.status}`);
      continue; // skip this game
  }

  const pbpData = await pbpRes.json();
  const plays = pbpData.liveData?.plays?.allPlays || [];

    for (const play of plays) {
      if (play.result?.event === 'Home Run') {
        const hitEvent = play.playEvents?.find(e => e.hitData && e.hitData.totalDistance);
        const distance = hitEvent?.hitData?.totalDistance;
        const batter = play.matchup?.batter?.fullName;

        // Get team name
        let teamName = play.matchup?.battingTeam?.name;
        if (!teamName) {
          // fallback to team lookup from gameData
          const teamId = play.matchup?.battingTeamId;
          teamName = pbpData.gameData?.teams?.home?.id === teamId
            ? pbpData.gameData?.teams?.home?.name
            : pbpData.gameData?.teams?.away?.name;
        }

        // Get pitch type
        const pitchEvent = play.playEvents?.find(e => e.details?.type?.description);
        const pitchType = pitchEvent?.details?.type?.description || null;
        if (distance && distance > maxHR.distance) {
          maxHR = {
            distance,
            player: batter,
            game: gamePk,
            team: teamName,
            pitchType: pitchType,
            date: date
          };
        }
      }
    }
  }

    if (maxHR.distance > 0) {
      res.json(maxHR);
    } else {
      res.status(404).json({ message: 'No home runs found' });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server listening on http://localhost:${PORT}`);
});
