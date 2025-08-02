<template>
  <v-container>
    <AError
      v-if="apiSendOtp.isError"
      :api="apiSendOtp"
      :callbackReset="() => (apiSendOtp.isError = false)"
    ></AError>
    <AError
      v-if="apiCheckOtp.isError"
      :api="apiCheckOtp"
      :callbackReset="() => (apiCheckOtp.isError = false)"
    ></AError>

    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" sm="6" md="4">
        <v-card class="pa-6" elevation="8">
          <div v-if="!otpSent">
            <div class="text-center mx-auto">
              <v-img
                class="mx-auto"
                contain
                :src="require('@/assets/lock.png')"
                transition="scale-transition"
                width="60"
              />
            </div>

            <div class="text-center pt-3">
              Are you a registered driver with our ride sharing app?
            </div>
            <v-card-text>
              <!-- Step 1: Mobile Number Input -->
              <div>
                <v-text-field
                  v-model="mobile_no"
                  label="Enter your mobile number"
                  :rules="mobileRules"
                  placeholder="Enter your mobile number"
                  outlined
                  dense
                  :disabled="apiSendOtp.isLoading"
                  @keyup.enter="sendOtp"
                ></v-text-field>

                <v-btn
                  @click="sendOtp"
                  :loading="apiSendOtp.isLoading"
                  :disabled="!mobile_no || mobile_no.length < 10"
                  color="primary"
                  block
                  large
                  width="80"
                >
                  Send OTP
                </v-btn>

                <div class="grey--text text-center pt-3">
                  Not registered yet?
                </div>
                <div class="text-center">
                  <v-btn
                    color="primary"
                    text
                    small
                    :to="{ name: 'DriverRegView' }"
                  >
                    Click to register now</v-btn
                  >
                </div>
              </div>
            </v-card-text>
          </div>
          <div v-if="otpSent">
            <div class="text-center mx-auto">
              <v-img
                class="mx-auto"
                contain
                :src="require('@/assets/otp.png')"
                transition="scale-transition"
                width="60"
              />
            </div>

            <div class="text-center pt-3">
              Enter OTP to verify your Mobile Number. We've sent a 6-digit OTP
              to {{ mobile_no }}.
            </div>
            <v-card-text>
              <div>
                <v-otp-input
                  v-model="otp"
                  :rules="otpRules"
                  outlined
                  dense
                  length="6"
                  :disabled="apiCheckOtp.isLoading"
                  @keyup.enter="checkOtp"
                ></v-otp-input>
                <v-btn
                  @click="checkOtp"
                  :loading="apiCheckOtp.isLoading"
                  :disabled="!otp || otp.length !== 6"
                  color="primary"
                  block
                  large
                  class="mt-4"
                >
                  Verify OTP
                </v-btn>

                <div class="text-center mt-4">
                  <v-btn
                    @click="resendOtp"
                    :disabled="resendTimer > 0 || apiSendOtp.isLoading"
                    text
                    small
                    color="primary"
                  >
                    {{
                      resendTimer > 0
                        ? `Resend OTP in ${resendTimer}s`
                        : "Resend OTP"
                    }}
                  </v-btn>
                </div>

                <div class="text-center mt-2">
                  <v-btn @click="changeNumber" text small color="secondary">
                    Change Mobile Number
                  </v-btn>
                </div>
              </div>
            </v-card-text>
          </div>

          <!-- Privacy Policy & Terms -->
          <v-card-actions class="px-6 pb-6">
            <div class="text-center w-100">
              <div class="caption grey--text">
                By continuing, you agree to our
              </div>
              <div class="d-flex justify-center flex-wrap mt-1">
                <a
                  href="#"
                  @click="navigateToPrivacyPolicy"
                  class="text-decoration-none caption"
                >
                  Privacy Policy
                </a>
                <span class="mx-1 caption grey--text">and</span>
                <a
                  href="#"
                  @click="navigateToTermsOfService"
                  class="text-decoration-none caption"
                >
                  Terms of Service
                </a>
              </div>
            </div>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-overlay :value="loading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
      <div class="mt-3">Signing in...</div>
    </v-overlay>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    loading: false,
    mobile_no: null,
    otp: null,
    otpSent: false,
    resendTimer: 0,
    resendInterval: null,

    // Validation rules
    mobileRules: [
      (v) => !!v || "Mobile number is required",
      (v) => /^\d{11}$/.test(v) || "Mobile number must be 11 digits",
    ],
    otpRules: [
      (v) => !!v || "OTP is required",
      (v) => /^\d{6}$/.test(v) || "OTP must be 6 digits",
    ],

    // API configurations
    apiSendOtp: {
      isLoading: false,
      isError: false,
      error: null,
      url: null,
    },
    apiCheckOtp: {
      isLoading: false,
      isError: false,
      error: null,
      url: null,
    },
  }),

  created() {},

  mounted() {},

  beforeDestroy() {
    if (this.resendInterval) {
      clearInterval(this.resendInterval);
    }
  },

  methods: {
    sendOtp() {
      if (!this.mobile_no || this.mobile_no.length < 11) {
        return;
      }

      this.apiSendOtp.url = `${this.$api.servers.backend}/api/v1/driver/auth/send-otp`;
      this.apiSendOtp.callbackReset = () => {
        this.apiSendOtp.isLoading = true;
        this.apiSendOtp.isError = false;
        this.apiSendOtp.error = null;
      };
      this.apiSendOtp.callbackError = (e) => {
        this.apiSendOtp.isLoading = false;
        this.apiSendOtp.isError = true;
        this.apiSendOtp.error = e;
      };
      this.apiSendOtp.callbackSuccess = (resp) => {
        this.apiSendOtp.isLoading = false;
        console.log(resp);
        this.otpSent = true;
        this.startResendTimer();
      };
      this.apiSendOtp.params = { mobile_no: this.mobile_no };
      this.$api.fetch(this.apiSendOtp);
    },

    checkOtp() {
      if (!this.otp || this.otp.length !== 6) {
        return;
      }

      this.apiCheckOtp.url = `${this.$api.servers.backend}/api/v1/driver/auth/check-otp`;
      this.apiCheckOtp.callbackReset = () => {
        this.apiCheckOtp.isLoading = true;
        this.apiCheckOtp.isError = false;
        this.apiCheckOtp.error = null;
      };
      this.apiCheckOtp.callbackError = (e) => {
        this.apiCheckOtp.isLoading = false;
        this.apiCheckOtp.isError = true;
        this.apiCheckOtp.error = e;
      };
      this.apiCheckOtp.callbackSuccess = (resp) => {
        this.apiCheckOtp.isLoading = false;
        console.log(resp);
        this.$store.commit("updateAccount", resp);
        this.$router.push({ name: "DriverDashboardView" });
      };
      this.apiCheckOtp.params = { mobile_no: this.mobile_no, otp: this.otp };
      this.$api.fetch(this.apiCheckOtp);
    },

    resendOtp() {
      this.otp = null;
      this.sendOtp();
    },

    changeNumber() {
      this.otpSent = false;
      this.otp = null;
      this.mobile_no = null;
      if (this.resendInterval) {
        clearInterval(this.resendInterval);
      }
    },

    startResendTimer() {
      this.resendTimer = 60;
      this.resendInterval = setInterval(() => {
        this.resendTimer--;
        if (this.resendTimer <= 0) {
          clearInterval(this.resendInterval);
        }
      }, 1000);
    },

    navigateToPrivacyPolicy(event) {
      event.preventDefault();
      this.$router.push({ name: "PrivacyPolicyView" });
    },

    navigateToTermsOfService(event) {
      event.preventDefault();
      this.$router.push({ name: "TermsOfServiceView" });
    },
  },
};
</script>

<style scoped>
.v-card {
  border-radius: 12px;
}
.v-btn {
  border-radius: 8px;
  text-transform: none;
}

.v-overlay .v-progress-circular {
  margin-bottom: 16px;
}

/* Privacy links styling */
.text-decoration-none {
  color: #1976d2 !important;
  transition: color 0.3s ease;
}

.text-decoration-none:hover {
  color: #1565c0 !important;
  text-decoration: underline !important;
}

.w-100 {
  width: 100%;
}
.fill-height {
  min-height: 80vh;
}
@media (max-width: 600px) {
  .v-card {
    margin: 16px;
  }

  .d-flex.flex-wrap {
    flex-direction: column;
    gap: 4px;
  }
}
</style>