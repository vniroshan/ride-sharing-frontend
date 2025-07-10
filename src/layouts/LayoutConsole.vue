<template>
<v-app>
  <v-app-bar 
    app
    dark
    color="primary"
  >
    <v-app-bar-nav-icon class="d-flex d-sm-none" @click.stop="shown = !shown"></v-app-bar-nav-icon>
    <v-app-bar-nav-icon class="d-none d-sm-flex" @click.stop="minimised = !minimised"></v-app-bar-nav-icon>
    <SiteLogo></SiteLogo>
    <v-spacer></v-spacer>
    <!-- <v-btn
      :to="{'name':'PageMainHome'}"
      text
      class="mr-1 d-none d-sm-flex"
    >
      <span>Home</span>
    </v-btn> -->
  </v-app-bar>
  <v-navigation-drawer 
    app
    v-model="shown"
    :mobile-breakpoint="600"
    class="d-flex d-sm-none"
  >
    <AppMenu></AppMenu>
  </v-navigation-drawer>
  <v-navigation-drawer 
    app
    :mini-variant="minimised"
    :mobile-breakpoint="600"
    class="d-none d-sm-flex"
  >
    <AppMenu></AppMenu>
  </v-navigation-drawer>
  <v-main>
    <router-view :key="$route.fullPath"/>
  </v-main>
   <AppFooter></AppFooter>
</v-app>
</template>

<script>
  import AppMenu from '@/components/AMenu'
  import SiteLogo from '@/components/SiteLogo'
  import AppFooter from "@/components/AFooter";
  import { mapState } from "vuex";
  export default {
    components:{
      AppFooter,
      SiteLogo,
      AppMenu
    },
    data: () => ({
      shown: false,
      minimised:false,
    }),
    computed: mapState({
  }),
  mounted(){

  },
  methods:{
   
  }
  }
</script>
<style scoped>

</style>