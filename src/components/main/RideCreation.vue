<template>
  <v-container fluid>
      <ABreadcrumb :items="breadcrumbs"></ABreadcrumb>
    <AError
      v-if="apiRideCreation.isError"
      :api="apiRideCreation"
      :callbackReset="() => (apiRideCreation.isError = false)"
    ></AError>
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card class="ride-create-card" elevation="2">
          <v-card-title class="justify-center">
            <span class="ride-create-title">Post New Ride</span>
          </v-card-title>
          <v-card-text>
            <div class="section-title">Ride Information</div>
            <v-form ref="form" v-model="valid">
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field v-model="rideForm.from" label="From" outlined dense :rules="[rules.required]" />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="rideForm.to" label="To" outlined dense :rules="[rules.required]" />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="rideForm.date" label="Date" type="date" outlined dense :rules="[rules.required]" />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="rideForm.journeyHrs" label="Approx journey hrs" outlined dense :rules="[rules.required]" />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="rideForm.seatCount" label="Seat count" type="number" outlined dense :rules="[rules.required, rules.seats]" min="1" max="8" />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="rideForm.chargePerSeat" label="Charge per seat" type="number" outlined dense :rules="[rules.required, rules.price]" min="1" step="0.5" />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="rideForm.departureTime" label="Departure Time" type="time" outlined dense :rules="[rules.required]" />
                </v-col>
              </v-row>
              <div class="section-title mt-6">Vehicle Information</div>
              <v-row>
                <v-col cols="12" md="8">
                  <v-select
                    v-model="rideForm.vehicle"
                    :items="vehicleList"
                    item-text="displayName"
                    item-value="uuid"
                    label="Select a vehicle"
                    outlined
                    dense
                    :rules="[rules.required]"
                    :loading="apiVehicles.isLoading"
                    :disabled="apiVehicles.isLoading"
                  />
                  <div v-if="selectedVehicle" class="vehicle-info-container mt-3">
                    <div class="vehicle-info-details">
                      <strong>Selected vehicle information:</strong>
                      <div>Type: {{ selectedVehicle.type }}</div>
                      <div>Registration: {{ selectedVehicle.reg_no }}</div>
                    </div>
                    <div v-if="selectedVehicle.vehicle_images && selectedVehicle.vehicle_images.length > 0" class="vehicle-images mt-3">
                      <div class="images-title mb-2"><strong>Vehicle Images:</strong></div>
                      <div class="images-grid">
                        <div 
                          v-for="(image, index) in selectedVehicle.vehicle_images" 
                          :key="image.id"
                          class="image-item"
                        >
                          <img 
                            :src="image.image_url" 
                            :alt="`Vehicle image ${index + 1}`"
                            class="vehicle-image"
                            @error="handleImageError"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-if="apiVehicles.isError" class="error--text mt-2">
                    Failed to load vehicles. Please try refreshing the page.
                  </div>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <div class="confirm-info grey--text text--darken-1 mt-4 mb-2">
                    Are you sure you want to post this ride? Once posted, it will be visible to passengers, and you cannot make changes to the details. Please review all the information carefully before proceeding
                  </div>
                  <v-checkbox
                    v-model="rideForm.confirmed"
                    :rules="[v => !!v || 'You must confirm the information is correct']"
                    label="i confirm that the information provided is correct"
                    class="confirm-checkbox"
                  />
                </v-col>
              </v-row>
              <v-row justify="center">
                <v-col cols="12" class="text-center">
                  <v-btn
                    color="primary"
                    class="post-btn"
                    large
                    :disabled="!valid || !rideForm.confirmed || apiVehicles.isLoading"
                    @click="createRide"
                  >
                    Post Now
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'RideCreation',
  data: () => ({
    valid: false,
     breadcrumbs: [
        { text: "Dashboard", to: { name: "DriverDashboardView" }, exact: true },
        { text: "Create New Ride", to: { name: "DriverRideCreationView" }, exact: true }
      ],
    vehicleList: [],
    rideForm: {
      from: '',
      to: '',
      date: '',
      journeyHrs: '',
      seatCount: '',
      chargePerSeat: '',
      departureTime: '',
      vehicle: '', // will store the uuid
      confirmed: false,
    },
    rules: {
      required: v => !!v || 'This field is required',
      seats: v => (v >= 1 && v <= 8) || 'Seats must be between 1 and 8',
      price: v => v > 0 || 'Price must be greater than 0',
    },
    apiRideCreation: {
      isLoading: false,
      isError: false,
      error: null,
      url: null,
    },
    apiVehicles: {
      isLoading: false,
      isError: false,
      error: null,
      url: null,
    },
  }),
  computed: {
    selectedVehicle() {
      return this.vehicleList.find(v => v.uuid === this.rideForm.vehicle) || null;
    },
  },
  async mounted() {
    await this.fetchVehicles();
  },
  methods: {
    async fetchVehicles() {
       this.apiVehicles.method = 'GET';
      this.apiVehicles.url = `${this.$api.servers.backend}/api/v1/data/vehicles/all`;
      this.apiVehicles.callbackReset = () => {
        this.apiVehicles.isLoading = true;
        this.apiVehicles.isError = false;
        this.apiVehicles.error = null;
      };
      this.apiVehicles.callbackError = (e) => {
        this.apiVehicles.isLoading = false;
        this.apiVehicles.isError = true;
        this.apiVehicles.error = e;
        console.error('Failed to fetch vehicles:', e);
      };
      this.apiVehicles.callbackSuccess = (resp) => {
        this.apiVehicles.isLoading = false;
        // Transform the API response to include a display name for the select component
        this.vehicleList = resp.map(vehicle => ({
          ...vehicle,
          displayName: `${vehicle.type} - ${vehicle.reg_no}${vehicle.vehicle_no ? ` (${vehicle.vehicle_no})` : ''}`
        }));
      };
      
      await this.$api.fetch(this.apiVehicles);
    },

    handleImageError(event) {
      // Handle broken image URLs gracefully
      event.target.style.display = 'none';
      console.warn('Failed to load vehicle image:', event.target.src);
    },

    createRide() {
      if (!this.$refs.form.validate()) return;
      
      const selectedVehicle = this.selectedVehicle;
      if (!selectedVehicle) {
        alert('Please select a vehicle');
        return;
      }

      this.apiRideCreation.url = `${this.$api.servers.backend}/api/v1/driver/rides/new`;
      this.apiRideCreation.callbackReset = () => {
        this.apiRideCreation.isLoading = true;
        this.apiRideCreation.isError = false;
        this.apiRideCreation.error = null;
        this.rideForm.confirmed = false;
      };
      this.apiRideCreation.callbackError = (e) => {
        this.apiRideCreation.isLoading = false;
        this.apiRideCreation.isError = true;
        this.apiRideCreation.error = e;
      };
      this.apiRideCreation.callbackSuccess = (resp) => {
        this.apiRideCreation.isLoading = false;
        console.log(resp);
        this.$router.push({ name: 'DriverDashboardView' });
      };
      this.apiRideCreation.params = {
        from: this.rideForm.from,
        to: this.rideForm.to,
        departureDate: this.rideForm.date,
        departureTime: this.rideForm.departureTime,
        approxHrs: this.rideForm.journeyHrs,
        seatCount: this.rideForm.seatCount,
        chargePerSeat: this.rideForm.chargePerSeat,
        vehicleUuid: this.rideForm.vehicle, // Now using the actual UUID from selected vehicle
      };
      this.$api.fetch(this.apiRideCreation);
    },
  },
};
</script>

<style scoped>

.ride-create-card {
  border-radius: 18px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  padding: 0 0 16px 0;
}
.ride-create-title {
  font-size: 2rem;
  font-weight: 700;
  color: #0074e7;
  width: 100%;
  text-align: center;
}
.section-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #0074e7;
  margin-bottom: 12px;
  margin-top: 12px;
}
.vehicle-info-link a {
  color: #0074e7;
  font-size: 0.95rem;
  text-decoration: underline;
  cursor: pointer;
}
.vehicle-info-container {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  background-color: #fafafa;
}
.vehicle-info-details {
  margin-bottom: 12px;
}
.images-title {
  font-weight: 600;
  color: #424242;
}
.images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
  max-height: 300px;
  overflow-y: auto;
}
.image-item {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.vehicle-image {
  width: 100%;
  height: 80px;
  object-fit: cover;
  display: block;
  transition: transform 0.2s ease;
}
.vehicle-image:hover {
  transform: scale(1.05);
}
.confirm-info {
  font-size: 0.95rem;
}
.confirm-checkbox {
  margin-top: -12px;
}
.post-btn {
  background: #0074e7 !important;
  color: #fff !important;
  font-weight: 600;
  font-size: 1.1rem;
  border-radius: 8px;
  min-width: 200px;
  box-shadow: 0 2px 8px rgba(75,63,174,0.08);
}
</style>