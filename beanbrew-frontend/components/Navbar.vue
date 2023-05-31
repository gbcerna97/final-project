<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <NuxtLink class="navbar-brand" to="/">Bean & Brew</NuxtLink>
      <b-navbar-toggle target="navbarSupportedContent"></b-navbar-toggle>
      <b-collapse id="navbarSupportedContent" is-nav>
        <ul class="navbar-nav">
          <li class="nav-item">
            <NuxtLink to="/" class="nav-link">Home</NuxtLink>
          </li>
          <li class="nav-item">
            <NuxtLink v-if="isAuthenticated" to="/user/me" class="nav-link">Profile</NuxtLink>
          </li>
          <li class="nav-item">
            <a v-if="isAuthenticated" href="/logout" class="nav-link" @click.prevent="userLogout">Logout</a>
          </li>
          <li class="nav-item">
            <NuxtLink v-if="!isAuthenticated" to="/user/login" class="nav-link">Login</NuxtLink>
          </li>
          <li class="nav-item">
            <NuxtLink v-if="!isAuthenticated" to="/user/register" class="nav-link">Register</NuxtLink>
          </li>
        </ul>
      </b-collapse>
    </div>
  </nav>
</template>



<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['isAuthenticated']), // Map the 'isAuthenticated' getter from Vuex
  },
  methods: {
    async userLogout() {
      await this.$auth.logout(); // Call the logout method provided by the authentication plugin
      this.$router.push('user/login'); // Redirect to the login page after logout
    },
  },
};
</script>

<style>
/* Add your custom styles here */
</style>
