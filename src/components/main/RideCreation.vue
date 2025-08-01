<template>
  <v-container class="ride-create-bg" fluid>
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
              </v-row>
              <div class="section-title mt-6">Vehicle Information</div>
              <v-row>
                <v-col cols="12" md="8">
                  <v-select
                    v-model="rideForm.vehicle"
                    :items="vehicleList"
                    item-text="name"
                    item-value="id"
                    label="Select a vehicle"
                    outlined
                    dense
                    :rules="[rules.required]"
                  />
                  <div v-if="selectedVehicle" class="vehicle-info-link mt-1">
                    <div>
                      <strong>Selected vehicle information:</strong>
                      <div>Name: {{ selectedVehicle.name }}</div>
                      <div>Plate: {{ selectedVehicle.plate }}</div>
                    </div>
                    <span class="ml-2"><a href="#" @click.prevent>Edit this vehicle</a></span>
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
                    :disabled="!valid || !rideForm.confirmed"
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
    vehicleList: [
      { id: 1, name: 'BMW X7 Black', plate: 'CN11KJG' },
      { id: 2, name: 'Audi Q5 White', plate: 'NL75LJP' },
      { id: 3, name: 'Toyota Prius Blue', plate: 'AB12CDE' },
      { id: 4, name: 'Tesla Model 3 Red', plate: 'XY34ZRT' },
    ],
    rideForm: {
      from: '',
      to: '',
      date: '',
      journeyHrs: '',
      seatCount: '',
      chargePerSeat: '',
      vehicle: '', // will store the id
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
  }),
  computed: {
    selectedVehicle() {
      return this.vehicleList.find(v => v.id === this.rideForm.vehicle) || null;
    },
  },
  methods: {
    createRide() {
      if (!this.$refs.form.validate()) return;
      // Placeholder for submit logic
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
        alert('Ride posted! (This is a placeholder)');
        this.$refs.form.reset();
        this.rideForm.confirmed = false;
      };
      this.apiRideCreation.params = {
        from: this.rideForm.from,
        to: this.rideForm.to,
        departureDate: this.rideForm.date,
        departureTime: '10:00', // subject to change  
        approxHrs: this.rideForm.journeyHrs,
        seatCount: this.rideForm.seatCount,
        chargePerSeat: this.rideForm.chargePerSeat,
        vehicleUuid: 23456, // subject to change
        driverUuid: "a2f3f35c-3aad-4f08-971a-c1c49e5d44cf", // remove after pulling from main
      };
      this.$api.fetch(this.apiRideCreation);
    },

  },
};
</script>

<style scoped>
.ride-create-bg {
  /* background: #f8f8fb url('/img/ride-bg.svg') no-repeat center center; */
  min-height: 100vh;
  padding-top: 40px;
  padding-bottom: 40px;
}
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