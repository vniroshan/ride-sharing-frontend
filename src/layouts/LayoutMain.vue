<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <SiteLogo></SiteLogo>
      <v-spacer></v-spacer>
      <v-btn class="pr-2" plain color="white" text  :to="{name:'RideList'}" dark>Home</v-btn>
       <v-btn class="pr-2" plain color="white" text  :to="{name:'RideListView'}" dark>Rides</v-btn>
      <v-btn color="white" plain v-if="!account" text :to="{name:'LoginView'}" dark>Driver Login</v-btn>
       <v-btn color="white" plain v-else text :to="{name:'LogoutView'}" dark>Logout</v-btn>
    </v-app-bar>
    <v-main 
    :style="{backgroundImage: `url(${require('@/assets/skyline.png')})`,
    backgroundSize: 'cover' ,
    backgroundopacity:'0.5', 
    backgroundRepeat: 'no-repeat',
    backgroundPosition:'center',
    height:'100%',
    width:'100%'}">
      <router-view :key="$route.fullPath" />
    </v-main>
    <AFooter></AFooter>
  </v-app>
</template>

<script>
import SiteLogo from "@/components/SiteLogo";
import AFooter from "@/components/AFooter";
import { mapState } from "vuex";
export default {
  computed: mapState({
    account: (state) => state.account.data,
  }),
  components: {
    SiteLogo,
    AFooter,
  },
  data: () => ({
    showMainMenu: false,
    type: null,
    showAccountMenu: false,
    minimised: false,
    dialog: false,
    dialogAccount: false,
    notifications: false,
    sound: true,
    widgets: false,
    debugMode: false,
    menu: [
      {
        icon: "mdi-home",
        route: { name: "PageMainHome" },
      },
      {
        icon: "mdi-calendar-star",
        route: { name: "PageMainEvent" },
      },
      {
        icon: "mdi-cloud-question",
        route: { name: "PageMainDiscover" },
      },
      // {
      //   icon: "mdi-bullhorn",
      //   route: { name: "PageMainNews" },
      // },
      {
        type: "divider",
      },
      {
        icon: "mdi-earth",
        route: { name: "PageMainLogin" },
        isGuest: true,
      },
      {
        type: "divider",
      },
      {
        icon: "mdi-earth",
        route: { name: "PageMainLanguage" },
      },
      // {
      //   icon: "mdi-help",
      //   route: { name: "PageMainHelp" },
      // },
      // {
      //   type: "divider",
      // },
      // {
      //   icon: "mdi-currency-usd",
      //   route: { name: "PageMainSupportUs" },
      // },
    ],
  }),
  created() {},
  mounted() {},
  methods: {},
};
</script>
<style scoped>
</style>