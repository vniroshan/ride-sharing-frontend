<template>
  <v-app>
    <v-main class="no-app-bar" :style="{backgroundImage: `url(${require('@/assets/skyline.png')})`,
    backgroundSize: 'cover' ,
    backgroundopacity:'0.5', 
    backgroundRepeat: 'no-repeat',
    backgroundPosition:'center',
    height:'100vh',
    width:'100vw'}"
    >
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