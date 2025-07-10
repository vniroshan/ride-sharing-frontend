<template>
  <v-container fluid class="error-container">
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" sm="8" md="6" lg="5">
        <v-card class="error-card" elevation="2" outlined tile>
          <v-card-text class="text-center pa-8">
            <!-- Error Icon -->
            <!-- <v-avatar size="100" color="error" class="mb-6">
              <v-icon size="60" color="white">mdi-alert-circle-outline</v-icon>
            </v-avatar> -->

            <!-- Error Code -->
            <div class="error-code mb-4">404</div>

            <!-- Error Title -->
            <h1 class="error-title mb-4">Page Not Found</h1>

            <!-- Error Description -->
            <p class="error-description mb-6">
              Sorry, the page you are looking for doesn't exist or has been
              moved. Please check the URL or navigate back to the main
              application.
            </p>

            <!-- Action Buttons -->
            <div class="mb-8">
              <v-btn
                color="primary"
                size="large"
                rounded
                class="mr-4 mb-2"
                @click="goHome"
              >
                Go Home
              </v-btn>

              <v-btn
                color="primary"
                size="large"
                rounded
                outlined
                class="mb-2"
                @click="goBack"
              >
                Go Back
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Background Pattern (Optional) -->
    <div class="background-pattern"></div>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "ErrorNotFoundView",
  data() {
    return {};
  },
  computed: mapState({
    account: (state) => state.account.data,
  }),
  methods: {
    goHome() {
      if (this.account) {
        this.$router.push({ name: "DriverDashboardView" });
      } else {
        this.$router.push({ name: "LoginView" });
      }
    },
    goBack() {
      if (window.history.length > 1) {
        this.$router.go(-1);
      } else {
        if (this.account) {
          this.$router.push({ name: "DriverDashboardView" });
        } else {
          this.$router.push({ name: "LoginView" });
        }
      }
    },
  },
  mounted() {},
};
</script>

<style scoped>
.error-container {
  min-height: 80vh;
  position: relative;
  overflow: hidden;
}

.fill-height {
  min-height: 80vh;
}

.error-card {
  position: relative;
  z-index: 2;
  border-radius: 16px !important;
  backdrop-filter: blur(10px);
}

.error-code {
  font-size: 6rem;
  font-weight: 600;
  line-height: 1;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);
  font-family: "Roboto", sans-serif;
}

.error-title {
  font-size: 2.5rem;
  font-weight: 600;
  color: #0074e7;
  margin: 0;
}

.error-description {
  font-size: 1.125rem;
  color: #666;
  line-height: 1.6;
  max-width: 400px;
  margin: 0 auto;
}

.helpful-links {
  text-align: left;
  max-width: 300px;
  margin: 0 auto;
}

.helpful-links h3 {
  text-align: center;
  color: #1976d2;
}

.background-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.1;
  background-image: radial-gradient(
      circle at 25% 25%,
      white 2px,
      transparent 2px
    ),
    radial-gradient(circle at 75% 75%, white 2px, transparent 2px);
  background-size: 50px 50px;
  background-position: 0 0, 25px 25px;
  z-index: 1;
}

/* Mobile Responsiveness */
@media (max-width: 600px) {
  .error-code {
    font-size: 5rem;
  }

  .error-title {
    font-size: 2rem;
  }

  .error-description {
    font-size: 1rem;
  }

  .v-btn {
    width: 100%;
    margin: 0.25rem 0 !important;
  }
}

/* Animation for the error icon */
/* .v-avatar {
  animation: pulse 2s infinite;
} */

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

/* Hover effects for list items */
.v-list-item {
  border-radius: 8px;
  margin: 4px 0;
  transition: all 0.3s ease;
}

.v-list-item:hover {
  background-color: rgba(25, 118, 210, 0.08) !important;
  transform: translateX(8px);
}
</style>
