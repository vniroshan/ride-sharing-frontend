<template>
  <v-app>
    <v-container fluid>
      <v-row class="my-6 justify-center">
        <v-col cols="12" md="8" class="text-center">
          <h2 class="text-h5 font-weight-bold primary"></h2>
        </v-col>
      </v-row>
      <v-row class="justify-center">
        <v-col cols="12" md="3">
          <v-card class="rounded-xl" elevation="4" style="height: 100%;">
            <v-card-title class="text-h5 font-weight-bold text-center pl-6" style="color: #4033a7; ">Ride information</v-card-title>
            <v-card-text class="pl-10">
              <div style="font-size:large;"><span style="color: #BDBDBE;">From:</span><br/><strong>Coventry</strong></div><br/>
              <div style="font-size:large;"><span style="color: #BDBDBE;">To:</span><br/><strong>Chester</strong></div><br/>
              <div style="font-size:large;"><span style="color: #BDBDBE;">Date:</span><br/><strong>25/08/2025</strong></div><br/>
              <div style="font-size:large;"><span style="color: #BDBDBE;">Time:</span><br/><strong>08.15 AM</strong></div><br/>
              <div style="font-size:large;"><span style="color: #BDBDBE;">Charge per seat:</span><br/><strong>£ 7.50</strong></div><br/>
              <div style="font-size:large;"><span style="color: #BDBDBE;">Available seats:</span><br/><strong>seats</strong></div><br/>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card class="rounded-xl" elevation="4" style="height:100%">
            <v-card-title class="text-h5 font-weight-bold" style="color: #4033a7; ">Vehicle information</v-card-title>
            <v-card-text class="pl-5">
              <v-row class="mb-2 mt-1" justify="space-around"> 
                <v-card class="rounded-lg" flat elevation="0" color="#BDBDBD">
                  <v-icon class="pa-4" large dark>mdi-account</v-icon>
                </v-card>
                <v-card class="rounded-lg" flat elevation="0" color="#BDBDBD">
                  <v-icon class="pa-4" large dark>mdi-car</v-icon>
                </v-card>
                <v-card class="rounded-lg" flat elevation="0" color="#BDBDBD">
                  <v-icon class="pa-4" large dark>mdi-car-side</v-icon>
                </v-card>
                
              </v-row>
              <v-form class="mt-6">
              <div style="font-size: large;"><span style="color: #BDBDBE;">Vehicle No:</span><br/><strong> NL530PG</strong></div><br/>
              <div style="font-size: large;"><span style="color: #BDBDBE;">Vehicle model:</span><br/><strong>BMW 2 series white</strong></div><br/>
              <div style="font-size: large;"><span style="color: #BDBDBE;">Reg no:</span><br/><strong>UK-NL530PG-C</strong></div><br/>
              <div style="font-size: large;"><span style="color: #BDBDBE;">Driver</span><br/><strong>Niroshan</strong></div><br/>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card class="rounded-xl" outlined elevation="4">
            <v-card-title class="text-h5 font-weight-bold" style="color: #4033a7; ">Book your seat</v-card-title>
            <v-card-text>
              <v-form>
                <v-text-field class="rounded-lg" label="Name" dense outlined></v-text-field>
                <v-text-field class="rounded-lg" label="Address" dense outlined></v-text-field>
                <v-text-field class="rounded-lg" label="Mobile No" dense outlined></v-text-field>
                <v-text-field class="rounded-lg" label="Email" dense outlined></v-text-field>
                <v-text-field class="rounded-lg" label="Charge Per Seat" dense outlined></v-text-field>
                <v-text-field class="rounded-lg" label="No Of Seat" dense outlined></v-text-field>
                <v-btn color="primary" block class="mt-3 rounded-lg">Book Now</v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<!-- <script>
export default{ 
  name:Ridebooking
}
</script> -->

<style scoped>
.v-card-title{
  background-color: #f5f5f5;
}
</style>