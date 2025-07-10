<template>
  <v-container>
  </v-container>
</template>

<script>
  export default {
    data:()=>({
      //
    }),
    created() {
      this.$store.dispatch('logout')
    },
    mounted() {
      this.$router.push({name:'LoginView'})
    },
  }
</script>
