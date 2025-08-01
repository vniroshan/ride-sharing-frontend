<template>
  <v-container v-if="!isRegistered" class="driver-reg-bg" fluid>
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <!-- Personal Information Card -->
        <v-card class="driver-reg-card mb-6" elevation="2">
          <v-card-title class="justify-center primary--text">
            <span class="driver-reg-title">Driver Information</span>
          </v-card-title>
          <v-card-text>
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
            </v-form>
          </v-card-text>
        </v-card>

        <!-- Photo Upload Card -->
        <v-card class="driver-reg-card" elevation="2">
          <v-card-title class="justify-center primary--text">
            <span class="driver-reg-title">Upload Documents</span>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <div class="upload-section">
                  <div class="upload-label">Driver Photo</div>
                  <v-btn 
                    color="primary" 
                    block 
                    @click="triggerUpload('driver')"
                    :disabled="!valid"
                  >
                    <v-icon left>mdi-camera</v-icon>
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
                    <v-icon small @click="removeFile('driver')">mdi-close</v-icon>
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="upload-section">
                  <div class="upload-label">Driving License</div>
                  <v-btn 
                    color="primary" 
                    block 
                    @click="triggerUpload('license')"
                    :disabled="!valid"
                  >
                    <v-icon left>mdi-card-account-details</v-icon>
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
                    <v-icon small @click="removeFile('license')">mdi-close</v-icon>
                  </div>
                </div>
              </v-col>
            </v-row>

            <!-- Submit Button -->
            <v-row justify="center" class="mt-6">
              <v-col cols="12" class="text-center">
                <v-btn
                  color="primary"
                  class="register-btn"
                  large
                  :disabled="!canRegister"
                  @click="registerDriver"
                >
                  Complete Registration
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <!-- Success Message -->
  <v-container v-else class="success-container">
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card class="success-card" elevation="2">
          <v-card-title class="justify-center success--text">
            <v-icon large color="success" class="mr-2">mdi-check-circle</v-icon>
            <span class="headline">Registration Successful!</span>
          </v-card-title>
          <v-card-text class="text-center">
            <p class="subtitle-1 mb-6">Your driver registration has been submitted successfully.</p>
            <p class="body-1">We will review your information and contact you shortly.</p>
            <v-btn
              color="primary"
              class="mt-6"
              @click="resetForm"
            >
              Register Another Driver
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'DriverReg',
  data: () => ({
    isRegistered: false,
    valid: false,
    driverForm: {
      fullName: '',
      idNumber: '',
      mobileNo: '',
      address: '',
      dob: '',
      licenseNumber: '',
    },
    uploadedFiles: {
      driver: null,
      license: null,
    },
    rules: {
      required: v => !!v || 'This field is required',
      phone: v => (v && /^[0-9]{10,15}$/.test(v)) || 'Enter valid phone number',
    },
  }),
  computed: {
    canRegister() {
      return this.valid && 
             this.uploadedFiles.driver && 
             this.uploadedFiles.license;
    }
  },
  methods: {
    triggerUpload(type) {
      this.$refs[`${type}Photo`].click();
    },
    handleFileUpload(event, type) {
      const file = event.target.files[0];
      if (file) {
        // Validate file type and size
        if (!file.type.match('image.*')) {
          this.$toast.error('Please upload an image file');
          return;
        }
        if (file.size > 2000000) { // 2MB
          this.$toast.error('File size should be less than 2MB');
          return;
        }
        this.uploadedFiles[type] = file;
      }
    },
    removeFile(type) {
      this.uploadedFiles[type] = null;
    },
    registerDriver() {
      if (!this.canRegister) return;
      
      const formData = {
        ...this.driverForm,
        photos: this.uploadedFiles
      };

      // Placeholder for API call
      console.log('Driver registration data:', formData);
      this.isRegistered = true;
    },
    resetForm() {
      this.isRegistered = false;
      this.$refs.form.reset();
      this.uploadedFiles = { driver: null, license: null };
    }
  },
};
</script>

<style scoped>
.driver-reg-bg {
  background: #f8f8fb;
  min-height: 100vh;
  padding: 40px 0;
}

.success-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
}

.driver-reg-card, .success-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  padding: 24px;
}

.driver-reg-title {
  font-size: 1.5rem;
  font-weight: 600;
  width: 100%;
  text-align: center;
}

.upload-section {
  border: 1px dashed #ddd;
  border-radius: 8px;
  padding: 16px;
  height: 100%;
}

.upload-label {
  font-weight: 500;
  margin-bottom: 12px;
  color: #444;
  text-align: center;
}

.file-name {
  font-size: 0.8rem;
  color: #666;
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 8px;
  background: #f5f5f5;
  border-radius: 4px;
}

.register-btn {
  font-weight: 600;
  font-size: 1rem;
  border-radius: 8px;
  min-width: 220px;
  letter-spacing: 0.5px;
  text-transform: none;
}

.success-card {
  text-align: center;
  padding: 40px;
}

.headline {
  font-size: 1.8rem;
  font-weight: 600;
}

.subtitle-1 {
  color: #555;
}

.primary--text {
  color: #0074e7 !important;
}

.success--text {
  color: #4CAF50 !important;
}
</style>