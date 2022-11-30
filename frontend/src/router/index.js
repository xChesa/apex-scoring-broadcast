import Vue from 'vue'
import VueRouter from 'vue-router'
import Admin from "../views/Admin";
import Broadcast from "../views/Broadcast";
import Public from "../views/Public";
import Leaderboard from "../views/Leaderboard";
Vue.use(VueRouter)

const routes = [
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
    path: "/public",
    name: "public",
    component: Public,
    props: true,
    children: [
      {
        path: "leaderboard/:organizer/:eventId/:round?",
        name: "leaderboard",
        component: Leaderboard,
        props: true,
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
