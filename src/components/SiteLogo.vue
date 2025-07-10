<template>
  <v-btn href="/" text exact>
    <div class="d-flex align-center">
      <v-img
        alt="Vuetify Logo"
        class="shrink mr-2 logo-white"
        contain
        :src="require('@/assets/logo_main.png')"
        transition="scale-transition"
        width="120"
      />
      <!-- <v-chip small class="mr-1 d-none d-sm-flex">{{ $version }}</v-chip> -->
    </div>
  </v-btn>
</template>

<script>
export default {
  data: () => ({
    env: process.env.VUE_APP_ENV,
  }),
};
</script>
<style scoped>
.logo-white {
  filter: brightness(0) invert(1);
}
</style>
