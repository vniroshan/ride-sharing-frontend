<template>
  <v-footer
    dark
    color="primary"
    padless
  >
    <v-card
      class="flex"
      flat
      tile
      color="primary"
    >
      <v-card-text class="py-2 white--text text-center">
        Copyright ©{{ new Date().getFullYear() }} — <strong>Rideshare.</strong> All Rights Reserved.
        <br>
        <router-link
          :to="{ name: 'TermsOfServiceView' }"
          class="white--text text-decoration-none mx-2"
        >
          Terms of Service
        </router-link>
        |
        <router-link
          :to="{ name: 'PrivacyPolicyView' }"
          class="white--text text-decoration-none mx-2"
        >
          Privacy Policy
        </router-link>
      </v-card-text>
    </v-card>
  </v-footer>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    components:{
      //
    },
    computed: mapState({
      //
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
  }
</script>