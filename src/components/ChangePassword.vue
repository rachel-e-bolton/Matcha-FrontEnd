<template>
  <div
    class="h-100 d-flex flex-column justify-content-center align-items-center my-5"
  >
    <form @submit.prevent="resetPassword">
      <div v-if="code">
        <img src="@/assets/logo-plum-and-orange.png" />
        <b-input-group>
          <b-form-input
            v-model="new_password"
            type="password"
            placeholder="New password here..."
            required
          ></b-form-input>

          <b-input-group-append>
            <b-button variant="outline-secondary" type="submit"
              >Change Password</b-button
            >
          </b-input-group-append>
        </b-input-group>
      </div>
      <div v-else>
        <b-form-input
          class="mb-2"
          v-model="old_password"
          type="password"
          placeholder="Old password here..."
          required
        ></b-form-input>
        <b-form-input
          class="mb-2"
          v-model="new_password"
          type="password"
          placeholder="New password here..."
          required
        ></b-form-input>
        <b-button variant="outline-secondary" type="submit"
          >Change Password</b-button
        >
      </div>
    </form>
  </div>
</template>

<script>

import {state} from "@/store"

export default {
  data: function() {
    return {
      code: null,
      new_password: null,
      old_password: null,
    };
  },
  methods: {
    resetPassword: function() {
      if (this.code) {
        this.resetPasswordwithCode();
      } else {
        this.resetPasswordwithPassword();
      }
    },
    resetPasswordwithCode: function() {
      this.$http
        .put(`${this.$api}/reset-password`, {
          code: this.code,
          new_password: this.new_password,
        })
        .then((res) => {
          this.$bvToast.toast("Password successfully reset", {
            title: "Success!",
            autoHideDelay: 5000,
            toaster: "b-toaster-top-center",
            variant: "info",
            noCloseButton: false,
          });

          setTimeout(() => {
            this.$router.push("/login");
          }, 3000);
        })
        .catch((err) => {
          this.$bvToast.toast(
            "Unable to reset password. Error: " + err.response.data.message,
            {
              title: "Error!",
              autoHideDelay: 5000,
              toaster: "b-toaster-top-center",
              variant: "warning",
              noCloseButton: false,
            }
          );

          setTimeout(() => {
            this.$router.push("/");
          }, 3000);
        });
    },
    resetPasswordwithPassword: function() {
      this.$http
        .put(`${this.$api}/reset-password`, {
          previous_password: this.old_password,
          new_password: this.new_password,
          user_id: state.user.id,
        })
        .then((res) => {
          this.new_password = null;
          this.old_password = null;
          this.$bvToast.toast("Password successfully changed.", {
            title: "Success!",
            autoHideDelay: 5000,
            toaster: "b-toaster-top-center",
            variant: "success",
            noCloseButton: false,
          });
        })
        .catch((err) => {
          this.$bvToast.toast(
            "Unable to reset password. Error: " + err.response.data.message,
            {
              title: "Error!",
              autoHideDelay: 5000,
              toaster: "b-toaster-top-center",
              variant: "warning",
              noCloseButton: false,
            }
          );
        });
    },
  },
  mounted: function() {
    this.code = this.$route.query.code;
    if (!this.code && !state.user.id) {
      alert("Not logged in and no code, redirect to login?");
    }
  },
};
</script>

<style></style>
