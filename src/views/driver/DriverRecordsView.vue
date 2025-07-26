<template>
  <v-container class="detail-container">
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card class="detail-card" elevation="2">
          <v-card-title class="justify-center success-title">
            <span class="headline">Your registration is successfully completed</span>
          </v-card-title>
          
          <v-card-text>
            <div class="subtitle mb-4 text-center">
              Your registration has been successfully completed. Check your details here
            </div>
            
            <v-simple-table>
              <template v-slot:default>
                <tbody>
                  <tr>
                    <td><strong>Driver name</strong></td>
                    <td>{{ driver.fullName }}</td>
                    <td><strong>Vehicle No</strong></td>
                    <td>{{ driver.vehicleNo }}</td>
                  </tr>
                  <tr>
                    <td><strong>Id no</strong></td>
                    <td>{{ driver.idNumber }}</td>
                    <td><strong>Vehicle Model</strong></td>
                    <td>{{ driver.vehicleModel }}</td>
                  </tr>
                  <tr>
                    <td><strong>Driving license no</strong></td>
                    <td>{{ driver.licenseNumber }}</td>
                    <td><strong>Register no</strong></td>
                    <td>{{ driver.registerNo }}</td>
                  </tr>
                  <tr>
                    <td><strong>Mobile No</strong></td>
                    <td>{{ driver.mobileNo }}</td>
                    <td><strong>No of seats</strong></td>
                    <td>{{ driver.seats }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
            
            <div class="mt-6 text-center additional-info">
              Once one team approves your registration, you will receive the details about your next step via SMS at {{ driver.mobileNo }}
            </div>
            
            <div class="text-center mt-6">
              <v-btn color="primary" @click="$router.go(-1)">
                Back to Records
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'DriverRecordDetailView',
  data() {
    return {
      driver: null
    }
  },
  created() {
    // In a real app, you would fetch this from an API using the ID
    const driverId = parseInt(this.$route.params.id);
    
    // Mock data - replace with actual API call
    const drivers = [
      {
        id: 1,
        fullName: 'Niroshan V',
        idNumber: '456985345',
        mobileNo: '+44 789654586',
        address: '123 Coventry St',
        dob: '1990-05-15',
        licenseNumber: '15A65D256455',
        vehicleNo: 'NL530PG',
        vehicleModel: 'BMW 2 series',
        color: 'Black',
        registerNo: 'UK-NL530PG-C',
        year: '2020',
        seats: '4',
        status: 'Approved',
        photo: 'driver1.jpg',
        licensePhoto: 'license1.jpg',
        vehiclePhoto: 'vehicle1.jpg'
      },
      // Add more driver records as needed
    ];
    
    this.driver = drivers.find(d => d.id === driverId) || {};
  }
}
</script>

<style scoped>
.detail-container {
  padding-top: 40px;
  padding-bottom: 40px;
}

.detail-card {
  border-radius: 18px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  padding: 24px;
}

.success-title {
  background-color: #4CAF50;
  color: white !important;
  padding: 16px;
  border-radius: 18px 18px 0 0;
  margin: -24px -24px 24px -24px;
}

.headline {
  font-size: 1.8rem;
  font-weight: 700;
}

.subtitle {
  font-size: 1.1rem;
  color: #555;
}

.additional-info {
  font-size: 1rem;
  color: #555;
  font-style: italic;
}

.v-data-table {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

td {
  padding: 12px 16px !important;
  border-bottom: 1px solid #e0e0e0;
}
</style>