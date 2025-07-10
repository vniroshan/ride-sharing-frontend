<template>
  <v-container class="privacy-policy-container">
    <v-row>
      <v-col cols="12" md="10" lg="8" class="mx-auto">
       <div>Coming soon...</div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'PrivacyPolicy',
  
  data() {
    return {
      // lastUpdated is now hardcoded to match the provided date
    }
  },

  components: {
    
  },
}
</script>

<style scoped>
.privacy-policy-container {
  padding: 20px 0;
}

.privacy-content {
  font-size: 16px;
  line-height: 1.6;
}

.privacy-content h2 {
  color: #1976d2;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 8px;
  margin-bottom: 16px;
}

.privacy-content h3 {
  color: #424242;
  margin-bottom: 8px;
}

.privacy-content ul {
  padding-left: 20px;
}

.privacy-content li {
  margin-bottom: 8px;
}

.contact-info {
  background-color: #f5f5f5;
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid #1976d2;
}

@media (max-width: 600px) {
  .privacy-policy-container {
    padding: 10px 0;
  }
  
  .v-card {
    margin: 0 8px;
  }
}
</style>