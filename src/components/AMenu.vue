<template>
  <div class="d-print-none">
    <v-list nav>
      <v-list-item :to="{ name: 'DashboardView' }">
        <v-list-item-icon>
          <v-avatar size="40">
            <v-img :src="account.profile_image_url" :alt="account.name"></v-img>
          </v-avatar>
        </v-list-item-icon>
        <v-list-item-title>{{ account.name }}</v-list-item-title>
      </v-list-item>
    </v-list>
    <v-divider></v-divider>
    <v-list nav dense>
      <template v-for="(item, index) in menu">
        <v-list-item
          v-if="
            account.permissions.includes(item.permission) ||
            item.permission == 0
          "
          link
          :to="item.route"
          :key="index"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ item.name }}</v-list-item-title>
        </v-list-item>
        <v-divider
          :key="index + '-divider'"
          v-if="item.divider"
          class="py-1"
        ></v-divider>
      </template>
    </v-list>

    <!-- Google Services Reconnection Modal -->
    <v-dialog v-model="showReconnectModal" persistent max-width="500px">
      <v-card>
        <v-card-title class="headline">
          <v-icon left color="warning">mdi-google</v-icon>
          Google Services Connection Required
        </v-card-title>
        <v-card-text>
          <div v-if="!hasGoogleServices">
            <p>
              Connect your Google services to access enhanced features
              including:
            </p>
            <ul class="mb-4">
              <li>Google Calendar integration</li>
              <li>Gmail access for notifications</li>
              <li>Enhanced scheduling capabilities</li>
            </ul>
            <p>
              Please click the button below to connect your Google services.
            </p>
          </div>
          <div v-else>
            <p>
              Your Google services connection has expired and needs to be
              reconnected to continue using the application.
            </p>
            <p>
              Please click the button below to reconnect your Google services.
            </p>
          </div>
        </v-card-text>
        <v-card-actions>
          <!-- <v-btn
            v-if="!hasGoogleServices"
            text
            @click="skipGoogleServices"
            :disabled="reconnecting"
          >
            Skip for now
          </v-btn> -->
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            :loading="reconnecting"
            @click="connectGoogleServices"
          >
            <v-icon left>mdi-google</v-icon>
            {{ hasGoogleServices ? "Reconnect" : "Connect" }} Google Services
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Loading Overlay -->
    <v-overlay :value="reconnecting">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
      <div class="mt-3">
        {{
          hasGoogleServices
            ? "Reconnecting..."
            : "Connecting Google services..."
        }}
      </div>
    </v-overlay>
  </div>
</template>
  
<script>
import { mapState } from "vuex";

export default {
  computed: mapState({
    account: (state) => state.account.data,
  }),
  data: () => ({
    menu: [],
    type: null,
    showReconnectModal: false,
    reconnecting: false,
    checkInterval: null,
    hasGoogleServices: false,
    authCode: null,

    // Google Configuration
    googleConfig: {
      clientId: process.env.VUE_APP_GOOGLE_CLIENT_ID,
      backendRedirectUri: `${process.env.VUE_APP_URL_API_BACKEND}/api/v1/auth/google-services-callback`,
      scopes: [
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/gmail.readonly",
        "https://www.googleapis.com/auth/gmail.send",
        "https://www.googleapis.com/auth/gmail.compose",
        "https://www.googleapis.com/auth/gmail.modify",
      ],
    },

    // API configurations
    servicesApi: {
      isLoading: false,
      isError: false,
      error: null,
      url: null,
    },
  }),
  mounted() {
    this.showReconnectModal = false;
  },
  created() {
    this.type = this.account.role;
    this.menu.unshift({
      name: "Dashboard",
      icon: "mdi-view-dashboard",
      route: { name: "DashboardView" },
      permission: 0,
    });
    this.menu.push({
      name: "Create Ride",
      icon: "mdi-car-plus",
      route: { name: "RideCreationView" },
      permission: 0,
    });
    this.menu.push({
      name: "Log Out",
      icon: "mdi-exit-run",
      route: { name: "LogoutView" },
      permission: 0,
    });

    this.setupApiConfigs();
    // this.checkGoogleServicesStatus();
    this.handleOAuthCallback();

    // Start checking for reconnection status
    if (!this.$route.query.auth) {
      this.checkReconnectionStatus();
    }
    // Set up periodic check every 5 minutes
    // this.checkInterval = setInterval(this.checkReconnectionStatus, 5 * 60 * 1000);
  },

  beforeDestroy() {
    // Clear interval when component is destroyed
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
  },

  methods: {
    setupApiConfigs() {
      // Google Services API configuration
      this.servicesApi.url = `${this.$api.servers.backend}/api/v1/auth/google-services-callback`;
      this.servicesApi.callbackReset = () => {
        this.servicesApi.isLoading = true;
        this.servicesApi.isError = false;
        this.servicesApi.error = null;
      };
      this.servicesApi.callbackError = (e) => {
        this.servicesApi.isLoading = false;
        this.servicesApi.isError = true;
        this.servicesApi.error = e;
        this.reconnecting = false;
      };
      this.servicesApi.callbackSuccess = (resp) => {
        console.log("Google services connected:", resp);
        this.servicesApi.isLoading = false;
        this.reconnecting = false;
        this.hasGoogleServices = true;
        this.showReconnectModal = false;

        // Update user data with Google services status
        this.$store.commit("updateAccount", {
          ...this.$store.state.account.data,
          google_services_connected: true,
        });
      };
    },

    // checkGoogleServicesStatus() {
    //   this.hasGoogleServices = this.account?.google_services_connected || false;

    //   // Show modal if Google services are not connected
    //   if (!this.hasGoogleServices) {
    //     setTimeout(() => {
    //       this.showReconnectModal = true;
    //     }, 2000); // Show after 2 seconds to let user settle in
    //   }
    // },

    // Handle OAuth callback if returning from Google authorization
    handleOAuthCallback() {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      const state = urlParams.get("state");
      const error = urlParams.get("error");

      if (error) {
        console.error("OAuth callback error:", error);
        this.$toast?.error("Google authorization failed");
        this.reconnecting = false;
        // Clean up URL
        this.$router.replace({ query: {} });
        return;
      }

      if (code && state === "google_services") {
        console.log("Handling Google services OAuth callback");
        this.reconnecting = true;
        this.showReconnectModal = false;
        this.exchangeGoogleCodeForTokens(code);
        // Clean up URL
        this.$router.replace({ query: { auth: 1 } });
      }
    },

    async checkReconnectionStatus() {
      try {
        await this.$api.fetch({
          url: this.$api.servers.backend + "/api/v1/auth/google-status",
          method: "get",
          callbackSuccess: (data) => {
            if (data.connected === false) {
              this.hasGoogleServices = false;
              this.showReconnectModal = true;
            }
          },
          callbackError: (error) => {
            console.error("Error checking Google services status:", error);
          },
          callbackReset: () => {},
        });
      } catch (error) {
        console.error("Error checking reconnection status:", error);
      }
    },

    connectGoogleServices() {
      this.reconnecting = true;

      // Build the OAuth 2.0 authorization URL for proper refresh token support
      const authUrl = this.buildGoogleAuthUrl();

      // Redirect to Google OAuth authorization page
      window.location.href = authUrl;
    },

    buildGoogleAuthUrl() {
      const params = new URLSearchParams({
        client_id: this.googleConfig.clientId,
        redirect_uri: this.googleConfig.backendRedirectUri,
        response_type: "code",
        scope: this.googleConfig.scopes.join(" "),
        access_type: "offline", // Critical for refresh token
        prompt: "consent", // Force consent screen to ensure refresh token
        state: "google_services", // Custom state to identify this flow
        include_granted_scopes: "true",
      });

      return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    },

    // Send authorization code to backend for token exchange
    async exchangeGoogleCodeForTokens(authCode) {
      try {
        this.servicesApi.params = {
          code: authCode,
          user_id: this.account?.id,
          grant_type: "authorization_code",
        };

        this.$api.fetch(this.servicesApi);
      } catch (error) {
        console.error("Error exchanging code for tokens:", error);
        this.reconnecting = false;
        this.$toast?.error("Failed to connect Google services");
      }
    },

    skipGoogleServices() {
      this.showReconnectModal = false;
      this.$toast?.info("You can connect Google services later from the menu");
    },

    // Legacy method name for backward compatibility
    async linkGoogleServices() {
      this.connectGoogleServices();
    },
  },

  watch: {
    account: {
      handler(newAccount) {
        if (newAccount) {
          this.hasGoogleServices =
            newAccount.google_services_connected || false;
        }
      },
      immediate: true,
    },
  },
};
</script>

<style scoped>
.v-overlay .v-progress-circular {
  margin-bottom: 16px;
}

.headline {
  word-break: break-word;
}

ul {
  padding-left: 20px;
}

ul li {
  margin-bottom: 4px;
}
</style>
