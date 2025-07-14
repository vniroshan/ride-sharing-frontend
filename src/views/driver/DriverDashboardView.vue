<template>
  <v-container>
    <!-- BOC:[breadcrumbs] -->
    <ABreadcrumb :items="breadcrumbs"></ABreadcrumb>
    <!-- EOC -->

    <div class="mb-4">
      <h2>Welcome, {{ account.first_name }} {{ account.last_name }}!</h2>
      <div class="text-center">
        <v-btn
        color="#0074e7"
        class="post-ride-btn mt-3"
        large
        block
        width="80%"
        :to="{name: 'RideCreationView'}"
      >
        Post New Ride
      </v-btn>
      </div>
    
    </div>
  </v-container>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "DashboardView",
  computed: {
    ...mapState({
      account: (state) => state.account.data,
    }),
  },
  components: {},
  data: () => ({
    //BOC:[breadcrumbs]
    breadcrumbs: [],
    //EOC
  }),
  methods: {
  },
  created() {
    //BOC:[breadcrumbs]
    this.breadcrumbs.push({
      text: "Dashboard",
      to: { name: "DriverDashboardView" },
      exact: true,
    });
    //EOC

  },
};
</script>

<style scoped>
.v-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.v-card-title h3 {
  font-weight: 600;
  color: #333;
}

.v-list-item {
  min-height: 60px;
}

.v-list-item:not(:last-child) {
  border-bottom: 1px solid #f0f0f0;
}

/* Date filter card styling */
.v-card[outlined] {
  border: 1px solid #e0e0e0;
  background-color: #fafafa;
}

.post-ride-btn {
  background: #0074e7 !important;
  color: #fff !important;
  font-weight: 600;
  font-size: 1.1rem;
  border-radius: 8px;
  min-width: 180px;
  box-shadow: 0 2px 8px rgba(0,116,231,0.08);
}

/* Responsive adjustments for date filter */
@media (max-width: 600px) {
  .v-col h4 {
    margin-bottom: 8px;
  }
}
</style>

