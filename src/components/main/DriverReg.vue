<template>
  <v-container v-if="!isRegistered" class="driver-reg-bg" fluid>
    <AError
      v-if="apiRegister.isError"
      :api="apiRegister"
      :callbackReset="() => (apiRegister.isError = false)"
    ></AError>

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
                <v-col cols="12" md="6">
                  <v-text-field 
                    v-model="driverForm.firstName" 
                    label="First Name" 
                    outlined 
                    dense 
                    :rules="[rules.required]"
                    :disabled="apiRegister.isLoading"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field 
                    v-model="driverForm.lastName" 
                    label="Last Name" 
                    outlined 
                    dense 
                    :rules="[rules.required]"
                    :disabled="apiRegister.isLoading"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field 
                    v-model="driverForm.mobileNo" 
                    label="Mobile Number" 
                    outlined 
                    dense 
                    :rules="[rules.required, rules.phone]"
                    :disabled="apiRegister.isLoading"
                    placeholder="03001234567"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field 
                    v-model="driverForm.email" 
                    label="Email Address (Optional)" 
                    outlined 
                    dense 
                    :rules="[rules.email]"
                    :disabled="apiRegister.isLoading"
                    type="email"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field 
                    v-model="driverForm.drivingLicenceNo" 
                    label="Driving License Number" 
                    outlined 
                    dense 
                    :rules="[rules.required]"
                    :disabled="apiRegister.isLoading"
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field 
                    v-model="driverForm.address" 
                    label="Complete Address" 
                    outlined 
                    dense 
                    :rules="[rules.required]"
                    :disabled="apiRegister.isLoading"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field 
                    v-model="driverForm.city" 
                    label="City" 
                    outlined 
                    dense 
                    :rules="[rules.required]"
                    :disabled="apiRegister.isLoading"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field 
                    v-model="driverForm.postCode" 
                    label="Post Code" 
                    outlined 
                    dense 
                    :rules="[rules.required]"
                    :disabled="apiRegister.isLoading"
                    placeholder="54000"
                  />
                </v-col>
              </v-row>

              <!-- Upload Photos Section -->
              <div class="section-title mt-6">Upload Required Documents</div>
              
              <!-- Profile Photo -->
              <v-row class="mb-4">
                <v-col cols="12">
                  <div class="upload-section-title">Profile Photo</div>
                </v-col>
                <v-col cols="12" md="6">
                  <div class="upload-container">
                    <v-btn 
                      color="primary" 
                      block 
                      @click="triggerUpload('profile')"
                      :disabled="apiRegister.isLoading || uploadingPhoto"
                      :loading="uploadingPhoto"
                    >
                      {{ uploadingPhoto ? 'Uploading...' : 'Upload Profile Photo' }}
                    </v-btn>
                    <input 
                      type="file" 
                      ref="profilePhoto" 
                      accept="image/jpeg,image/jpg,image/png,image/webp" 
                      hidden 
                      @change="handleFileUpload($event, 'profile')"
                    >
                    <div v-if="uploadedFiles.profile && driverForm.profileImageUrl" class="file-success">
                      <v-icon color="success" small>mdi-check-circle</v-icon>
                      Profile photo uploaded successfully
                    </div>
                    <div v-if="photoErrors.profile" class="file-error">
                      <v-icon color="error" small>mdi-alert-circle</v-icon>
                      {{ photoErrors.profile }}
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" md="6">
                  <div class="upload-preview" v-if="previewUrls.profile">
                    <img :src="previewUrls.profile" alt="Profile Photo Preview" class="preview-image">
                  </div>
                  <div v-else class="upload-placeholder">
                    <v-icon size="48" color="grey lighten-1">mdi-account-circle</v-icon>
                    <div class="mt-2 grey--text">Profile Photo Preview</div>
                    <div class="mt-1 caption grey--text">Max size: 5MB</div>
                    <div class="caption grey--text">JPG, JPEG, PNG only</div>
                  </div>
                </v-col>
              </v-row>

              <!-- License Front -->
              <v-row class="mb-4">
                <v-col cols="12">
                  <div class="upload-section-title">Driving License - Front Side</div>
                </v-col>
                <v-col cols="12" md="6">
                  <div class="upload-container">
                    <v-btn 
                      color="primary" 
                      block 
                      @click="triggerUpload('licenseFront')"
                      :disabled="apiRegister.isLoading || uploadingLicenseFront"
                      :loading="uploadingLicenseFront"
                    >
                      {{ uploadingLicenseFront ? 'Uploading...' : 'Upload License Front' }}
                    </v-btn>
                    <input 
                      type="file" 
                      ref="licenseFrontPhoto" 
                      accept="image/jpeg,image/jpg,image/png,image/webp" 
                      hidden 
                      @change="handleFileUpload($event, 'licenseFront')"
                    >
                    <div v-if="uploadedFiles.licenseFront && driverForm.licenceFrontImageUrl" class="file-success">
                      <v-icon color="success" small>mdi-check-circle</v-icon>
                      License front uploaded successfully
                    </div>
                    <div v-if="photoErrors.licenseFront" class="file-error">
                      <v-icon color="error" small>mdi-alert-circle</v-icon>
                      {{ photoErrors.licenseFront }}
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" md="6">
                  <div class="upload-preview" v-if="previewUrls.licenseFront">
                    <img :src="previewUrls.licenseFront" alt="License Front Preview" class="preview-image">
                  </div>
                  <div v-else class="upload-placeholder">
                    <v-icon size="48" color="grey lighten-1">mdi-card-account-details</v-icon>
                    <div class="mt-2 grey--text">License Front Preview</div>
                    <div class="mt-1 caption grey--text">Max size: 5MB</div>
                    <div class="caption grey--text">JPG, JPEG, PNG only</div>
                  </div>
                </v-col>
              </v-row>

              <!-- License Back -->
              <v-row class="mb-4">
                <v-col cols="12">
                  <div class="upload-section-title">Driving License - Back Side</div>
                </v-col>
                <v-col cols="12" md="6">
                  <div class="upload-container">
                    <v-btn 
                      color="primary" 
                      block 
                      @click="triggerUpload('licenseBack')"
                      :disabled="apiRegister.isLoading || uploadingLicenseBack"
                      :loading="uploadingLicenseBack"
                    >
                      {{ uploadingLicenseBack ? 'Uploading...' : 'Upload License Back' }}
                    </v-btn>
                    <input 
                      type="file" 
                      ref="licenseBackPhoto" 
                      accept="image/jpeg,image/jpg,image/png,image/webp" 
                      hidden 
                      @change="handleFileUpload($event, 'licenseBack')"
                    >
                    <div v-if="uploadedFiles.licenseBack && driverForm.licenceBackImageUrl" class="file-success">
                      <v-icon color="success" small>mdi-check-circle</v-icon>
                      License back uploaded successfully
                    </div>
                    <div v-if="photoErrors.licenseBack" class="file-error">
                      <v-icon color="error" small>mdi-alert-circle</v-icon>
                      {{ photoErrors.licenseBack }}
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" md="6">
                  <div class="upload-preview" v-if="previewUrls.licenseBack">
                    <img :src="previewUrls.licenseBack" alt="License Back Preview" class="preview-image">
                  </div>
                  <div v-else class="upload-placeholder">
                    <v-icon size="48" color="grey lighten-1">mdi-card-account-details-outline</v-icon>
                    <div class="mt-2 grey--text">License Back Preview</div>
                    <div class="mt-1 caption grey--text">Max size: 5MB</div>
                    <div class="caption grey--text">JPG, JPEG, PNG only</div>
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
                    :loading="apiRegister.isLoading"
                    :disabled="!valid || apiRegister.isLoading || !allPhotosUploaded"
                    @click="registerDriver"
                  >
                    {{ apiRegister.isLoading ? 'Registering...' : 'Register Now' }}
                  </v-btn>
                  <div v-if="!allPhotosUploaded" class="mt-2 caption grey--text">
                    Please upload all required documents to continue
                  </div>
                  <div class="mt-2 caption grey--text">
                    Required: Profile photo, License front & back
                  </div>
                </v-col>
              </v-row>

              <!-- Back to Login -->
              <v-row justify="center" class="mt-4">
                <v-col cols="12" class="text-center">
                  <div class="grey--text">Already registered?</div>
                  <v-btn
                    color="primary"
                    text
                    small
                    :to="{ name: 'LoginView' }"
                    :disabled="apiRegister.isLoading"
                  >
                    Back to Login
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <!-- Success Page -->
  <v-container v-else class="success-container" fluid>
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" sm="6" md="4">
        <v-card class="pa-6 text-center" elevation="8">
          <div class="success-icon mb-4">
            <v-icon color="success" size="80">mdi-check-circle</v-icon>
          </div>
          <h2 class="success-title mb-3">Registration Successful!</h2>
          <p class="success-message mb-6">
            Your driver registration has been submitted successfully. 
            You can now login with your mobile number.
          </p>
          <v-btn
            color="primary"
            large
            block
            :to="{ name: 'LoginView' }"
          >
            Go to Login
          </v-btn>
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
    uploadingPhoto: false,
    uploadingLicenseFront: false,
    uploadingLicenseBack: false,
    photoErrors: {
      profile: null,
      licenseFront: null,
      licenseBack: null,
    },
    previewUrls: {
      profile: null,
      licenseFront: null,
      licenseBack: null,
    },
    
    driverForm: {
      firstName: '',
      lastName: '',
      mobileNo: '',
      email: '',
      nicNo: '',
      drivingLicenceNo: '',
      address: '',
      city: '',
      postCode: '',
      profileImageUrl: '',
      licenceFrontImageUrl: '',
      licenceBackImageUrl: '',
    },
    
    uploadedFiles: {
      profile: null,
      licenseFront: null,
      licenseBack: null,
    },
    
    rules: {
      required: v => !!v || 'This field is required',
      phone: v => {
        if (!v) return 'Mobile number is required';
      },
      email: v => {
        if (!v) return true; // Optional field
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(v) || 'Enter valid email address';
      },
    },

    // API configuration
    apiRegister: {
      isLoading: false,
      isError: false,
      error: null,
      url: null,
    },
  }),

  methods: {
    triggerUpload(type) {
      if (type === 'profile') {
        this.$refs.profilePhoto.click();
      } else if (type === 'licenseFront') {
        this.$refs.licenseFrontPhoto.click();
      } else if (type === 'licenseBack') {
        this.$refs.licenseBackPhoto.click();
      }
    },

    async handleFileUpload(event, type) {
      const file = event.target.files[0];
      if (!file) return;

      // Validate file
      const maxSize = 1 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        this.photoErrors[type] = 'Photo size must be less than 1MB';
        return;
      }

      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        this.photoErrors[type] = 'Only JPG, JPEG, and PNG files are allowed';
        return;
      }

      this.photoErrors[type] = null;
      
      // Set loading state based on type
      if (type === 'profile') {
        this.uploadingPhoto = true;
      } else if (type === 'licenseFront') {
        this.uploadingLicenseFront = true;
      } else if (type === 'licenseBack') {
        this.uploadingLicenseBack = true;
      }

      try {
        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
          this.previewUrls[type] = e.target.result;
        };
        reader.readAsDataURL(file);

        // Convert file to base64 data URI for upload API
        const base64DataUri = await this.convertFileToBase64(file);
        
        // Upload to your API
        const uploadedUrl = await this.uploadImageToAPI(base64DataUri);
        
        this.uploadedFiles[type] = file;
        
        // Store URL in appropriate field
        if (type === 'profile') {
          this.driverForm.profileImageUrl = uploadedUrl;
        } else if (type === 'licenseFront') {
          this.driverForm.licenceFrontImageUrl = uploadedUrl;
        } else if (type === 'licenseBack') {
          this.driverForm.licenceBackImageUrl = uploadedUrl;
        }
        
      } catch (error) {
        this.photoErrors[type] = 'Failed to upload photo. Please try again.';
        console.error('Upload error:', error);
      } finally {
        // Reset loading state
        if (type === 'profile') {
          this.uploadingPhoto = false;
        } else if (type === 'licenseFront') {
          this.uploadingLicenseFront = false;
        } else if (type === 'licenseBack') {
          this.uploadingLicenseBack = false;
        }
      }
    },

    convertFileToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          // Keep the complete data URI (data:image/jpeg;base64,...)
          // Cloudinary needs this to identify the file type
          resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    },

    async uploadImageToAPI(base64DataUri) {
      const apiUpload = {
        url: `${this.$api.servers.backend}/api/v1/document/upload`,
        isLoading: false,
        isError: false,
        error: null,
      };

      return new Promise((resolve, reject) => {
        apiUpload.callbackReset = () => {
          apiUpload.isLoading = true;
          apiUpload.isError = false;
          apiUpload.error = null;
        };
        
        apiUpload.callbackError = (e) => {
          apiUpload.isLoading = false;
          apiUpload.isError = true;
          apiUpload.error = e;
          reject(e);
        };
        
        apiUpload.callbackSuccess = (resp) => {
          apiUpload.isLoading = false;
          if (resp && resp.image_url) {
            resolve(resp.image_url);
          } else {
            reject(new Error('No image URL returned from server'));
          }
        };

        // Send the complete data URI to Cloudinary
        apiUpload.params = {
          image: base64DataUri
        };

        this.$api.fetch(apiUpload);
      });
    },

    async registerDriver() {
      if (!this.$refs.form.validate()) {
        return;
      }

      this.apiRegister.url = `${this.$api.servers.backend}/api/v1/driver/auth/register`;
      this.apiRegister.callbackReset = () => {
        this.apiRegister.isLoading = true;
        this.apiRegister.isError = false;
        this.apiRegister.error = null;
      };
      
      this.apiRegister.callbackError = (e) => {
        this.apiRegister.isLoading = false;
        this.apiRegister.isError = true;
        this.apiRegister.error = e;
        console.error('Registration error:', e);
      };
      
      this.apiRegister.callbackSuccess = (resp) => {
        this.apiRegister.isLoading = false;
        console.log('Registration successful:', resp);
        this.isRegistered = true;
      };

      // Prepare data according to API schema
      this.apiRegister.params = {
        firstName: this.driverForm.firstName,
        lastName: this.driverForm.lastName,
        mobileNo: this.driverForm.mobileNo,
        email: this.driverForm.email || undefined,
        drivingLicenceNo: this.driverForm.drivingLicenceNo,
        imageUrl: this.driverForm.profileImageUrl || undefined,
        licenceFrontImageUrl: this.driverForm.licenceFrontImageUrl || undefined,
        licenceBackImageUrl: this.driverForm.licenceBackImageUrl || undefined,
        address: this.driverForm.address,
        city: this.driverForm.city,
        post_code: this.driverForm.postCode,
      };

      this.$api.fetch(this.apiRegister);
    },
  },

  computed: {
    allPhotosUploaded() {
      return this.driverForm.profileImageUrl && 
             this.driverForm.licenceFrontImageUrl && 
             this.driverForm.licenceBackImageUrl;
    }
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

.upload-container {
  height: 100%;
}

.upload-section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #0074e7;
  margin-bottom: 8px;
  padding-left: 4px;
}

.upload-preview {
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-placeholder {
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fafafa;
}

.preview-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.file-success {
  font-size: 0.9rem;
  color: #4caf50;
  margin-top: 8px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.file-error {
  font-size: 0.9rem;
  color: #f44336;
  margin-top: 8px;
  text-align: center;
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

.success-container {
  background: #f8f8fb;
  min-height: 100vh;
}

.success-icon {
  animation: bounce 0.6s ease-in-out;
}

.success-title {
  color: #0074e7;
  font-weight: 600;
}

.success-message {
  color: #666;
  line-height: 1.5;
}

.fill-height {
  min-height: 80vh;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

@media (max-width: 600px) {
  .driver-reg-card {
    margin: 16px;
    padding: 12px 16px 16px 16px;
  }
  
  .driver-reg-title {
    font-size: 1.5rem;
  }
  
  .upload-preview,
  .upload-placeholder {
    height: 150px;
  }
  
  .register-btn {
    min-width: 180px;
    font-size: 1rem;
  }
}
</style>