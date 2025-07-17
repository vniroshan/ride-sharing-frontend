<template>
  <v-container>
    <v-card class="mx-auto" elevation="2">
      <v-card-title class="primary white--text">
        <span class="headline">Driver Records</span>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
          dark
        ></v-text-field>
      </v-card-title>
      
      <v-data-table
        :headers="headers"
        :items="drivers"
        :search="search"
        :items-per-page="10"
        class="elevation-1"
      >
        <template v-slot:item.actions="{ item }">
          <v-btn
            small
            color="primary"
            @click="viewDriver(item.id)"
          >
            View
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'DriverRecords',
  data() {
    return {
      search: '',
      headers: [
        { text: 'Driver ID', value: 'id' },
        { text: 'Full Name', value: 'fullName' },
        { text: 'Vehicle No', value: 'vehicleNo' },
        { text: 'Vehicle Model', value: 'vehicleModel' },
        { text: 'License No', value: 'licenseNumber' },
        { text: 'Status', value: 'status' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      drivers: [
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
        {
          id: 2,
          fullName: 'John Smith',
          idNumber: '987654321',
          mobileNo: '+44 123456789',
          address: '456 London Rd',
          dob: '1985-11-22',
          licenseNumber: '22B45C789123',
          vehicleNo: 'AB12CDE',
          vehicleModel: 'Toyota Prius',
          color: 'Blue',
          registerNo: 'UK-AB12CDE-F',
          year: '2019',
          seats: '5',
          status: 'Pending',
          photo: 'driver2.jpg',
          licensePhoto: 'license2.jpg',
          vehiclePhoto: 'vehicle2.jpg'
        },
        // Add more driver records as needed
      ]
    }
  },
  methods: {
    viewDriver(id) {
      this.$router.push({ name: 'DriverRecordDetailView', params: { id } });
    }
  }
}
</script>

<style scoped>
.primary {
  background-color: #0074e7 !important;
}
</style>