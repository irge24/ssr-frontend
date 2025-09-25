import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import DocView from "@/views/DocView.vue";
import NewDocView from "@/views/NewDocView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/doc/:id",
    name: "doc",
    component: DocView,
    props: true,
  },
  {
    path: "/new",
    name: "newdoc",
    component: NewDocView,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
