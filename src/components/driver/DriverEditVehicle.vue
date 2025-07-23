<template>
  <v-card>
    <v-card-title class="headline">
      {{ isEditMode ? 'Edit Vehicle' : 'Add New Vehicle' }}
    </v-card-title>
    
    <v-card-text>
      <v-form ref="form" v-model="valid">
        <v-text-field
          v-model="localVehicle.vehicle_no"
          label="Vehicle Number"
          :rules="[v => !!v || 'Required']"
          required
        ></v-text-field>
        
        <v-text-field
          v-model="localVehicle.reg_no"
          label="Registration Number"
        ></v-text-field>
        
        <v-select
          v-model="localVehicle.type"
          :items="vehicleTypes"
          label="Vehicle Type"
          item-text="text"
          item-value="value"
        ></v-select>
        
        <v-file-input
          multiple
          label="Vehicle Photos"
          accept="image/*"
          prepend-icon="mdi-camera"
          @change="handleFileUpload"
          show-size
        ></v-file-input>
        
        <div class="d-flex flex-wrap">
          <v-img
            v-for="(img, idx) in previewImages"
            :key="idx"
            :src="img"
            width="100"
            height="80"
            class="ma-1"
          ></v-img>
        </div>
      </v-form>
    </v-card-text>
    
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn text @click="$emit('close')">Cancel</v-btn>
      <v-btn color="primary" @click="saveVehicle" :loading="saving">
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    vehicle: Object
  },
  data: () => ({
    valid: false,
    saving: false,
    previewImages: [],
    uploadFiles: [],
    vehicleTypes: [
      { text: 'Sedan', value: 'SEDAN' },
      { text: 'SUV', value: 'SUV' },
      { text: 'Van', value: 'VAN' },
      { text: 'Motorcycle', value: 'MOTORCYCLE' }
    ],
    localVehicle: {
      vehicle_no: '',
      reg_no: '',
      type: '',
      image_urls: []
    }
  }),
  methods: {
  async saveVehicle() {
    if (!this.$refs.form.validate()) return;
    
    this.saving = true;
    try {
      const formData = new FormData();
      
      // Add vehicle data
      formData.append('vehicle_no', this.localVehicle.vehicle_no);
      formData.append('reg_no', this.localVehicle.reg_no);
      formData.append('type', this.localVehicle.type);
      
      // Add files
      this.uploadFiles.forEach(file => {
        formData.append('images', file);
      });
      
      // Use appropriate endpoint
      const endpoint = this.isEditMode 
        ? '/driver/vehicles/edit' 
        : '/driver/vehicles/new-with-upload';
      
      // Fixed: Remove unused response variable
      await this.$axios.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      this.$emit('saved');
      this.$emit('close');
    } catch (error) {
      console.error('Save failed:', error);
      // Consider adding user feedback here
    } finally {
      this.saving = false;
    }
  }
}
};
</script>