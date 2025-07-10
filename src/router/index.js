import Vue from "vue";
import VueRouter from "vue-router";
import LayoutMain from "../layouts/LayoutMain.vue";
// import LayoutBlank from "../layouts/LayoutBlank.vue";
// import LayoutConsole from "../layouts/LayoutConsole.vue";

//BOC:[state]
import store from "./../store/index";
//EOC

//BOC:[guard]
import multiguard from "vue-router-multiguard";
const loggedIn = function (to, from, next) {
  if (!store.state.account.data) next({ name: "LoginView" });
  next();
};

const notLoggedIn = function (to, from, next) {
  if (store.state.account.data && store.state.account.data.token) {
    next({ name: "DriverDashboardView" });
  }
  next();
};
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: LayoutMain,
    beforeEnter: multiguard([notLoggedIn]),
    children: [
       {
        path: "",
        name: "HomeView",
        component: () =>
          import(/* webpackChunkName: "home-view" */ "@/views/HomeView.vue"),
        props: true,
      },
      {
        path: "/login",
        name: "LoginView",
        component: () =>
          import(/* webpackChunkName: "login-view" */ "@/views/LoginView.vue"),
        props: true,
      },
    ],
  },
  {
    path: "/driver",
    component: LayoutMain,
    beforeEnter: multiguard([loggedIn]),
    props: true,
    children: [
      {
        path: "dashboard",
        name: "DriverDashboardView",
        component: () =>
          import(
            /* webpackChunkName: "driver-dashboard-view" */ "@/views/driver/DriverDashboardView.vue"
          ),
        props: true,
        meta: {
          title: "Dashboard",
        },
      },
      {
        path: "logout",
        name: "LogoutView",
        component: () =>
          import(
            /* webpackChunkName: "logout-view" */ "@/views/LogoutView.vue"
          ),
        props: true,
      },
    ],
  },
  {
    path: "/",
    component: LayoutMain,
    children: [
        {
        path: "privacy-policy",
        name: "PrivacyPolicyView",
        component: () =>
          import(
            /* webpackChunkName: "privacy-policy-view" */ "@/views/PrivacyPolicyView.vue"
          ),
        props: true,
        meta: {
          title: "Privacy Policy",
        },
      },
       {
        path: "terms-of-service",
        name: "TermsOfServiceView",
        component: () =>
          import(
            /* webpackChunkName: "terms-of-service" */ "@/views/TermsOfServiceView.vue"
          ),
        props: true,
        meta: {
          title: "Terms of service",
        },
      },
      {
        path: "/:catchAll(.*)",
        name: "ErrorNotFoundView",
        component: () =>
          import(
            /* webpackChunkName: "not-found-view" */ "@/views/error/ErrorNotFoundView.vue"
          ),
        props: true,
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    // If there's a saved position (e.g., navigating back), use it
    if (savedPosition) {
      return savedPosition;
    }
    // Otherwise, scroll to the top
    return { x: 0, y: 0 };
  },
});
router.beforeEach((to, from, next) => {
  // Retrieve user's access codes
  const permissions =
    store.state.account && store.state.account.data
      ? store.state.account.data.permissions
      : [];

  // Check if the route requires a permission
  if (to.meta.permission) {
    if (permissions.includes(to.meta.permission)) {
      // User has permission
      return next();
    } else {
      // User does not have permission
      return next({ name: "ErrorNotFoundView" });
    }
  }
  // If route doesn't require a permission, proceed normally
  return next();
});
router.afterEach((to) => {
  //BOC:[page title]
  Vue.nextTick(() => {
    document.title = to.meta.title
      ? to.meta.title + " | Rideshare"
      : "Rideshare";
  });
  //EOC
});

export default router;
