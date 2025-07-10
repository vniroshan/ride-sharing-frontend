<template>
  <v-breadcrumbs class="px-0" :items="modifiedItems"></v-breadcrumbs>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    components:{
      //
    },
  computed: {
    ...mapState({
      //
    }),
    modifiedItems() {
      // Ensure `modifiedItems` updates whenever `items` changes
      const itemsCopy = [...this.items]; // Avoid mutating props
      if (itemsCopy[0] && itemsCopy[0].to && itemsCopy[0].to.name !== "DriverDashboardView") {
        itemsCopy.unshift({
          text: "Dashboard",
          to: { name: "DriverDashboardView" },
          exact: true,
        });
      }
      return itemsCopy;
    }
  },
    props:[
      'items'
    ],
    data: () => ({
      //
    }),
    created() {
      //
    },
    mounted() {
      //
    },
    methods: {
      //
    }
  }
</script>