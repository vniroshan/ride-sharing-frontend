<template>
  <v-app>
    <v-container fluid>
      <!-- Loading state -->
      <v-row v-if="apiRideInfo.isLoading" class="justify-center my-10">
        <v-col cols="12" class="text-center">
          <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
          <div class="mt-4">Loading ride information...</div>
        </v-col>
      </v-row>

      <!-- Error state -->
      <v-row v-else-if="apiRideInfo.isError" class="justify-center my-10">
        <v-col cols="12" md="6" class="text-center">
          <v-alert type="error" prominent>
            <div class="text-h6">Failed to load ride information</div>
            <div class="mt-2">{{ apiRideInfo.error?.message || 'An error occurred' }}</div>
            <v-btn color="white" text @click="fetchRideInfo" class="mt-3">
              Try Again
            </v-btn>
          </v-alert>
        </v-col>
      </v-row>

      <!-- Main content -->
      <template v-else-if="rideInfo">
        <v-row class="my-6 justify-center">
          <v-col cols="12" md="8" class="text-center">
            <h2 class="text-h4 font-weight-bold primary--text">Book Your Ride</h2>
            <p class="text-subtitle-1 mt-2">{{ rideInfo.from }} → {{ rideInfo.to }}</p>
          </v-col>
        </v-row>

        <v-row class="justify-center">
          <!-- Ride Information Card -->
          <v-col cols="12" md="3">
            <v-card class="rounded-xl" elevation="4" style="height: 100%;">
              <v-card-title class="text-h5 font-weight-bold text-center pl-6" style="color: #4033a7;">
                Ride information
              </v-card-title>
              <v-card-text class="pl-10">
                <div style="font-size:large;">
                  <span style="color: #BDBDBE;">From:</span><br/>
                  <strong>{{ rideInfo.from }}</strong>
                </div><br/>
                <div style="font-size:large;">
                  <span style="color: #BDBDBE;">To:</span><br/>
                  <strong>{{ rideInfo.to }}</strong>
                </div><br/>
                <div style="font-size:large;">
                  <span style="color: #BDBDBE;">Date:</span><br/>
                  <strong>{{ formatDate(rideInfo.departure_date) }}</strong>
                </div><br/>
                <div style="font-size:large;">
                  <span style="color: #BDBDBE;">Time:</span><br/>
                  <strong>{{ formatTime(rideInfo.departure_time) }}</strong>
                </div><br/>
                <div style="font-size:large;">
                  <span style="color: #BDBDBE;">Charge per seat:</span><br/>
                  <strong>£ {{ rideInfo.charge_per_seat }}</strong>
                </div><br/>
                <div style="font-size:large;">
                  <span style="color: #BDBDBE;">Available seats:</span><br/>
                  <strong>{{ rideInfo.available_seat_count || (rideInfo.seat_count - rideInfo.booked_seat_count) }} seats</strong>
                </div><br/>
              </v-card-text>
            </v-card>
          </v-col>

           <!-- Vehicle Information Card -->
          <v-col cols="12" md="3">
            <v-card class="rounded-xl" elevation="4" style="height:100%">
              <v-card-title class="text-h5 font-weight-bold" style="color: #4033a7;">
                Vehicle information
              </v-card-title>
              <v-card-text class="pl-5">
                <v-row class="mb-2 mt-1" justify="space-around"> 
                  <!-- Driver Avatar -->
                  <v-card class="rounded-lg" flat elevation="0" color="#BDBDBD">
                    <v-avatar v-if="rideInfo.drivers?.profile_image_url" size="64" class="ma-2">
                      <v-img 
                        :src="rideInfo.drivers.profile_image_url" 
                        cover
                      ></v-img>
                    </v-avatar>
                    <v-icon v-else class="pa-4" large dark>mdi-account</v-icon>
                  </v-card>
                  
                  <!-- Vehicle Image 1 -->
                  <v-card class="rounded-lg" flat elevation="0" color="#BDBDBD">
                    <v-avatar v-if="rideInfo.vehicles.vehicle_images && rideInfo.vehicles.vehicle_images[0]" size="64" class="ma-2" tile>
                      <v-img 
                        :src="rideInfo.vehicles.vehicle_images[0].image_url" 
                        :alt="rideInfo.vehicles?.vehicle_no"
                        cover
                      ></v-img>
                    </v-avatar>
                    <v-icon v-else class="pa-4" large dark>mdi-car</v-icon>
                  </v-card>
                  
                  <!-- Vehicle Image 2 -->
                  <v-card class="rounded-lg" flat elevation="0" color="#BDBDBD">
                    <v-avatar v-if="rideInfo.vehicles.vehicle_images && rideInfo.vehicles.vehicle_images[0]" size="64" class="ma-2" tile>
                      <v-img 
                        :src="rideInfo.vehicles.vehicle_images[0].image_url" 
                        :alt="rideInfo.vehicles?.vehicle_no"
                        cover
                      ></v-img>
                    </v-avatar>
                    <v-icon v-else class="pa-4" large dark>mdi-car-side</v-icon>
                  </v-card>
                </v-row>
                <v-form class="mt-6">
                  <div style="font-size: large;">
                    <span style="color: #BDBDBE;">Vehicle No:</span><br/>
                    <strong>{{ rideInfo.vehicles?.vehicle_no || 'N/A' }}</strong>
                  </div><br/>
                  <div style="font-size: large;">
                    <span style="color: #BDBDBE;">Vehicle model:</span><br/>
                    <strong>{{ rideInfo.vehicles?.type || 'N/A' }}</strong>
                  </div><br/>
                  <div style="font-size: large;">
                    <span style="color: #BDBDBE;">Reg no:</span><br/>
                    <strong>{{ rideInfo.vehicles?.reg_no || 'N/A' }}</strong>
                  </div><br/>
                  <div style="font-size: large;">
                    <span style="color: #BDBDBE;">Driver:</span><br/>
                    <strong>{{ rideInfo.drivers.first_name }} {{ rideInfo.drivers.last_name }}</strong>
                  </div><br/>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Booking Form Card -->
          <v-col cols="12" md="3">
            <v-card class="rounded-xl" outlined elevation="4">
              <v-card-title class="text-h5 font-weight-bold" style="color: #4033a7;">
                Book your seat
              </v-card-title>
              <v-card-text>
                <v-form ref="bookingForm" v-model="valid">
                  <v-text-field 
                    v-model="bookingForm.passenger_name"
                    class="rounded-lg" 
                    label="Name" 
                    dense 
                    outlined
                    :rules="[rules.required]"
                    :disabled="apiBooking.isLoading"
                  ></v-text-field>
                  <v-text-field 
                    v-model="bookingForm.from"
                    class="rounded-lg" 
                    label="From (Your pickup location)" 
                    dense 
                    outlined
                    :rules="[rules.required]"
                    :disabled="apiBooking.isLoading"
                  ></v-text-field>
                  <v-text-field 
                    v-model="bookingForm.to"
                    class="rounded-lg" 
                    label="To (Your drop-off location)" 
                    dense 
                    outlined
                    :rules="[rules.required]"
                    :disabled="apiBooking.isLoading"
                  ></v-text-field>
                  <v-text-field 
                    v-model="bookingForm.passenger_mobile"
                    class="rounded-lg" 
                    label="Mobile No" 
                    dense 
                    outlined
                    :rules="[rules.required, rules.mobile]"
                    :disabled="apiBooking.isLoading"
                  ></v-text-field>
                  <v-text-field 
                    v-model="bookingForm.passenger_email"
                    class="rounded-lg" 
                    label="Email (Optional)" 
                    dense 
                    outlined
                    :rules="[rules.email]"
                    :disabled="apiBooking.isLoading"
                  ></v-text-field>
                  <v-text-field 
                    :value="rideInfo.charge_per_seat"
                    class="rounded-lg" 
                    label="Charge Per Seat" 
                    dense 
                    outlined
                    readonly
                    prefix="£"
                  ></v-text-field>
                  <v-text-field 
                    v-model.number="bookingForm.no_of_seats"
                    class="rounded-lg" 
                    label="No Of Seats" 
                    dense 
                    outlined
                    type="number"
                    min="1"
                    :max="availableSeats"
                    :rules="[rules.required, rules.seats]"
                    :disabled="apiBooking.isLoading"
                  ></v-text-field>
                  
                  <!-- Total amount display -->
                  <div v-if="totalAmount > 0" class="text-center mb-3">
                    <div class="text-h6 primary--text font-weight-bold">
                      Total: £{{ totalAmount.toFixed(2) }}
                    </div>
                  </div>

                  <v-btn 
                    color="primary" 
                    block 
                    class="mt-3 rounded-lg"
                    :disabled="!valid || apiBooking.isLoading || availableSeats === 0"
                    :loading="apiBooking.isLoading"
                    @click="submitBooking"
                  >
                    {{ availableSeats === 0 ? 'Ride Full' : 'Book Now' }}
                  </v-btn>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Success dialog -->
        <v-dialog v-model="showSuccessDialog" max-width="500">
          <v-card>
            <v-card-title class="text-h5 success--text">
              <v-icon color="success" class="mr-2">mdi-check-circle</v-icon>
              Booking Successful!
            </v-card-title>
            <v-card-text>
              <p>Your booking has been confirmed.</p>
              <div v-if="bookingResult">
                <strong>Booking Reference:</strong> {{ bookingResult.ref_no }}<br/>
                <strong>Total Amount:</strong> £{{ bookingResult.total_amount }}<br/>
                <strong>Seats Booked:</strong> {{ bookingResult.no_of_seats }}
              </div>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="closeSuccessDialog">
                OK
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Error dialog -->
        <v-dialog v-model="showErrorDialog" max-width="500">
          <v-card>
            <v-card-title class="text-h5 error--text">
              <v-icon color="error" class="mr-2">mdi-alert-circle</v-icon>
              Booking Failed
            </v-card-title>
            <v-card-text>
              {{ bookingError }}
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="showErrorDialog = false">
                OK
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>

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
  </v-app>
</template>

<script>
export default {
  name: 'RideBooking',
  data() {
    return {
      valid: false,
      rideInfo: null,
      bookingResult: null,
      showSuccessDialog: false,
      showErrorDialog: false,
      bookingError: '',
      bookingForm: {
        passenger_name: '',
        from: '',
        to: '',
        passenger_mobile: '',
        passenger_email: '',
        no_of_seats: 1,
      },
      rules: {
        required: v => !!v || 'This field is required',
        email: v => !v || /.+@.+\..+/.test(v) || 'Enter a valid email address',
        mobile: v => !v || /^[+]?[0-9\s-()]{10,}$/.test(v) || 'Enter a valid mobile number',
        seats: v => v >= 1 && v <= this.availableSeats || `Select between 1 and ${this.availableSeats} seats`,
      },
      
      // API configurations following vehicle management pattern
      apiRideInfo: {
        isLoading: false,
        isError: false,
        error: null,
        url: null,
        method: 'GET',
        callbackReset: null,
        callbackError: null,
        callbackSuccess: null,
      },
      
      apiBooking: {
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
    }
  },
  computed: {
    rideUuid() {
      return this.$route.params.uuid;
    },
    availableSeats() {
      if (!this.rideInfo) return 0;
      return this.rideInfo.available_seat_count || (this.rideInfo.seat_count - this.rideInfo.booked_seat_count);
    },
    totalAmount() {
      if (!this.rideInfo || !this.bookingForm.no_of_seats) return 0;
      return this.bookingForm.no_of_seats * this.rideInfo.charge_per_seat;
    }
  },
  async mounted() {
    if (this.rideUuid) {
      await this.fetchRideInfo();
    } else {
      this.apiRideInfo.isError = true;
      this.apiRideInfo.error = { message: 'No ride ID provided' };
    }
  },
  methods: {
    fetchRideInfo() {
      this.apiRideInfo.method = 'GET';
      this.apiRideInfo.url = `${this.$api.servers.backend}/api/v1/passenger/rides/${this.rideUuid}`;
      
      this.apiRideInfo.callbackReset = () => {
        this.apiRideInfo.isLoading = true;
        this.apiRideInfo.isError = false;
        this.apiRideInfo.error = null;
      };
      
      this.apiRideInfo.callbackError = (error) => {
        this.apiRideInfo.isLoading = false;
        this.apiRideInfo.isError = true;
        this.apiRideInfo.error = error;
        console.error('Failed to fetch ride info:', error);
        this.showSnackbar('Failed to load ride information', 'error');
      };
      
      this.apiRideInfo.callbackSuccess = (response) => {
        this.apiRideInfo.isLoading = false;
        console.log('Ride info loaded:', response);
        this.rideInfo = response;
        
        // Pre-fill from and to with ride's route (user can modify for their specific pickup/dropoff)
        this.bookingForm.from = this.rideInfo.from;
        this.bookingForm.to = this.rideInfo.to;
      };
      
      this.$api.fetch(this.apiRideInfo);
    },

    submitBooking() {
      if (!this.$refs.bookingForm.validate()) {
        this.showSnackbar('Please fill in all required fields correctly', 'error');
        return;
      }

      this.apiBooking.method = 'POST';
      this.apiBooking.url = `${this.$api.servers.backend}/api/v1/passenger/bookings/new`;
      
      this.apiBooking.callbackReset = () => {
        this.apiBooking.isLoading = true;
        this.apiBooking.isError = false;
        this.apiBooking.error = null;
      };
      
      this.apiBooking.callbackError = (error) => {
        this.apiBooking.isLoading = false;
        this.apiBooking.isError = true;
        this.apiBooking.error = error;
        console.error('Booking failed:', error);
        
        // Extract error message from response
        const errorMessage = error.response?.data?.message || 
                           error.response?.data?.error || 
                           error.message || 
                           'An error occurred while booking';
        
        this.bookingError = errorMessage;
        this.showErrorDialog = true;
        this.showSnackbar('Booking failed', 'error');
      };
      
      this.apiBooking.callbackSuccess = (response) => {
        this.apiBooking.isLoading = false;
        console.log('Booking successful:', response);
        
        this.bookingResult = response;
        this.showSuccessDialog = true;
        this.showSnackbar('Booking confirmed successfully!', 'success');
        
        // Update ride info to reflect new booking
        this.fetchRideInfo();
      };
      
      // Prepare booking data
      this.apiBooking.params = {
        from: this.bookingForm.from,
        to: this.bookingForm.to,
        ride_uuid: this.rideUuid,
        passenger_name: this.bookingForm.passenger_name,
        passenger_mobile: this.bookingForm.passenger_mobile,
        passenger_email: this.bookingForm.passenger_email || null,
        no_of_seats: this.bookingForm.no_of_seats,
      };
      
      this.$api.fetch(this.apiBooking);
    },

    closeSuccessDialog() {
      this.showSuccessDialog = false;
      this.bookingResult = null;
      
      // Reset form
      if (this.$refs.bookingForm) {
        this.$refs.bookingForm.reset();
      }
      
      // Re-populate the location fields
      if (this.rideInfo) {
        this.bookingForm.from = this.rideInfo.from;
        this.bookingForm.to = this.rideInfo.to;
      }
      this.bookingForm.no_of_seats = 1;
    },

    formatDate(dateString) {
      if (!dateString) return 'N/A';
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
      } catch (error) {
        console.error('Error formatting date:', error);
        return 'Invalid Date';
      }
    },

    formatTime(timeString) {
      if (!timeString) return 'N/A';
      try {
        // Handle both HH:MM and HH:MM:SS formats
        const timeParts = timeString.split(':');
        if (timeParts.length < 2) return timeString;
        
        const hours = parseInt(timeParts[0]);
        const minutes = timeParts[1];
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHour = hours % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
      } catch (error) {
        console.error('Error formatting time:', error);
        return timeString;
      }
    },
    
    showSnackbar(message, color = 'success') {
      this.snackbar.message = message;
      this.snackbar.color = color;
      this.snackbar.show = true;
    }
  }
}
</script>

<style scoped>
.v-card-title {
  background-color: #f5f5f5;
}
.primary--text {
  color: #4033a7 !important;
}

/* Enhanced form styling */
.v-text-field--outlined {
  border-radius: 8px;
}

.v-btn {
  text-transform: none;
  font-weight: 600;
}

/* Loading states */
.v-text-field--disabled {
  opacity: 0.6;
}

/* Success/Error states */
.success--text {
  color: #4caf50 !important;
}

.error--text {
  color: #f44336 !important;
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .v-col {
    margin-bottom: 16px;
  }
}
</style>