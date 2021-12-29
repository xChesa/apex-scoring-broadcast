import Vue from 'vue'
import VueRouter from 'vue-router'
import Admin from "../views/Admin";
import Scoreboard from "../views/Scoreboard";
import Display from "../views/Display";

Vue.use(VueRouter)

const routes = [
  {
    path: "/scoreboard/:eventId/:round/:mode/:display",
    name: "Scoreboard",
    component: Scoreboard,
    props: true,
  },
  {
    path: "/broadcast/:eventId",
    name: "display",
    component: Display,
    props: true,
  },
  {
    path: '/admin/:eventId?',
    name: 'admin',
    component: Admin,
    props: true,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
