<template>
  <v-app>
    <v-container fluid>
      <v-row class="my-6 justify-center">
        <v-col cols="12" md="8" class="text-center">
            <v-card>
                <h2 class="text-h5 font-weight-bold" style="color: #4033a7;">Manage booking</h2>
            </v-card>
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
              <div style="font-size:large;"><span style="color: #BDBDBE;">Vehicle No:</span><br/><strong>NL530PG</strong></div><br/>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card class="rounded-xl" elevation="4" style="height:100%">
            <v-card-title class="text-h5 font-weight-bold" style="color: #4033a7; ">Payment information</v-card-title>
            <v-card-text class="pl-5">
              <v-form class="mt-6">
              <div style="font-size: large;"><span style="color: #BDBDBE;">Ref No:</span><br/><strong> <RB-1234-C></RB-1234-C></strong></div><br/>
              <div style="font-size: large;"><span style="color: #BDBDBE;">Amount:</span><br/><strong>£ 7.50</strong></div><br/>
              <div style="font-size: large;"><span style="color: #BDBDBE;">Paid date:</span><br/><strong>24/08/2025</strong></div><br/>
              <div style="font-size: large;"><span style="color: #BDBDBE;">Status</span><br/><strong>Completed</strong></div><br/>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card class="rounded-xl" outlined elevation="4">
            <v-card-title class="text-h5 font-weight-bold" style="color: #4033a7; ">Bookings</v-card-title>
            <v-card-text>
              <v-form>
                <v-card class="mb-6 pa-6" elevation="2" rounded="lg">
                    <v-row>
                        <v-col cols="12" md="4" lg="7" right><div class="font-weight-bold text-subtitle-1" style="color: #4033a7;">
                                RB-1234-C
                            </div>
                        <div class="text-vody-2"><span>Malinga</span> <span>.</span><span>0789456545 </span><span>.</span><span>1Seat</span></div>
                        <div class="text-vody-2"><span>Coventry to Chester </span></div>
                        <div class="text-vody-2"><span>Booked on -  </span><span>24/05/2025</span><span>,</span><span>10.00PM</span></div>
                    </v-col>
                    <v-col align="right" cols="4" md="6" lg="5"><v-chip color="light-green accent-4" text-color="black" small>
                            Confirmed
                        </v-chip></v-col>
                    </v-row>
                    <v-row align="right">
                        <v-col cols="12" md="2" lg="12" class="d-flex justify-end align-center gap-4">
                            <v-btn variant="outlined" color="red accent-4" small class=" me-3 rounded-lg" style="color: white;">Cancel</v-btn>
                            <v-btn variant="outlined" color="grey lighten-1" small class=" rounded-lg">Onboard</v-btn>
                        </v-col>
                    </v-row>
                </v-card>
                <v-card class="mb-6 pa-6" elevation="2" rounded="lg">
                    <v-row>
                        <v-col cols="12" md="4" lg="7" right><div class="font-weight-bold text-subtitle-1" style="color: #4033a7;">
                                RB-1234-C
                            </div>
                        <div class="text-vody-2"><span>Malinga</span> <span>.</span><span>0789456545 </span><span>.</span><span>1Seat</span></div>
                        <div class="text-vody-2"><span>Coventry to Chester </span></div>
                        <div class="text-vody-2"><span>Booked on -  </span><span>24/05/2025</span><span>,</span><span>10.00PM</span></div>
                    </v-col>
                    <v-col align="right" cols="4" md="6" lg="5"><v-chip color="yellow lighten-1" text-color="black" small style="border-color: black;">
                            Awaiting
                        </v-chip></v-col>
                    </v-row>
                    <v-row >
                        <v-col align="right" cols="12" md="2" lg="12" class="d-flex justify-end align-center gap-4">
                            <v-btn variant="outlined" color="red accent-4" small class=" me-3 rounded-lg" style="color: white;">Cancel</v-btn>
                            <v-btn variant="outlined" color="#4033a7" small  class=" rounded-lg" style="color: white;">Confirm</v-btn>
                        </v-col>
                    </v-row>
                </v-card>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<style scoped>
.v-card-title{
  background-color: #f5f5f5;
}
</style>