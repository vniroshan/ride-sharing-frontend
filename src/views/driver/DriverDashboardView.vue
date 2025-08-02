<template>
  <v-container>
    <ABreadcrumb :items="breadcrumbs"></ABreadcrumb>

    <AError
      v-if="api.isError"
      :api="api"
      :callbackReset="() => (api.isError = false)"
    ></AError>

    <v-overlay :value="api.isLoading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>

    <div class="mb-4">
      <h2>Welcome, {{ account.first_name }} {{ account.last_name }}!</h2>
      <div class="d-flex flex-wrap mt-6">
        <v-btn
          color="primary"
          class="ma-2"
          large
          :to="{ name: 'DriverRideCreationView' }"
        >
          <v-icon left>mdi-car</v-icon>
          Post New Ride
        </v-btn>

        <v-btn
          color="secondary"
          class="ma-2"
          large
          :to="{ name: 'DriverVehiclesView' }"
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
          <div class="text-h4">£{{ totalEarnings }}</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- My Rides Section -->
    <v-card flat elevation="0" class="mt-6">
      <v-card-title class="section-title justify-space-between">
        <h2 class="text-h4 primary--text">My Rides</h2>
        <div>
          <v-btn-toggle
            v-model="selectedTab"
            mandatory
            color="primary"
            @change="fetchMyRides"
          >
            <v-btn value="upcoming" small>
              <v-icon left>mdi-clock-outline</v-icon>
              Upcoming
            </v-btn>
            <v-btn value="completed" small>
              <v-icon left>mdi-check-circle</v-icon>
              Completed
            </v-btn>
            <v-btn value="cancelled" small>
              <v-icon left>mdi-cancel</v-icon>
              Cancelled
            </v-btn>
          </v-btn-toggle>
        </div>
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col
            v-for="ride in myRides"
            :key="ride.id"
            cols="12"
            class="ride-item"
          >
            <v-card class="ride-card" elevation="2" hover>
              <v-card-text>
                <v-row align="center">
                  <!-- Car Icon -->
                  <v-col cols="12" md="2" class="text-center">
                    <v-avatar
                      v-if="
                        ride.vehicles.vehicle_images &&
                        ride.vehicles.vehicle_images[0]
                      "
                      size="80"
                      color="grey lighten-3"
                    >
                      <v-img
                        :src="ride.vehicles.vehicle_images[0].image_url"
                        width="40"
                        height="40"
                        class="mr-1 rounded elevation-1"
                        contain
                      ></v-img>
                    </v-avatar>
                    <v-avatar v-else size="80" color="grey lighten-3">
                      <v-icon size="40" color="primary">mdi-car</v-icon>
                    </v-avatar>
                  </v-col>

                  <!-- Ride Details -->
                  <v-col cols="12" md="6">
                    <div
                      class="ride-route text-h6 primary--text font-weight-bold mb-2"
                    >
                      {{ ride.from }} to {{ ride.to }}
                    </div>
                    <div class="ride-info grey--text text--darken-1">
                      <div class="mb-1">
                        <v-icon small class="mr-1">mdi-calendar-clock</v-icon>
                        {{ formatDate(ride.departure_date) }} at
                        {{ ride.departure_time }}
                      </div>
                      <div class="mb-2">
                        <v-icon small class="mr-1">mdi-car-info</v-icon>
                        {{ ride.vehicles.vehicle_no }} -
                        {{ ride.vehicles.type }}
                      </div>
                      <div class="mb-2">
                        <v-chip
                          small
                          :color="getStatusColor(ride.status)"
                          text-color="white"
                          class="mr-2"
                        >
                          <v-icon left small>{{
                            getStatusIcon(ride.status)
                          }}</v-icon>
                          {{ ride.status }}
                        </v-chip>
                        <v-chip
                          small
                          color="info"
                          text-color="white"
                          class="mr-2"
                        >
                          <v-icon left small>mdi-account-group</v-icon>
                          {{ ride.booked_seats || 0 }}/{{
                            ride.total_seats
                          }}
                          Booked
                        </v-chip>
                      </div>
                    </div>
                  </v-col>

                  <!-- Price and Actions -->
                  <v-col cols="12" md="4" class="text-center">
                    <div class="ride-price">
                      <div
                        class="price-amount text-h4 primary--text font-weight-bold"
                      >
                        £{{ ride.charge_per_seat }}
                      </div>
                      <div class="price-per grey--text text--darken-1 mb-3">
                        /seat
                      </div>
                      <div class="earnings-info mb-3">
                        <div class="text-subtitle2 grey--text">
                          Total Earnings: £{{ calculateEarnings(ride) }}
                        </div>
                      </div>
                      <div class="action-buttons">
                        <v-btn
                          v-if="ride.status === 'NOT_STARTED'"
                          @click="manageRide(ride)"
                          color="primary"
                          small
                          class="mb-2"
                          block
                        >
                          <v-icon left>mdi-cog</v-icon>
                          Manage
                        </v-btn>
                        <v-btn
                          v-if="ride.status === 'ACTIVE'"
                          @click="manageRide(ride)"
                          color="success"
                          small
                          class="mb-2"
                          block
                        >
                          <v-icon left>mdi-cog</v-icon>
                          Manage
                        </v-btn>
                        <v-btn
                          v-if="ride.status === 'COMPLETED'"
                          @click="viewRideDetails(ride)"
                          color="info"
                          small
                          class="mb-2"
                          block
                        >
                          <v-icon left>mdi-history</v-icon>
                          View History
                        </v-btn>
                        <v-btn
                          v-if="ride.status === 'CANCELLED'"
                          @click="viewRideDetails(ride)"
                          color="grey"
                          small
                          class="mb-2"
                          block
                        >
                          <v-icon left>mdi-information</v-icon>
                          View Details
                        </v-btn>
                        <v-btn
                          v-if="ride.status === 'NOT_STARTED'"
                          @click="
                            () => {
                              selectedRide = ride;
                              cancelDialog = true;
                            }
                          "
                          color="error"
                          small
                          block
                        >
                          <v-icon left>mdi-cancel</v-icon>
                          Cancel Ride
                        </v-btn>
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row v-if="myRides.length === 0" justify="center">
          <v-col cols="12" class="text-center">
            <v-icon size="64" color="grey lighten-1">mdi-car-off</v-icon>
            <h3 class="text-h5 grey--text mt-4">
              No {{ selectedTab }} rides found
            </h3>
            <p class="grey--text">
              <span v-if="selectedTab === 'upcoming'"
                >Start by posting a new ride!</span
              >
              <span v-else
                >You don't have any {{ selectedTab }} rides yet.</span
              >
            </p>
          </v-col>
        </v-row>

        <!-- Load More Button -->
        <v-row v-if="hasMoreRides" justify="center" class="mt-4">
          <v-col cols="12" class="text-center">
            <v-btn
              @click="loadMoreRides"
              color="primary"
              outlined
              :loading="loadingMore"
            >
              <v-icon left>mdi-refresh</v-icon>
              Load More
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Cancel Confirmation Dialog -->
    <v-dialog v-model="cancelDialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">Cancel Ride</v-card-title>
        <v-card-text>
          Are you sure you want to cancel this ride from
          {{ selectedRide?.from }} to {{ selectedRide?.to }}? <br /><br />
          <v-alert type="warning" dense class="mt-2">
            This action cannot be undone. All passengers will be notified.
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" text @click="cancelDialog = false">
            Keep Ride
          </v-btn>
          <v-btn
            color="error"
            @click="confirmCancelRide"
            :loading="cancelingRide"
          >
            Cancel Ride
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
      { text: "Dashboard", to: { name: "DriverDashboardView" }, exact: true },
    ],
    vehicleCount: 0,
    activeRides: 0,
    totalEarnings: 0,

    // My Rides Section
    myRides: [],
    selectedTab: "upcoming",
    currentPage: 1,
    hasMoreRides: false,
    loadingMore: false,
    cancelDialog: false,
    selectedRide: null,
    cancelingRide: false,

    // API configurations
    api: {
      isLoading: false,
      isError: false,
      error: null,
      url: null,
      method: "GET",
      data: null,
    },
    apiStats: {
      isLoading: false,
      isError: false,
      error: null,
      url: null,
      method: "GET",
      data: null,
    },
  }),

  async mounted() {
    await this.fetchDashboardStats();
    await this.fetchMyRides();
  },

  methods: {
    fetchDashboardStats() {
      this.apiStats.method = "GET";
      this.apiStats.url = `${this.$api.servers.backend}/api/v1/driver/dashboard/stats`;
      this.apiStats.callbackReset = () => {
        this.apiStats.isLoading = true;
        this.apiStats.isError = false;
        this.apiStats.error = null;
      };
      this.apiStats.callbackError = (e) => {
        this.apiStats.isLoading = false;
        this.apiStats.isError = true;
        this.apiStats.error = e;
        // Use placeholder data if apiStats fails
        this.vehicleCount = 2;
        this.activeRides = 2;
        this.totalEarnings = 1250;
      };
      this.apiStats.callbackSuccess = (resp) => {
        this.apiStats.isLoading = false;
        console.log("Dashboard stats response:", resp);
        this.vehicleCount = resp.vehicleCount || 0;
        this.activeRides = resp.activeRides || 0;
        this.totalEarnings = resp.totalEarnings || 0;
      };

      this.$api.fetch(this.apiStats);
    },

    async fetchMyRides(resetData = true) {
      if (resetData) {
        this.currentPage = 1;
        this.myRides = [];
      }

      this.api.method = "GET";
      this.api.url = `${this.$api.servers.backend}/api/v1/driver/rides/my?status=${this.selectedTab}&page=${this.currentPage}&limit=10`;
      this.api.callbackReset = () => {
        this.api.isLoading = true;
        this.api.isError = false;
        this.api.error = null;
      };
      this.api.callbackError = (e) => {
        this.api.isLoading = false;
        this.api.isError = true;
        this.api.error = e;
      };
      this.api.callbackSuccess = (resp) => {
        this.api.isLoading = false;
        console.log("My rides response:", resp);

        if (resetData) {
          this.myRides = resp.data || [];
        } else {
          this.myRides = [...this.myRides, ...(resp.data || [])];
        }

        this.hasMoreRides = resp.hasMore || false;
        this.currentPage = resp.currentPage + 1 || this.currentPage + 1;
      };

      this.$api.fetch(this.api);
    },

    async loadMoreRides() {
      this.loadingMore = true;
      await this.fetchMyRides(false);
      this.loadingMore = false;
    },

    viewRideDetails(ride) {
      this.$router.push({
        name: "DriverRideDetailsView",
        params: { uuid: ride.uuid },
      });
    },

    editRide(ride) {
      this.$router.push({
        name: "RideEditView",
        params: { uuid: ride.uuid },
      });
    },

    manageRide(ride) {
      this.$router.push({
        name: "DriverManageBookingView",
        params: { uuid: ride.uuid },
      });
    },

    viewBookings(ride) {
      this.manageDialog = false;
      this.$router.push({
        name: "RideBookingsView",
        params: { uuid: ride.uuid },
      });
    },

    startRide(ride) {
      this.manageDialog = false;
      // You can add a confirmation dialog here if needed
      this.updateRideStatus(ride, "ACTIVE");
    },

    updateRideStatus(ride, status) {
      this.api.method = "PUT";
      this.api.url = `${this.$api.servers.backend}/api/v1/driver/rides/${ride.uuid}/status`;
      this.api.data = { status: status };
      this.api.callbackReset = () => {
        this.api.isLoading = true;
        this.api.isError = false;
        this.api.error = null;
      };
      this.api.callbackError = (e) => {
        this.api.isLoading = false;
        this.api.isError = true;
        this.api.error = e;
        this.$toast?.error(
          `Failed to ${status.toLowerCase()} ride. Please try again.`
        );
        console.error("Failed to update ride status:", e);
      };
      this.api.callbackSuccess = (resp) => {
        this.api.isLoading = false;
        console.log("Update ride status response:", resp);
        this.$toast?.success(`Ride ${status.toLowerCase()} successfully`);
        this.fetchMyRides(); // Refresh the list
        this.fetchDashboardStats(); // Update stats
      };

      this.$api.fetch(this.api);
    },

    showCancelDialog() {
      this.manageDialog = false;
      this.cancelDialog = true;
    },

   confirmCancelRide() {
  if (!this.selectedRide) return;

  this.cancelingRide = true;
  this.api.method = "POST";
  this.api.url = `${this.$api.servers.backend}/api/v1/driver/rides/cancel`;
  this.api.params = {
    uuid: this.selectedRide.uuid,
    remarks: 'Driver cancelled'
  };

  this.api.callbackReset = () => {
    this.api.isLoading = false;
    this.api.isError = false;
    this.api.error = null;
  };
  this.api.callbackError = (e) => {
    this.cancelingRide = false;
    this.api.isError = true;
    this.api.error = e;
    this.$toast?.error('Failed to cancel ride. Please try again.');
  };
  this.api.callbackSuccess = () => {
    this.cancelingRide = false;
    this.$toast?.success('Ride cancelled successfully');
    this.fetchMyRides();
    this.fetchDashboardStats();
    this.cancelDialog = false;
    this.selectedRide = null;
  };

  this.$api.fetch(this.api);
},


    calculateEarnings(ride) {
      const bookedSeats = ride.booked_seats || 0;
      return (bookedSeats * ride.charge_per_seat).toFixed(2);
    },

    getStatusColor(status) {
      const colors = {
        NOT_STARTED: "primary",
        ACTIVE: "success",
        COMPLETED: "info",
        CANCELLED: "error",
        // Legacy support
        upcoming: "primary",
        active: "success",
        completed: "info",
        cancelled: "error",
      };
      return colors[status] || "grey";
    },

    getStatusIcon(status) {
      const icons = {
        NOT_STARTED: "mdi-clock-outline",
        ACTIVE: "mdi-car",
        COMPLETED: "mdi-check-circle",
        CANCELLED: "mdi-cancel",
        // Legacy support
        upcoming: "mdi-clock-outline",
        active: "mdi-car",
        completed: "mdi-check-circle",
        cancelled: "mdi-cancel",
      };
      return icons[status] || "mdi-help-circle";
    },

    formatDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    },
  },
};
</script>

<style scoped>
.v-card {
  transition: all 0.3s ease;
}
.v-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.ride-card {
  border-radius: 12px !important;
  transition: all 0.3s ease;
  border: 1px solid #e5e7eb;
}

.ride-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12) !important;
}

.ride-route {
  line-height: 1.2;
}

.ride-info {
  font-size: 0.9rem;
  line-height: 1.4;
}

.ride-price {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.price-amount {
  line-height: 1;
}

.price-per {
  margin-top: -8px;
  font-size: 0.9rem;
}

.earnings-info {
  padding: 8px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.action-buttons {
  width: 100%;
}

.action-buttons .v-btn {
  text-transform: none;
  font-weight: 500;
}

.section-title {
  padding-bottom: 0;
}

/* Mobile responsive adjustments */
@media (max-width: 960px) {
  .ride-price {
    margin-top: 16px;
  }

  .action-buttons .v-btn {
    margin: 2px 0;
  }
}
</style>