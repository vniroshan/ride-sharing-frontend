<template>
    <v-container class="py-10">
        <h2 class="text-h5 font-weight-bold text-center text-indigo">
                 Booking submitted successfully
                </h2>
                     <br/>
                     <br/>
        <v-card elevation="2" class="pa-6 mx-auto" max-width="700" rounded="lg">
            <v-row justify="center">
                <p class="text-center mb-6">Your booking has been successfully sent to the driver confirmation</p>
            </v-row>
            <v-row justify="center" class="mb-6">
                <v-icon color="green" size="64">mdi-checkbox-marked-circle-outline</v-icon>
            </v-row>
            <v-row>
                <v-col cols-3></v-col>
            <v-col cols="3">
              <p style="color: #BDBDBE;">Reference No:</p>
                <strong>RB-7065-C</strong>
                <p class="mt-4" style="color: #BDBDBE;">Driver Name:</p>
                <strong>Thanex</strong>
                <p class="mt-4" style="color: #BDBDBE;">Vehicle No:</p>
                <strong>NC60GYT</strong>
            </v-col>
            <v-col cols="3">
                <p style="color: #BDBDBE;">Seat booked:</p>
                <strong>1 Seat</strong>
                <p class="mt-4" style="color: #BDBDBE;">Driver Mobile No:</p>
                <strong>+44 0123456789</strong>
                <p class="mt-4" style="color: #BDBDBE;">Total Amount:</p>
                <strong>£7.00</strong>
            </v-col>
            <v-col cols="3"></v-col>
         </v-row>
       <v-row justify="center" class="mt-6">
        <p class="text-body-2 text-center">
            once the Driver approves your booking, you will be receive the details via SMS at
            <strong>0123456789</strong> and Email <strong>Sample12@gmail.com</strong>
        </p>
       </v-row>
       <v-row justify="center" class="mt-6">
        <p class="text-body-2 text-center" style="color: #BDBDBE;">
            <strong>Note:</strong> The driver has the option to confirm or Cancel the booking, <br/>you will be notified of the outcome.
                                   if you need to cancel your booking,<br/> please contact the driver directly using the provided contact details.
        </p>
       </v-row>  
   </v-card>
 </v-container>
</template>