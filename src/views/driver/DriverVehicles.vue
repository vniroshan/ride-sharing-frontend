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
      
      <v-data-table
        :headers="headers"
        :items="vehicles"
        :loading="loading"
        :items-per-page="10"
      >
        <template item.images="{ item }">
          <div class="d-flex">
            <v-img
              v-for="(img, idx) in item.images.slice(0, 3)"
              :key="idx"
              :src="img"
              width="60"
              height="40"
              class="mr-1"
            ></v-img>
            <span v-if="item.images.length > 3">+{{ item.images.length - 3 }}</span>
          </div>
        </template>
        
        <template tem.actions="{ item }">
          <v-icon small @click="editVehicle(item)" class="mr-2">mdi-pencil</v-icon>
          <v-icon small @click="deleteVehicle(item)">mdi-delete</v-icon>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="editDialog" max-width="600">
      <DriverEditVehicle 
        :vehicle="selectedVehicle"
        @close="editDialog = false"
        @saved="handleVehicleSaved"
      />
    </v-dialog>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';
import DriverEditVehicle from '@/components/driver/DriverEditVehicle.vue';

export default {
  components: { DriverEditVehicle },
  data: () => ({
    loading: false,
    vehicles: [],
    editDialog: false,
    selectedVehicle: null,
    headers: [
      { text: 'Vehicle No', value: 'vehicle_no' },
      { text: 'Type', value: 'type' },
      { text: 'Registration No', value: 'reg_no' },
      { text: 'Photos', value: 'images' },
      { text: 'Actions', value: 'actions', sortable: false },
    ],
    breadcrumbs: [
      { text: 'Dashboard', to: { name: 'DriverDashboardView' } },
      { text: 'Vehicles', active: true }
    ]
  }),
  computed: {
    ...mapState({
      account: state => state.account.data,
    })
  },
  mounted() {
    this.fetchVehicles();
  },
  methods: {
    async fetchVehicles() {
      this.loading = true;
      try {
        const response = await this.$axios.get('/driver/vehicles/all');
        this.vehicles = response.data.data.map(v => ({
          ...v,
          images: v.vehicle_images.map(img => img.image_url)
        }));
      } catch (error) {
        console.error('Failed to fetch vehicles:', error);
      } finally {
        this.loading = false;
      }
    },
    editVehicle(vehicle) {
      this.selectedVehicle = vehicle;
      this.editDialog = true;
    },
    async deleteVehicle(vehicle) {
      if(confirm('Are you sure you want to delete this vehicle?')) {
        try {
          await this.$axios.post('/driver/vehicles/delete', { uuid: vehicle.uuid });
          this.fetchVehicles();
        } catch (error) {
          console.error('Delete failed:', error);
        }
      }
    },
    openCreateDialog() {
      this.selectedVehicle = null;
      this.editDialog = true;
    },
    handleVehicleSaved() {
      this.editDialog = false;
      this.fetchVehicles();
    }
  }
};
</script>