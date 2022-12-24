import Vue from 'vue'
import VueRouter from 'vue-router'
import Admin from "../views/Admin";
import Broadcast from "../views/Broadcast";
import Index from "../views/Index";
import Stats from "../views/Stats";
import Standings from "../components/stats/Standings";

import Scoreboard from "../components/stats/standings/Scoreboard";
import TeamStandings from "../components/stats/standings/TeamStandings";
import PlayerStandings from "../components/stats/standings/PlayerStandings";

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    name: "index",
    component: Index,
    props: true,
  },
  {
    path: "/broadcast/:organizer/:eventId",
    name: "broadcast",
    component: Broadcast,
    props: true,
  },
  {
    path: '/admin/:organizer?/:eventId?',
    name: 'admin',
    component: Admin,
    props: true,
  },
  {
    path: "/stats/:organizer/:eventId/",
    name: "stats",
    component: Stats,
    props: true,
    children: [
      {
        path: "standings/:game?",
        name: "standings",
        component: Standings,
        props: true,
        redirect: { name: "standings.scoreboard" },
        children: [
          {
            path: "scoreboard",
            name: "standings.scoreboard",
            component: Scoreboard,
            props: true,
          },
          {
            path: "team-standings",
            name: "standings.team",
            component: TeamStandings,
            props: true,
          },
          {
            path: "player-standings",
            name: "standings.player",
            component: PlayerStandings,
            props: true,
          }
        ]
      }
    ]
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
