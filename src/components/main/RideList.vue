<template>
  <v-container>
    <AError
      v-if="api.isError"
      :api="api"
      :callbackReset="() => (api.isError = false)"
    ></AError>

    <v-overlay :value="api.isLoading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <h3 class="text-left mb-6">Find the seat for your journey...!</h3>
    <v-card outlined class="mb-6" flat elevation="2">
      <v-card-text>
        <!-- Search Form -->
        <v-row justify="center">
          <v-col cols="12" md="3">
            <v-text-field
              v-model="from"
              label="From"
              outlined
              dense
              hide-details
              prepend-inner-icon="mdi-map-marker"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="to"
              label="To"
              outlined
              dense
              hide-details
              class="search-input"
              prepend-inner-icon="mdi-map-marker-outline"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="date"
              label="Date"
              type="date"
              outlined
              dense
              hide-details
              class="search-input"
              prepend-inner-icon="mdi-calendar"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="2">
            <v-btn
              @click="fetchRides"
              color="primary"
              large
              block
              :loading="api.isLoading"
              elevation="2"
              class="search-btn"
            >
              <v-icon left>mdi-magnify</v-icon>
              Find seat
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-card flat elevation="0">
      <v-card-title class="section-title justify-center">
        <h2 class="text-h4 primary--text">Upcoming Rides</h2>
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col
            v-for="ride in rides"
            :key="ride.id"
            cols="12"
            class="ride-item"
          >
            <v-card class="ride-card" elevation="2" hover>
              <v-card-text>
                <v-row align="center">
                  <!-- Car Icon -->
                  <v-col cols="12" md="2" class="text-center">
                    <v-avatar size="80" color="grey lighten-3">
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
                        {{ ride.departure_date }} Departure around {{ ride.departure_time }}
                      </div>
                      <div class="mb-2">
                        <v-icon small class="mr-1">mdi-car-info</v-icon>
                        {{ ride.vehicles.vehicle_no }} - {{ ride.vehicles.type }}
                      </div>
                      <v-chip
                        small
                        color="success"
                        text-color="white"
                        class="mr-2"
                      >
                        <v-icon left small>mdi-account-group</v-icon>
                        {{ ride.available_seat_count }} Seats Available
                      </v-chip>
                    </div>
                  </v-col>

                  <!-- Price and Book Button -->
                  <v-col cols="12" md="4" class="text-center">
                    <div class="ride-price">
                      <div
                        class="price-amount text-h3 primary--text font-weight-bold"
                      >
                        £{{ ride.charge_per_seat }}
                      </div>
                      <div class="price-per grey--text text--darken-1 mb-3">
                        /seat
                      </div>
                      <v-btn
                        @click="bookRide(ride)"
                        color="primary"
                        large
                        elevation="2"
                        class="book-btn"
                      >
                        <v-icon left>mdi-bookmark-plus</v-icon>
                        Book now
                      </v-btn>
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row v-if="rides.length === 0" justify="center">
          <v-col cols="12" class="text-center">
            <v-icon size="64" color="grey lighten-1">mdi-car-off</v-icon>
            <h3 class="text-h5 grey--text mt-4">No rides found</h3>
            <p class="grey--text">Try adjusting your search criteria</p>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    loading: false,
    rides: [],
    searchForm: {
      from: "",
      to: "",
      date: "",
    },
    date: "",
    from: "",
    to: "",
    // API configurations
    api: {
      isLoading: false,
      isError: false,
      error: null,
      url: null,
    },
  }),

  computed: {},

  created() {
    this.fetchRides();
  },

  mounted() {
    // Initialize with current date
    const today = new Date();
    this.date = today.toISOString().split("T")[0];
  },

  beforeDestroy() {
    // Cleanup if needed
  },

  methods: {
    fetchRides() {
      this.api.method = "GET";
      this.api.url = `${this.$api.servers.backend}/api/v1/passenger/rides/all?date=${this.date}&to=${this.to}&from=${this.from}`;
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
        console.log(resp);
        this.rides = resp;
      };
      // Uncomment when API is ready
      this.$api.fetch(this.api);
    },

    searchRides() {
      this.loading = true;
      // Simulate API call for search
      setTimeout(() => {
        this.loading = false;
        console.log("Searching for rides:", this.searchForm);
      }, 1000);
    },

    bookRide(ride) {
      this.$router.push({ name: "PassengerBookingView", params: { uuid: ride.uuid } });
    },

    formatDate(dateString) {
      // Convert DD/MM/YYYY to YYYY-MM-DD for input[type="date"]
      const parts = dateString.split("/");
      if (parts.length === 3) {
        return `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(
          2,
          "0"
        )}`;
      }
      return dateString;
    },
  },
};
</script>

<style scoped>
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

.book-btn {
  text-transform: none;
  font-weight: 500;
}

.v-overlay .v-progress-circular {
  margin-bottom: 16px;
}

/* Mobile responsive adjustments */
@media (max-width: 960px) {
  .ride-price {
    margin-top: 16px;
  }
}
</style>