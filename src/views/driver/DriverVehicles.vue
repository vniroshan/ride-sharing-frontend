<template>
  <v-container>
    <ABreadcrumb :items="breadcrumbs"></ABreadcrumb>
    
    <v-card class="mt-4">
      <v-card-title class="d-flex justify-space-between align-center">
        <h2>My Vehicles</h2>
        <v-btn color="primary" @click="openCreateDialog">
          <v-icon left>mdi-plus</v-icon> Add Vehicle
        </v-btn>
      </v-card-title>
      
      <!-- Loading -->
      <v-card-text v-if="apiGetAll.isLoading">
        <div class="text-center py-8">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
          <div class="mt-4">Loading vehicles...</div>
        </div>
      </v-card-text>

      <!-- Error State -->
      <v-card-text v-else-if="apiGetAll.isError">
        <v-alert type="error" class="mb-0">
          Failed to load vehicles. Please try again.
          <template v-slot:append>
            <v-btn small text @click="fetchVehicles">Retry</v-btn>
          </template>
        </v-alert>
      </v-card-text>

      <!-- Empty State -->
      <v-card-text v-else-if="vehicles.length === 0">
        <div class="text-center py-8">
          <v-icon size="64" color="grey lighten-1">mdi-car-off</v-icon>
          <div class="text-h6 grey--text mt-4">No vehicles found</div>
          <div class="grey--text">Click "Add Vehicle" to get started</div>
        </div>
      </v-card-text>

      <!-- Vehicles Table -->
      <v-simple-table v-else>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">Vehicle No</th>
              <th class="text-left">Type</th>
              <th class="text-left">Registration No</th>
              <th class="text-left">Photos</th>
              <th class="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="vehicle in vehicles" :key="vehicle.id || vehicle.uuid">
              <!-- Vehicle Number -->
              <td>
                <span class="font-weight-medium">{{ vehicle.vehicle_no }}</span>
              </td>
              
              <!-- Vehicle Type -->
              <td>
                <v-chip
                  :color="getTypeColor(vehicle.type)"
                  text-color="white"
                  small
                >
                  {{ vehicle.type || 'Not specified' }}
                </v-chip>
              </td>
              
              <!-- Registration Number -->
              <td>
                <span class="font-weight-medium">{{ vehicle.reg_no || 'Not specified' }}</span>
              </td>
              
              <!-- Photos -->
              <td>
                <div class="d-flex align-center">
                  <v-img
                    v-for="(img, idx) in vehicle.images.slice(0, 3)"
                    :key="idx"
                    :src="img.image_url"
                    width="40"
                    height="40"
                    class="mr-1 rounded elevation-1"
                    contain
                  ></v-img>
                  <v-chip
                    v-if="vehicle.vehicle_images.length > 3"
                    small
                    color="grey lighten-2"
                  >
                    +{{ vehicle.vehicle_images.length - 3 }}
                  </v-chip>
                  <span v-if="vehicle.vehicle_images.length === 0" class="text--secondary">
                    No photos
                  </span>
                </div>
              </td>
              
              <!-- Actions -->
              <td class="text-center">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      icon
                      small
                      @click="editVehicle(vehicle)"
                      color="primary"
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon small>mdi-pencil</v-icon>
                    </v-btn>
                  </template>
                  <span>Edit Vehicle</span>
                </v-tooltip>
                
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      icon
                      small
                      @click="deleteVehicle(vehicle)"
                      color="error"
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon small>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                  <span>Delete Vehicle</span>
                </v-tooltip>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
      
      <!-- Pagination info -->
      <v-card-actions v-if="vehicles.length > 0">
        <v-spacer></v-spacer>
        <span class="grey--text">{{ vehicles.length }} vehicles total</span>
      </v-card-actions>
    </v-card>

    <!-- Create/Edit Vehicle Dialog -->
    <v-dialog v-model="vehicleDialog" max-width="800" persistent>
      <v-card>
        <v-card-title class="text-h5 primary white--text">
          <v-icon class="mr-2" color="white">
            {{ isEditMode ? 'mdi-pencil' : 'mdi-plus' }}
          </v-icon>
          {{ isEditMode ? 'Edit Vehicle' : 'Add New Vehicle' }}
        </v-card-title>
        
        <v-card-text class="pt-6">
          <v-form ref="vehicleForm" v-model="formValid">
            <!-- Vehicle Details -->
            <div class="section-title">Vehicle Information</div>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="vehicleForm.vehicle_no"
                  label="Vehicle Number *"
                  outlined
                  dense
                  :rules="[rules.required]"
                  :disabled="isSaving"
                  placeholder="e.g., ABC-123"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="vehicleForm.type"
                  label="Vehicle Type"
                  outlined
                  dense
                  :items="vehicleTypes"
                  :disabled="isSaving"
                  clearable
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="vehicleForm.reg_no"
                  label="Registration Number"
                  outlined
                  dense
                  :disabled="isSaving"
                  placeholder="e.g., LES-1234"
                />
              </v-col>
            </v-row>

            <!-- Image Upload Section -->
            <div class="section-title mt-6">Vehicle Photos</div>
            <v-row>
              <v-col cols="12">
                <div class="upload-area">
                  <div class="upload-dropzone" @click="triggerFileInput">
                    <input
                      ref="fileInput"
                      type="file"
                      multiple
                      accept="image/jpeg,image/jpg,image/png"
                      hidden
                      @change="handleFileUpload"
                    />
                    <div class="upload-content">
                      <v-icon size="48" color="primary">mdi-cloud-upload</v-icon>
                      <div class="mt-2 text-h6">Upload Vehicle Photos</div>
                      <div class="grey--text">Click to select or drag and drop images</div>
                      <div class="caption grey--text mt-1">JPG, JPEG, PNG • Max 5MB each</div>
                    </div>
                  </div>
                  
                  <!-- Upload Progress -->
                  <div v-if="uploadProgress.show" class="upload-progress mt-3">
                    <div class="d-flex align-center">
                      <v-progress-circular
                        v-if="uploadProgress.uploading"
                        indeterminate
                        size="20"
                        width="2"
                        color="primary"
                        class="mr-2"
                      />
                      <v-icon v-else color="success" class="mr-2">mdi-check-circle</v-icon>
                      <span>{{ uploadProgress.message }}</span>
                    </div>
                  </div>

                  <!-- Error Display -->
                  <v-alert
                    v-if="uploadError"
                    type="error"
                    dense
                    class="mt-3"
                    dismissible
                    @input="uploadError = null"
                  >
                    {{ uploadError }}
                  </v-alert>
                </div>
              </v-col>
            </v-row>

            <!-- Image Preview -->
            <v-row v-if="imagePreview.length > 0" class="mt-2">
              <v-col cols="12">
                <div class="preview-title">Selected Images ({{ imagePreview.length }})</div>
                <div class="image-preview-grid">
                  <div
                    v-for="(image, index) in imagePreview"
                    :key="index"
                    class="image-preview-item"
                  >
                    <v-img
                      :src="image.preview"
                      aspect-ratio="1"
                      class="preview-image"
                    >
                      <v-btn
                        icon
                        small
                        color="error"
                        class="remove-btn"
                        @click="removeImage(index)"
                        :disabled="isSaving"
                      >
                        <v-icon small>mdi-close</v-icon>
                      </v-btn>
                    </v-img>
                    <div class="image-name">{{ image.name }}</div>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        
        <v-card-actions class="px-6 pb-6">
          <v-spacer></v-spacer>
          <v-btn
            text
            @click="closeVehicleDialog"
            :disabled="isSaving"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            @click="saveVehicle"
            :loading="isSaving"
            :disabled="!formValid || isSaving"
          >
            {{ isEditMode ? 'Update Vehicle' : 'Add Vehicle' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h5">
          <v-icon color="error" class="mr-2">mdi-alert</v-icon>
          Confirm Delete
        </v-card-title>
        <v-card-text>
          Are you sure you want to delete vehicle <strong>{{ vehicleToDelete?.vehicle_no }}</strong>?
          <br>
          <span class="error--text">This action cannot be undone.</span>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="deleteDialog = false">
            Cancel
          </v-btn>
          <v-btn 
            color="error" 
            @click="confirmDelete" 
            :loading="apiDelete.isLoading"
          >
            Delete
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
import { mapState } from 'vuex';

export default {
  name: 'VehicleManagement',
  
  data() {
    return {
      vehicles: [],
      vehicleDialog: false,
      deleteDialog: false,
      selectedVehicle: null,
      vehicleToDelete: null,
      formValid: false,
      isSaving: false,
      uploadError: null,
      imagePreview: [],
      uploadedImageUrls: [],
      
      uploadProgress: {
        show: false,
        uploading: false,
        message: ''
      },
      
      vehicleForm: {
        uuid: null,
        vehicle_no: '',
        type: '',
        reg_no: '',
      },
      
      vehicleTypes: [
        'Sedan',
        'SUV', 
        'Hatchback',
        'Truck',
        'Van',
        'Motorcycle',
        'Bus',
        'Coupe',
        'Convertible'
      ],
      
      rules: {
        required: v => !!v || 'This field is required',
      },
      
      // API configurations
      apiGetAll: {
        isLoading: false,
        isError: false,
        error: null,
        url: null,
      },
      
      apiSave: {
        isLoading: false,
        isError: false,
        error: null,
        url: null,
      },
      
      apiDelete: {
        isLoading: false,
        isError: false,
        error: null,
        url: null,
      },
      
      snackbar: {
        show: false,
        message: '',
        color: 'success',
        timeout: 3000
      },
      
      breadcrumbs: [
        { 
          text: 'Dashboard', 
          to: { name: 'DriverDashboardView' } 
        },
        { 
          text: 'Vehicles', 
          active: true 
        }
      ]
    };
  },
  
  computed: {
    ...mapState({
      account: state => state.account.data,
    }),
    
    isEditMode() {
      return !!this.selectedVehicle;
    }
  },
  
  mounted() {
    this.fetchVehicles();
  },
  
  methods: {
    fetchVehicles() {
      this.apiGetAll.method = 'GET';
      this.apiGetAll.url = `${this.$api.servers.backend}/api/v1/driver/vehicles/all`;
      
      this.apiGetAll.callbackReset = () => {
        this.apiGetAll.isLoading = true;
        this.apiGetAll.isError = false;
        this.apiGetAll.error = null;
      };
      
      this.apiGetAll.callbackError = (error) => {
        this.apiGetAll.isLoading = false;
        this.apiGetAll.isError = true;
        this.apiGetAll.error = error;
        this.showSnackbar('Failed to load vehicles', 'error');
      };
      
      this.apiGetAll.callbackSuccess = (response) => {
        this.apiGetAll.isLoading = false;
        console.log('Vehicles loaded:', response);
        
        // Process the response to ensure images array exists
        this.vehicles = response.map(vehicle => ({
          ...vehicle,
          images: vehicle.vehicle_images || []
        }));
      };
      
      this.$api.fetch(this.apiGetAll);
    },
    
    openCreateDialog() {
      this.selectedVehicle = null;
      this.resetForm();
      this.vehicleDialog = true;
    },
    
    editVehicle(vehicle) {
      this.selectedVehicle = { ...vehicle };
      this.vehicleForm = {
        uuid: vehicle.uuid,
        vehicle_no: vehicle.vehicle_no,
        type: vehicle.type || '',
        reg_no: vehicle.reg_no || '',
      };
      
      // Load existing images
      this.uploadedImageUrls = vehicle.images.map(img => img.image_url);
      this.imagePreview = vehicle.images.map((img, index) => ({
        preview: img.image_url,
        name: `Existing Image ${index + 1}`,
        isExisting: true,
        url: img.image_url
      }));
      
      this.vehicleDialog = true;
    },
    
    resetForm() {
      this.vehicleForm = {
        uuid: null,
        vehicle_no: '',
        type: '',
        reg_no: '',
      };
      this.imagePreview = [];
      this.uploadedImageUrls = [];
      this.uploadError = null;
      this.uploadProgress.show = false;
      if (this.$refs.vehicleForm) {
        this.$refs.vehicleForm.resetValidation();
      }
    },
    
    closeVehicleDialog() {
      this.vehicleDialog = false;
      this.selectedVehicle = null;
      setTimeout(() => {
        this.resetForm();
      }, 300);
    },
    
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    
    async handleFileUpload(event) {
      const files = Array.from(event.target.files);
      if (files.length === 0) return;
      
      this.uploadError = null;
      this.uploadProgress.show = true;
      this.uploadProgress.uploading = true;
      this.uploadProgress.message = `Uploading ${files.length} image(s)...`;
      
      try {
        for (const file of files) {
          // Validate file
          if (file.size > 5 * 1024 * 1024) {
            throw new Error(`${file.name} is too large (max 5MB)`);
          }
          
          if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
            throw new Error(`${file.name} is not a valid image format`);
          }
          
          // Convert to base64 and upload
          const base64DataUri = await this.convertFileToBase64(file);
          const uploadedUrl = await this.uploadImageToAPI(base64DataUri);
          
          // Add to preview and uploaded URLs
          this.imagePreview.push({
            preview: URL.createObjectURL(file),
            name: file.name,
            isExisting: false,
            url: uploadedUrl
          });
          
          this.uploadedImageUrls.push(uploadedUrl);
        }
        
        this.uploadProgress.uploading = false;
        this.uploadProgress.message = `${files.length} image(s) uploaded successfully`;
        
        setTimeout(() => {
          this.uploadProgress.show = false;
        }, 2000);
        
      } catch (error) {
        this.uploadError = error.message;
        this.uploadProgress.show = false;
        console.error('Upload error:', error);
      }
      
      // Clear the input
      event.target.value = '';
    },
    
    convertFileToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    },
    
    async uploadImageToAPI(base64DataUri) {
      return new Promise((resolve, reject) => {
        const apiUpload = {
          url: `${this.$api.servers.backend}/api/v1/document/upload`,
          isLoading: false,
          isError: false,
          error: null,
          callbackReset: () => {
            apiUpload.isLoading = true;
            apiUpload.isError = false;
            apiUpload.error = null;
          },
          callbackError: (e) => {
            apiUpload.isLoading = false;
            apiUpload.isError = true;
            apiUpload.error = e;
            reject(e);
          },
          callbackSuccess: (resp) => {
            apiUpload.isLoading = false;
            if (resp && resp.image_url) {
              resolve(resp.image_url);
            } else {
              reject(new Error('No image URL returned from server'));
            }
          },
          params: {
            image: base64DataUri
          }
        };
        
        this.$api.fetch(apiUpload);
      });
    },
    
    removeImage(index) {
      const removedImage = this.imagePreview[index];
      this.imagePreview.splice(index, 1);
      
      // Remove from uploaded URLs if it's not an existing image
      if (!removedImage.isExisting) {
        const urlIndex = this.uploadedImageUrls.indexOf(removedImage.url);
        if (urlIndex > -1) {
          this.uploadedImageUrls.splice(urlIndex, 1);
        }
      } else {
        // For existing images, remove from uploaded URLs
        const urlIndex = this.uploadedImageUrls.indexOf(removedImage.url);
        if (urlIndex > -1) {
          this.uploadedImageUrls.splice(urlIndex, 1);
        }
      }
    },
    
    async saveVehicle() {
      if (!this.$refs.vehicleForm.validate()) {
        return;
      }
      
      this.isSaving = true;
      
      const isEdit = this.isEditMode;
      const endpoint = isEdit ? '/edit' : '/new';
      
      this.apiSave.url = `${this.$api.servers.backend}/api/v1/driver/vehicles${endpoint}`;
      
      this.apiSave.callbackReset = () => {
        this.apiSave.isLoading = true;
        this.apiSave.isError = false;
        this.apiSave.error = null;
      };
      
      this.apiSave.callbackError = (error) => {
        this.apiSave.isLoading = false;
        this.apiSave.isError = true;
        this.apiSave.error = error;
        this.isSaving = false;
        this.showSnackbar(`Failed to ${isEdit ? 'update' : 'create'} vehicle`, 'error');
      };
      
      this.apiSave.callbackSuccess = (response) => {
        this.apiSave.isLoading = false;
        this.isSaving = false;
        console.log('Vehicle saved:', response);
        
        this.showSnackbar(`Vehicle ${isEdit ? 'updated' : 'created'} successfully`, 'success');
        this.closeVehicleDialog();
        this.fetchVehicles();
      };
      
      // Prepare data
      const vehicleData = {
        vehicle_no: this.vehicleForm.vehicle_no,
        reg_no: this.vehicleForm.reg_no || undefined,
        type: this.vehicleForm.type || undefined,
        image_urls: this.uploadedImageUrls
      };
      
      if (isEdit) {
        vehicleData.uuid = this.vehicleForm.uuid;
      }
      
      this.apiSave.params = vehicleData;
      this.$api.fetch(this.apiSave);
    },
    
    deleteVehicle(vehicle) {
      this.vehicleToDelete = vehicle;
      this.deleteDialog = true;
    },
    
    confirmDelete() {
      if (!this.vehicleToDelete) return;
      
      this.apiDelete.url = `${this.$api.servers.backend}/api/v1/driver/vehicles/delete`;
      
      this.apiDelete.callbackReset = () => {
        this.apiDelete.isLoading = true;
        this.apiDelete.isError = false;
        this.apiDelete.error = null;
      };
      
      this.apiDelete.callbackError = (error) => {
        this.apiDelete.isLoading = false;
        this.apiDelete.isError = true;
        this.apiDelete.error = error;
        this.showSnackbar('Failed to delete vehicle', 'error');
      };
      
      this.apiDelete.callbackSuccess = (response) => {
        this.apiDelete.isLoading = false;
        console.log('Vehicle deleted:', response);
        
        this.showSnackbar('Vehicle deleted successfully', 'success');
        this.deleteDialog = false;
        this.vehicleToDelete = null;
        this.fetchVehicles();
      };
      
      this.apiDelete.params = {
        uuid: this.vehicleToDelete.uuid
      };
      
      this.$api.fetch(this.apiDelete);
    },
    
    getTypeColor(type) {
      const colors = {
        'Sedan': 'blue',
        'SUV': 'green',
        'Hatchback': 'purple',
        'Truck': 'orange',
        'Van': 'purple',
        'Motorcycle': 'red',
        'Bus': 'teal',
        'Coupe': 'indigo',
        'Convertible': 'pink'
      };
      return colors[type] || 'grey';
    },
    
    showSnackbar(message, color = 'success') {
      this.snackbar.message = message;
      this.snackbar.color = color;
      this.snackbar.show = true;
    }
  }
};
</script>

<style scoped>
.v-simple-table {
  border-radius: 8px;
}

.v-simple-table th {
  background-color: #f8f9fa;
  font-weight: 600;
}

.v-simple-table tbody tr:hover {
  background-color: #f5f5f5;
}

.v-img {
  border: 1px solid #e0e0e0;
}

.v-chip {
  font-size: 12px;
}

.section-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #0074e7;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #e0e0e0;
}

.upload-area {
  width: 100%;
}

.upload-dropzone {
  border: 2px dashed #0074e7;
  border-radius: 12px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fafafa;
}

.upload-dropzone:hover {
  border-color: #005bb5;
  background: #f0f8ff;
}

.upload-content {
  pointer-events: none;
}

.upload-progress {
  padding: 12px;
  background: #f5f5f5;
  border-radius: 8px;
}

.preview-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.image-preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 16px;
}

.image-preview-item {
  position: relative;
}

.preview-image {
  border-radius: 8px;
  border: 2px solid #e0e0e0;
}

.remove-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  background: white !important;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.image-name {
  font-size: 0.8rem;
  color: #666;
  margin-top: 4px;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 600px) {
  .upload-dropzone {
    padding: 20px 12px;
  }
  
  .image-preview-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 12px;
  }
}
</style>