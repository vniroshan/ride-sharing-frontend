<template>
  <v-container>
    <ABreadcrumb :items="breadcrumbs"></ABreadcrumb>

    <div class="mb-4">
      <h2>Welcome, {{ account.first_name }} {{ account.last_name }}!</h2>
      <div class="d-flex flex-wrap mt-6">
        <v-btn
          color="primary"
          class="ma-2"
          large
          :to="{name: 'RideCreationView'}"
        >
          <v-icon left>mdi-car</v-icon>
          Post New Ride
        </v-btn>
        
        <v-btn
          color="secondary"
          class="ma-2"
          large
          :to="{name: 'DriverVehiclesView'}"
        >
          <v-icon left>mdi-car-multiple</v-icon>
          Manage Vehicles
        </v-btn>
      </div>
    </div>

    <!-- Quick Stats Section -->
    <v-row class="mt-4">
      <v-col cols="12" md="4">
        <v-card class="pa-4 text-center">
          <h3>Your Vehicles</h3>
          <div class="text-h4">{{ vehicleCount }}</div>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="pa-4 text-center">
          <h3>Active Rides</h3>
          <div class="text-h4">{{ activeRides }}</div>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="pa-4 text-center">
          <h3>Total Earnings</h3>
          <div class="text-h4">${{ totalEarnings }}</div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "DriverDashboardView",
  computed: {
    ...mapState({
      account: (state) => state.account.data,
    }),
  },
  data: () => ({
    breadcrumbs: [
      { text: "Dashboard", to: { name: "DriverDashboardView" }, exact: true }
    ],
    vehicleCount: 0,
    activeRides: 0,
    totalEarnings: 0
  }),
  async mounted() {
    await this.fetchDashboardStats();
  },
  methods: {
    async fetchDashboardStats() {
      try {
        // Fetch vehicle count
        const vehiclesRes = await this.$axios.get('/driver/vehicles/all');
        this.vehicleCount = vehiclesRes.data.totalCount || 0;
        
        // You would add similar calls for rides and earnings here
        // This is just placeholder data
        this.activeRides = 2;
        this.totalEarnings = 1250;
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      }
    }
  }
};
</script>

<style scoped>
.v-card {
  transition: all 0.3s ease;
}
.v-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
</style>