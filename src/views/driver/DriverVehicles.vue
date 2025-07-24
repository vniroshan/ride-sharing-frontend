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
      <v-card-text v-if="api.isLoading">
        <div class="text-center py-8">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
          <div class="mt-4">Loading vehicles...</div>
        </div>
      </v-card-text>

      <!-- Error State -->
      <v-card-text v-else-if="api.isError">
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

      <!-- Simple Table -->
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
                  {{ vehicle.type }}
                </v-chip>
              </td>
              
              <!-- Registration Number -->
              <td>
                <span class="font-weight-medium">{{ vehicle.reg_no }}</span>
              </td>
              
              <!-- Photos -->
              <td>
                <div class="d-flex align-center">
                  <v-img
                    v-for="(img, idx) in vehicle.images.slice(0, 3)"
                    :key="idx"
                    :src="img"
                    width="60"
                    height="40"
                    class="mr-1 rounded elevation-1"
                    contain
                  ></v-img>
                  <v-chip
                    v-if="vehicle.images.length > 3"
                    small
                    color="grey lighten-2"
                  >
                    +{{ vehicle.images.length - 3 }}
                  </v-chip>
                  <span v-if="vehicle.images.length === 0" class="text--secondary">
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
      
      <!-- Pagination (if needed) -->
      <v-card-actions v-if="vehicles.length > 10">
        <v-spacer></v-spacer>
        <span class="grey--text">{{ vehicles.length }} vehicles total</span>
      </v-card-actions>
    </v-card>

    <!-- Edit Dialog -->
    <v-dialog v-model="editDialog" max-width="600" persistent>
      <DriverEditVehicle 
        :vehicle="selectedVehicle"
        @close="closeEditDialog"
        @saved="handleVehicleSaved"
      />
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
          <v-btn color="error" @click="confirmDelete" :loading="deleteLoading">
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
import DriverEditVehicle from '@/components/driver/DriverEditVehicle.vue';

export default {
  name: 'VehiclesTable',
  components: { 
    DriverEditVehicle 
  },
  
  data() {
    return {
      vehicles: [],
      editDialog: false,
      deleteDialog: false,
      selectedVehicle: null,
      vehicleToDelete: null,
      deleteLoading: false,
      
      api: {
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
    })
  },
  
  mounted() {
    this.fetchVehicles();
  },
  
  methods: {
    fetchVehicles() {
      this.api.method = "GET";
      this.api.url = `${this.$api.servers.backend}/api/v1/driver/vehicles/all`;
      
      this.api.callbackReset = () => {
        this.api.isLoading = true;
        this.api.isError = false;
        this.api.error = null;
      };
      
      this.api.callbackError = (error) => {
        this.api.isLoading = false;
        this.api.isError = true;
        this.api.error = error;
        this.showSnackbar('Failed to load vehicles', 'error');
      };
      
      this.api.callbackSuccess = (response) => {
        this.api.isLoading = false;
        console.log('Vehicles loaded:', response);
        
        // Process the response to ensure images array exists
        this.vehicles = response.map(vehicle => ({
          ...vehicle,
          images: vehicle.vehicle_images ? 
            vehicle.vehicle_images.map(img => img.image_url) : []
        }));
      };
      
      this.$api.fetch(this.api);
    },
    
    editVehicle(vehicle) {
      this.selectedVehicle = { ...vehicle };
      this.editDialog = true;
    },
    
    deleteVehicle(vehicle) {
      this.vehicleToDelete = vehicle;
      this.deleteDialog = true;
    },
    
    async confirmDelete() {
      if (!this.vehicleToDelete) return;
      
      this.deleteLoading = true;
      try {
        await this.$axios.post('/driver/vehicles/delete', { 
          uuid: this.vehicleToDelete.uuid 
        });
        
        this.showSnackbar('Vehicle deleted successfully', 'success');
        this.fetchVehicles();
      } catch (error) {
        console.error('Delete failed:', error);
        this.showSnackbar('Failed to delete vehicle', 'error');
      } finally {
        this.deleteLoading = false;
        this.deleteDialog = false;
        this.vehicleToDelete = null;
      }
    },
    
    openCreateDialog() {
      this.selectedVehicle = null;
      this.editDialog = true;
    },
    
    closeEditDialog() {
      this.editDialog = false;
      this.selectedVehicle = null;
    },
    
    handleVehicleSaved() {
      this.closeEditDialog();
      this.showSnackbar('Vehicle saved successfully', 'success');
      this.fetchVehicles();
    },
    
    getTypeColor(type) {
      const colors = {
        'Sedan': 'blue',
        'SUV': 'green',
        'Truck': 'orange',
        'Van': 'purple',
        'Motorcycle': 'red',
        'Bus': 'teal'
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
</style>