<template>
  <v-app>
    <v-main class="cyan lighten-5 no-app-bar">
      <router-view/>
    </v-main>
  </v-app>
</template>
<script>
  import { mapState } from 'vuex'
  export default {
    components:{
      //
    },
    computed: mapState({
      
    }),
    props:[
      //
    ],
    data: () => ({
     
    }),
    created() {
      //
    },
    mounted() {
    },
    methods: {
      //
    }
  };
</script>
<style scoped>
/* Remove app bar spacing */
.no-app-bar {
  padding-top: 0 !important;
}

/* Hide any app bars within this layout */
.v-app >>> .v-app-bar {
  display: none !important;
}

/* Ensure full height */
.v-main {
  min-height: 100vh;
}
</style>