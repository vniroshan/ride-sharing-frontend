<template>
  <v-container v-if="!isRegistred" class="driver-reg-bg" fluid>
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card class="driver-reg-card" elevation="2">
          <v-card-title class="justify-center">
            <span class="driver-reg-title">New Driver Registration</span>
          </v-card-title>
          <v-card-text>
            <!-- Personal Information Section -->
            <div class="section-title">Personal Information</div>
            <v-form ref="form" v-model="valid">
              <v-row>
                <v-col cols="12">
                  <v-text-field 
                    v-model="driverForm.fullName" 
                    label="Full Name" 
                    outlined 
                    dense 
                    :rules="[rules.required]" 
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field 
                    v-model="driverForm.idNumber" 
                    label="ID Number" 
                    outlined 
                    dense 
                    :rules="[rules.required]" 
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field 
                    v-model="driverForm.mobileNo" 
                    label="Mobile No" 
                    outlined 
                    dense 
                    :rules="[rules.required, rules.phone]" 
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field 
                    v-model="driverForm.address" 
                    label="Address" 
                    outlined 
                    dense 
                    :rules="[rules.required]" 
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field 
                    v-model="driverForm.dob" 
                    label="Date of Birth" 
                    type="date" 
                    outlined 
                    dense 
                    :rules="[rules.required]" 
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field 
                    v-model="driverForm.licenseNumber" 
                    label="Driving License Number" 
                    outlined 
                    dense 
                    :rules="[rules.required]" 
                  />
                </v-col>
              </v-row>

              <!-- Vehicle Information Section -->
              <div class="section-title mt-6">Vehicle Information</div>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field 
                    v-model="vehicleForm.vehicleNo" 
                    label="Vehicle No" 
                    outlined 
                    dense 
                    :rules="[rules.required]" 
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field 
                    v-model="vehicleForm.model" 
                    label="Vehicle Model" 
                    outlined 
                    dense 
                    :rules="[rules.required]" 
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field 
                    v-model="vehicleForm.color" 
                    label="Vehicle Color" 
                    outlined 
                    dense 
                    :rules="[rules.required]" 
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field 
                    v-model="vehicleForm.registerNo" 
                    label="Register No" 
                    outlined 
                    dense 
                    :rules="[rules.required]" 
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field 
                    v-model="vehicleForm.year" 
                    label="Year of Vehicle" 
                    type="number" 
                    min="1900" 
                    :max="new Date().getFullYear()" 
                    outlined 
                    dense 
                    :rules="[rules.required, rules.year]" 
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field 
                    v-model="vehicleForm.seats" 
                    label="No of Seats" 
                    type="number" 
                    min="2" 
                    max="12" 
                    outlined 
                    dense 
                    :rules="[rules.required, rules.seats]" 
                  />
                </v-col>
              </v-row>

              <!-- Upload Photos Section -->
              <div class="section-title mt-6">Upload Photos</div>
              <v-row>
                <v-col cols="12" md="4">
                  <div class="upload-label">Driver Photo</div>
                  <v-btn color="primary" block @click="triggerUpload('driver')">
                    Upload Photo
                  </v-btn>
                  <input 
                    type="file" 
                    ref="driverPhoto" 
                    accept="image/*" 
                    hidden 
                    @change="handleFileUpload($event, 'driver')"
                  >
                  <div v-if="uploadedFiles.driver" class="file-name">
                    {{ uploadedFiles.driver.name }}
                  </div>
                </v-col>
                <v-col cols="12" md="4">
                  <div class="upload-label">Driving License</div>
                  <v-btn color="primary" block @click="triggerUpload('license')">
                    Upload Photo
                  </v-btn>
                  <input 
                    type="file" 
                    ref="licensePhoto" 
                    accept="image/*" 
                    hidden 
                    @change="handleFileUpload($event, 'license')"
                  >
                  <div v-if="uploadedFiles.license" class="file-name">
                    {{ uploadedFiles.license.name }}
                  </div>
                </v-col>
                <v-col cols="12" md="4">
                  <div class="upload-label">Vehicle Photos</div>
                  <v-btn color="primary" block @click="triggerUpload('vehicle')">
                    Upload Photo
                  </v-btn>
                  <input 
                    type="file" 
                    ref="vehiclePhoto" 
                    accept="image/*" 
                    hidden 
                    @change="handleFileUpload($event, 'vehicle')"
                  >
                  <div v-if="uploadedFiles.vehicle" class="file-name">
                    {{ uploadedFiles.vehicle.name }}
                  </div>
                </v-col>
              </v-row>

              <!-- Submit Button -->
              <v-row justify="center" class="mt-8">
                <v-col cols="12" class="text-center">
                  <v-btn
                    color="primary"
                    class="register-btn"
                    large
                   
                    @click="registerDriver"
                  >
                    Register Now
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <v-container v-else class="detail-container">
   <div>Registred</div>
  </v-container>
</template>

<script>
export default {
  name: 'DriverReg',
  data: () => ({
    isRegistred: false,
    driver:null,
    valid: false,
    driverForm: {
      fullName: '',
      idNumber: '',
      mobileNo: '',
      address: '',
      dob: '',
      licenseNumber: '',
    },
    vehicleForm: {
      vehicleNo: '',
      model: '',
      color: '',
      registerNo: '',
      year: '',
      seats: '',
    },
    uploadedFiles: {
      driver: null,
      license: null,
      vehicle: null,
    },
    rules: {
      required: v => !!v || 'This field is required',
      phone: v => (v && /^[0-9]{10,15}$/.test(v)) || 'Enter valid phone number',
      year: v => (v >= 1900 && v <= new Date().getFullYear()) || 'Enter valid year',
      seats: v => (v >= 2 && v <= 12) || 'Seats must be between 2 and 12',
    },
  }),
  methods: {
    triggerUpload(type) {
      this.$refs[`${type}Photo`].click();
    },
    handleFileUpload(event, type) {
      const file = event.target.files[0];
      if (file) {
        this.uploadedFiles[type] = file;
      }
    },
    registerDriver() {
      this.isRegistred =true
      //if (!this.$refs.form.validate()) return;
      
      // Combine form data
      const formData = {
        ...this.driverForm,
        ...this.vehicleForm,
        photos: this.uploadedFiles
      };

      // Placeholder for API call
      console.log('Driver registration data:', formData);
      alert('Driver registration submitted! (Placeholder)');
      
      // Reset form after submission
      this.$refs.form.reset();
      this.uploadedFiles = { driver: null, license: null, vehicle: null };
    },
  },
};
</script>

<style scoped>
.driver-reg-bg {
  background: #f8f8fb;
  min-height: 100vh;
  padding-top: 40px;
  padding-bottom: 40px;
}
.driver-reg-card {
  border-radius: 18px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  padding: 16px 24px 24px 24px;
}
.driver-reg-title {
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
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 8px;
}
.upload-label {
  font-weight: 500;
  margin-bottom: 8px;
  color: #555;
  text-align: center;
}
.file-name {
  font-size: 0.8rem;
  color: #666;
  margin-top: 8px;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
}
.register-btn {
  background: #0074e7 !important;
  color: #fff !important;
  font-weight: 600;
  font-size: 1.1rem;
  border-radius: 8px;
  min-width: 220px;
  box-shadow: 0 2px 8px rgba(75,63,174,0.08);
  margin-top: 16px;
}
</style>