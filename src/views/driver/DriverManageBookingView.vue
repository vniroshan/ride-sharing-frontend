<template>
  <v-container fluid>
    <ABreadcrumb :items="breadcrumbs"></ABreadcrumb>
    
    <!-- Loading state -->
    <v-row v-if="apiRideDetails.isLoading" class="justify-center my-10">
      <v-col cols="12" class="text-center">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
        <div class="mt-4">Loading ride information...</div>
      </v-col>
    </v-row>

    <!-- Error state -->
    <v-row v-else-if="apiRideDetails.isError" class="justify-center my-10">
      <v-col cols="12" md="6" class="text-center">
        <v-alert type="error" prominent>
          <div class="text-h6">Failed to load ride information</div>
          <div class="mt-2">{{ apiRideDetails.error?.message || 'An error occurred' }}</div>
          <v-btn color="white" text @click="fetchRideDetails" class="mt-3">
            Try Again
          </v-btn>
        </v-alert>
      </v-col>
    </v-row>

    <!-- Main content -->
    <template v-else-if="rideData">
      <v-row class="my-6 justify-center">
        <v-col cols="12" md="8" class="text-center">
          <v-card>
            <h2 class="text-h5 font-weight-bold pa-4" style="color: #4033a7">
              Manage Bookings
            </h2>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="justify-center">
        <!-- Ride Information Card -->
        <v-col cols="12" md="3">
          <v-card class="rounded-xl" elevation="4" style="height: 100%">
            <v-card-title
              class="text-h5 font-weight-bold text-center pl-6"
              style="color: #4033a7"
            >
              Ride Information
            </v-card-title>
            <v-card-text class="pl-10">
              <div style="font-size: large">
                <span style="color: #bdbdbe">From:</span><br />
                <strong>{{ selectedRide.from }}</strong>
              </div><br />
              <div style="font-size: large">
                <span style="color: #bdbdbe">To:</span><br />
                <strong>{{ selectedRide.to }}</strong>
              </div><br />
              <div style="font-size: large">
                <span style="color: #bdbdbe">Date:</span><br />
                <strong>{{ formatDate(selectedRide.departure_date) }}</strong>
              </div><br />
              <div style="font-size: large">
                <span style="color: #bdbdbe">Time:</span><br />
                <strong>{{ formatTime(selectedRide.departure_time) }}</strong>
              </div><br />
              <div style="font-size: large">
                <span style="color: #bdbdbe">Charge per seat:</span><br />
                <strong>£ {{ selectedRide.charge_per_seat }}</strong>
              </div><br />
              <div style="font-size: large">
                <span style="color: #bdbdbe">Vehicle No:</span><br />
                <strong>{{ selectedRide.vehicles?.vehicle_no || 'N/A' }}</strong>
              </div><br />
              <div style="font-size: large">
                <span style="color: #bdbdbe">Available seats:</span><br />
                <strong>{{ selectedRide.available_seat_count }} / {{ selectedRide.seat_count }}</strong>
              </div><br />
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Bookings List Card -->
        <v-col cols="12" md="8">
          <v-card class="rounded-xl" outlined elevation="4">
            <v-card-title class="text-h5 font-weight-bold d-flex justify-space-between align-center" style="color: #4033a7">
              <span>Bookings ({{ bookings.length }})</span>
              <v-btn 
                color="primary" 
                small 
                @click="fetchRideDetails"
                :loading="apiRideDetails.isLoading"
                class="rounded-lg"
              >
                <v-icon small class="mr-1">mdi-refresh</v-icon>
                Refresh
              </v-btn>
            </v-card-title>
            <v-card-text>
              <!-- No bookings state -->
              <div v-if="!bookings.length && !apiRideDetails.isLoading" class="text-center py-8">
                <v-icon size="64" color="grey lighten-1">mdi-calendar-remove</v-icon>
                <div class="text-h6 mt-4 grey--text">No bookings found</div>
                <div class="text-body-2 grey--text">Bookings for this ride will appear here</div>
              </div>

              <!-- Bookings list - Scrollable -->
              <div v-else class="bookings-container" style="max-height: 600px; overflow-y: auto;">
                <v-card 
                  v-for="booking in bookings" 
                  :key="booking.uuid || booking.id"
                  class="mb-4 pa-4" 
                  elevation="2" 
                  rounded="lg"
                  :class="getBookingCardClass(booking.status)"
                >
                  <v-row>
                    <v-col cols="12" md="8">
                      <div class="font-weight-bold text-subtitle-1" style="color: #4033a7">
                        {{ booking.ref_no || booking.reference_number || `BK-${booking.id}` }}
                      </div>
                      <div class="text-body-2 mt-1">
                        <span class="font-weight-medium">
                          {{ booking.passengers?.first_name }} {{ booking.passengers?.last_name }}
                        </span>
                        <span class="mx-1">•</span>
                        <span>{{ booking.passenger_mobile }}</span>
                        <span class="mx-1">•</span>
                        <span>{{ booking.no_of_seats }} Seat{{ (booking.no_of_seats) > 1 ? 's' : '' }}</span>
                      </div>
                      <div class="text-body-2 mt-1">
                        <span>{{ booking.from }} → {{ booking.to }}</span>
                      </div>
                      <div class="text-body-2 mt-1">
                        <span class="text-caption">Booked on:</span>
                        <span>{{ formatDateTime(booking.created_at) }}</span>
                      </div>
                      <div class="text-body-2 mt-1">
                        <span class="text-caption">Total Amount:</span>
                        <span class="font-weight-bold">£{{ (booking.no_of_seats * selectedRide.charge_per_seat) }}</span>
                      </div>
                    </v-col>
                    
                    <v-col cols="12" md="4" class="d-flex flex-column align-end">
                      <!-- Status chip -->
                      <v-chip
                        :color="getStatusColor(booking.status)"
                        :text-color="getStatusTextColor(booking.status)"
                        small
                        class="mb-3"
                      >
                        {{ getStatusText(booking.status) }}
                      </v-chip>
                      
                      <!-- Action buttons -->
                      <div class="d-flex gap-2 flex-wrap justify-end">
                        <v-btn
                          v-if="canCancel(booking.status)"
                          variant="outlined"
                          color="red accent-4"
                          small
                          class="rounded-lg"
                          :loading="cancelLoading === booking.uuid"
                          @click="confirmCancelBooking(booking)"
                        >
                          Cancel
                        </v-btn>
                        
                        <v-btn
                          v-if="canConfirm(booking.status)"
                          variant="outlined"
                          color="primary"
                          small
                          class="rounded-lg"
                          @click="confirmBooking(booking)"
                        >
                          Confirm
                        </v-btn>
                        
                        <v-btn
                          v-if="canOnboard(booking.status)"
                          variant="outlined"
                          color="grey lighten-1"
                          small
                          class="rounded-lg"
                          @click="onboardPassenger(booking)"
                        >
                          Onboard
                        </v-btn>
                        
                        <v-btn
                          variant="outlined"
                          color="grey lighten-1"
                          small
                          class="rounded-lg"
                          @click="viewBookingDetails(booking)"
                        >
                          Details
                        </v-btn>
                      </div>
                    </v-col>
                  </v-row>
                </v-card>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>

    <!-- Cancel Confirmation Dialog -->
    <v-dialog v-model="cancelDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h5 error--text">
          <v-icon color="error" class="mr-2">mdi-alert-circle</v-icon>
          Cancel Booking
        </v-card-title>
        <v-card-text>
          <p>Are you sure you want to cancel this booking?</p>
          <div v-if="bookingToCancel" class="mt-3">
            <strong>Reference:</strong> {{ bookingToCancel.ref_no }}<br/>
            <strong>Route:</strong> {{ bookingToCancel.from }} → {{ bookingToCancel.to }}<br/>
            <strong>Seats:</strong> {{ bookingToCancel.no_of_seats }}<br/>
            <strong>Amount:</strong> £{{ bookingToCancel.total_amount }}
          </div>
          <v-alert v-if="cancelationPolicy" type="warning" class="mt-3" dense>
            {{ cancelationPolicy }}
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" text @click="cancelDialog = false">
            Keep Booking
          </v-btn>
          <v-btn 
            color="error" 
            :loading="apiCancel.isLoading"
            @click="cancelBooking"
          >
            Cancel Booking
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Booking Details Dialog -->
    <v-dialog v-model="detailsDialog" max-width="600">
      <v-card v-if="selectedBooking">
        <v-card-title class="text-h5 primary--text">
          <v-icon color="primary" class="mr-2">mdi-information</v-icon>
          Booking Details
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="6">
              <div class="text-caption grey--text">Reference Number</div>
              <div class="font-weight-bold">{{ selectedBooking.ref_no }}</div>
            </v-col>
            <v-col cols="6">
              <div class="text-caption grey--text">Status</div>
              <v-chip 
                :color="getStatusColor(selectedBooking.status)" 
                :text-color="getStatusTextColor(selectedBooking.status)"
                small
              >
                {{ getStatusText(selectedBooking.status) }}
              </v-chip>
            </v-col>
          </v-row>
          
          <v-divider class="my-3"></v-divider>
          
          <v-row>
            <v-col cols="12">
              <div class="text-caption grey--text">Route</div>
              <div class="font-weight-bold">{{ selectedBooking.from }} → {{ selectedBooking.to }}</div>
            </v-col>
          </v-row>
          
          <v-row>
            <v-col cols="6">
              <div class="text-caption grey--text">Passenger</div>
              <div>{{ selectedBooking.passenger_name }}</div>
              <div class="text-body-2">{{ selectedBooking.passenger_mobile }}</div>
              <div v-if="selectedBooking.passenger_email" class="text-body-2">{{ selectedBooking.passenger_email }}</div>
            </v-col>
            <v-col cols="6">
              <div class="text-caption grey--text">Booking Details</div>
              <div>{{ selectedBooking.no_of_seats }} Seat(s)</div>
              <div class="font-weight-bold">£{{ selectedBooking.total_amount }}</div>
            </v-col>
          </v-row>
          
          <v-row>
            <v-col cols="6">
              <div class="text-caption grey--text">Booked On</div>
              <div>{{ formatDateTime(selectedBooking.created_at) }}</div>
            </v-col>
            <v-col cols="6" v-if="selectedBooking.ride_date">
              <div class="text-caption grey--text">Travel Date</div>
              <div>{{ formatDate(selectedBooking.ride_date) }}</div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="detailsDialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar for notifications -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
      top
      right
    >
      <v-icon class="mr-2">
        {{ snackbar.color === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle' }}
      </v-icon>
      {{ snackbar.message }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar.show = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
export default {
  name: 'PassengerBookingManagement',
  data() {
    return {
      rideData: null,
      selectedBooking: null,
      bookingToCancel: null,
      cancelDialog: false,
      detailsDialog: false,
      cancelLoading: null,
      cancelationPolicy: 'Cancellation must be made at least 2 hours before departure time.',
      apiRideDetails: {
        isLoading: false,
        isError: false,
        error: null,
        url: null,
        method: 'GET',
        callbackReset: null,
        callbackError: null,
        callbackSuccess: null,
      },
      apiCancel: {
        isLoading: false,
        isError: false,
        error: null,
        url: null,
        method: 'POST',
        params: null,
        callbackReset: null,
        callbackError: null,
        callbackSuccess: null,
      },
      snackbar: {
        show: false,
        message: '',
        color: 'success',
        timeout: 3000
      },
      breadcrumbs: [
        { text: "Dashboard", to: { name: "DriverDashboardView" }, exact: true },
        { text: "Manage Bookings", to: { name: "DriverManageBookingView" }, exact: true }
      ],
    }
  },
  computed: {
    rideUuid() {
      return this.$route.params.uuid;
    },
    bookings() {
      return this.rideData?.bookings || [];
    },
    selectedRide() {
      return this.rideData;
    }
  },
  async mounted() {
    if (this.rideUuid) {
      await this.fetchRideDetails();
    } else {
      this.apiRideDetails.isError = true;
      this.apiRideDetails.error = { message: 'No ride ID provided' };
    }
  },
  methods: {
    fetchRideDetails() {
      this.apiRideDetails = {
        ...this.apiRideDetails,
        method: 'GET',
        url: `${this.$api.servers.backend}/api/v1/driver/rides/${this.rideUuid}`,
        callbackReset: () => {
          this.apiRideDetails.isLoading = true;
          this.apiRideDetails.isError = false;
          this.apiRideDetails.error = null;
        },
        callbackError: (error) => {
          this.apiRideDetails.isLoading = false;
          this.apiRideDetails.isError = true;
          this.apiRideDetails.error = error;
          console.error('Failed to fetch ride details:', error);
          this.showSnackbar('Failed to load ride information', 'error');
        },
        callbackSuccess: (response) => {
          this.apiRideDetails.isLoading = false;
          this.rideData = response.data || response;
        },
      };
      this.$api.fetch(this.apiRideDetails);
    },
    confirmCancelBooking(booking) {
      this.bookingToCancel = booking;
      this.cancelDialog = true;
    },
    cancelBooking() {
      if (!this.bookingToCancel) return;
      this.apiCancel = {
        ...this.apiCancel,
        method: 'POST',
        url: `${this.$api.servers.backend}/api/v1/driver/rides/${this.rideUuid}/bookings/cancel`,
        params: { reason: 'Cancelled by passenger',uuid: this.bookingToCancel.uuid },
        callbackReset: () => {
          this.apiCancel.isLoading = true;
          this.apiCancel.isError = false;
          this.apiCancel.error = null;
        },
        callbackError: (error) => {
          this.apiCancel.isLoading = false;
          this.apiCancel.isError = true;
          this.apiCancel.error = error;
          const msg = error.response?.data?.message || 'Failed to cancel booking';
          this.showSnackbar(msg, 'error');
        },
        callbackSuccess: () => {
          this.apiCancel.isLoading = false;
          this.showSnackbar('Booking cancelled successfully', 'success');
          this.cancelDialog = false;
          this.bookingToCancel = null;
          this.fetchRideDetails();
        }
      };
      this.$api.fetch(this.apiCancel);
    },
    confirmBooking(booking) {
      const id = booking.uuid;
      this.cancelLoading = id;
      this.$api.fetch({
        method: 'POST',
        url: `${this.$api.servers.backend}/api/v1/driver/rides/${this.rideUuid}/bookings/confirm`,
        params: { uuid: id },
        callbackReset: () => { this.cancelLoading = id },
        callbackSuccess: () => {
          this.cancelLoading = null;
          this.showSnackbar('Booking confirmed successfully', 'success');
          this.fetchRideDetails();
        },
        callbackError: (error) => {
          this.cancelLoading = null;
          const msg = error.response?.data?.message || 'Failed to confirm booking';
          this.showSnackbar(msg, 'error');
        }
      });
    },
    onboardPassenger(booking) {
      const id = booking.uuid ;
      this.cancelLoading = id;
      this.$api.fetch({
        method: 'POST',
        url: `${this.$api.servers.backend}/api/v1/driver/rides/${this.rideUuid}/bookings/onboard`,
        params: { uuid: id },
        callbackReset: () => { this.cancelLoading = id },
        callbackSuccess: () => {
          this.cancelLoading = null;
          this.showSnackbar('Passenger marked as onboarded', 'success');
          this.fetchRideDetails();
        },
        callbackError: (error) => {
          this.cancelLoading = null;
          const msg = error.response?.data?.message || 'Failed to onboard passenger';
          this.showSnackbar(msg, 'error');
        }
      });
    },
    viewBookingDetails(booking) {
      this.selectedBooking = booking;
      this.detailsDialog = true;
    },
    editBooking(booking) {
      this.$router.push({
        name: 'DriverEditBooking',
        params: { bookingId: booking.uuid || booking.id }
      });
    },
    canCancel(status) {
      return ['confirmed', 'awaiting', 'pending'].includes(status?.toLowerCase());
    },
    canModify(status) {
      return ['confirmed', 'awaiting', 'pending'].includes(status?.toLowerCase());
    },
    canConfirm(status) {
      return ['pending', 'awaiting'].includes(status?.toLowerCase());
    },
    canOnboard(status) {
      return ['confirmed'].includes(status?.toLowerCase());
    },
    getStatusColor(status) {
      return {
        'confirmed': 'light-green accent-4',
        'awaiting': 'yellow lighten-1',
        'pending': 'orange lighten-1',
        'cancelled': 'red lighten-1',
        'completed': 'blue lighten-1',
        'onboard': 'green darken-1'
      }[status?.toLowerCase()] || 'grey lighten-1';
    },
    getStatusTextColor(status) {
      return ['awaiting', 'pending'].includes(status?.toLowerCase()) ? 'black' : 'white';
    },
    getStatusText(status) {
      return {
        'confirmed': 'Confirmed',
        'awaiting': 'Awaiting',
        'pending': 'Pending',
        'cancelled': 'Cancelled',
        'completed': 'Completed',
        'onboard': 'On Board'
      }[status?.toLowerCase()] || status || 'Unknown';
    },
    getBookingCardClass(status) {
      return {
        'cancelled': 'red lighten-5',
        'completed': 'blue lighten-5',
        'confirmed': 'light-green lighten-5'
      }[status?.toLowerCase()] || '';
    },
    formatDate(date) {
      if (!date) return 'N/A';
      try {
        return new Date(date).toLocaleDateString('en-GB');
      } catch {
        return 'Invalid Date';
      }
    },
    formatTime(time) {
      if (!time) return 'N/A';
      try {
        const [h, m] = time.split(':');
        const hr = parseInt(h);
        const ampm = hr >= 12 ? 'PM' : 'AM';
        return `${hr % 12 || 12}:${m} ${ampm}`;
      } catch {
        return time;
      }
    },
    formatDateTime(dateTime) {
      if (!dateTime) return 'N/A';
      try {
        const d = new Date(dateTime);
        return `${d.toLocaleDateString('en-GB')}, ${d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;
      } catch {
        return 'Invalid Date';
      }
    },
    showSnackbar(message, color = 'success') {
      const allowed = ['success', 'error', 'info', 'warning'];
      this.snackbar = {
        show: true,
        message,
        color: allowed.includes(color) ? color : 'info',
        timeout: 3000
      };
    }
  }
};
</script>


<style scoped>
.v-card-title {
  background-color: #f5f5f5;
}

.primary--text {
  color: #4033a7 !important;
}

.error--text {
  color: #f44336 !important;
}

/* Custom scrollbar for bookings container */
.bookings-container::-webkit-scrollbar {
  width: 6px;
}

.bookings-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.bookings-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.bookings-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Responsive gap for action buttons */
.gap-2 > *:not(:last-child) {
  margin-right: 8px;
}

@media (max-width: 600px) {
  .gap-2 {
    flex-direction: column;
    align-items: stretch;
  }
  
  .gap-2 > *:not(:last-child) {
    margin-right: 0;
    margin-bottom: 8px;
  }
}

/* Enhanced booking card styling */
.v-card.mb-4 {
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
}

.v-card.mb-4:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
  transform: translateY(-2px);
}

.v-card.light-green.lighten-5 {
  border-left-color: #4caf50;
}

.v-card.red.lighten-5 {
  border-left-color: #f44336;
}

.v-card.blue.lighten-5 {
  border-left-color: #2196f3;
}

/* Loading states */
.v-btn--loading {
  opacity: 0.7;
}

/* Status chip styling */
.v-chip {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 11px;
  letter-spacing: 0.5px;
}
</style>