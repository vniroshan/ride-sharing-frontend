<template>
  <transition name="fade">
    <!-- <v-alert
      v-if="api.isError"
      dense
      border="left"
      type="warning"
    >
      {{api.error}}
    </v-alert> -->
    <v-snackbar v-model="snackbar" :timeout="timeout" top right color="red">
      <v-icon> mdi-alert-circle </v-icon>
      {{api.error}}

      <template v-slot:action="{ attrs }">
        <v-icon v-bind="attrs" @click="snackbar = false"> mdi-close </v-icon>
      </template>
    </v-snackbar>
  </transition>
</template>

<script>
  export default {
    props:['api','callbackReset'],
    data: () => ({
    snackbar: false,
    timeout: 6000,
 }),
 watch: {
    snackbar: function () {
     if(this.snackbar == false){
      this.callbackReset()
     }
    },
  },
 created(){
  if(this.api.isError){
    this.snackbar = true
  }
 }
  }
</script>
