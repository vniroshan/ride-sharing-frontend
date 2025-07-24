<template>
  <v-container>
    <div class="d-flex mt-15" style="height: 100%;">
      <div>
        <h1 class="display-3 font-weight-bold">Share your <span class="text-color">ride</span><br/>
        <span class="text-dark">with good deal!</span>
      </h1>
      <p class="body-1 mt-6 text-medium">
       Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
       incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
       exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure 
       dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.  
      </p>
      <v-btn
        class="mt-8"
        color="primary"
        size="large">
        Get start</v-btn>
      </div>
      <div class="mt-2">
        <v-img
         src="../assets/cloud1.png"
         max-width="600"
         class="max-auto">
        </v-img>
        <v-img
         src="../assets/cloud2.png"
         max-width="600"
         class="max-auto">
        </v-img>
      </div>
    </div>
  </v-container>
</template>

<script setup></script>
<style>
.text-color{
   text-decoration-color:(#727597);
  -webkit-text-fill-color: transparent;
}</style>
