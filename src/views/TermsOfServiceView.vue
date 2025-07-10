<template>
  <v-container class="terms-container">
    <v-row>
     <div>Coming soon...</div>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'TermsOfService',
  
  data() {
    return {
      lastUpdated: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
  },

  components: {
    
  },
}
</script>

<style scoped>
.terms-container {
  padding: 20px 0;
}

.terms-content {
  font-size: 16px;
  line-height: 1.6;
}

.terms-content h2 {
  color: #1976d2;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 8px;
  margin-bottom: 16px;
}

.terms-content h3 {
  color: #424242;
  margin-bottom: 8px;
}

.terms-content ul {
  padding-left: 20px;
}

.terms-content li {
  margin-bottom: 8px;
}

.contact-info {
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #1976d2;
}

.v-alert {
  border-radius: 8px;
}

@media (max-width: 600px) {
  .terms-container {
    padding: 10px 0;
  }
  
  .v-card {
    margin: 0 8px;
  }

  .contact-info {
    padding: 16px;
  }
}
</style>