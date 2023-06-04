// frontend/pages/user/Me.vue
<template>
  <div>
      <Navbar />
      <!-- Start video-sec Area -->
      <section id="about" class="video-sec-area pb-100 pt-40">
        <div class="max-w-md w-full mx-auto mt-8">
          <h1 class="text-3xl font-extrabold mb-4">Profile</h1>
          <form @submit.prevent="userLogin">
            <div class="mb-6">
              <label 
                for="email" class="
                block
                mb-2
                text-sm
                font-medium
                text-gray-900
                dark:text-gray-300
              ">Email</label>
              <input 
                type="email" class="
                mb-6
                border border-gray-300
                rounded-lg
                focus:ring-blue-500 focus:border-blue-500
                block
                w-full
                p-2.5
                cursor-not-allowed
                dark:border-gray-600
                dark:placeholder-gray-500
                dark:focus:ring-blue-500
                dark:focus:border-blue-500
              " :value="loggedInUser.email" disabled />
            </div>
            <div class="mb-6">
              <label 
                for="username" class="
                block
                mb-2
                text-sm
                font-medium
                text-gray-900
                dark:text-gray-300
              ">Username</label>
              <input 
                type="text" class="
                mb-6
                border border-gray-300
                text-sm
                rounded-lg
                focus:ring-blue-500 focus:border-blue-500
                block
                w-full
                p-2.5
                cursor-not-allowed
                dark:border-gray-600
                dark:placeholder-gray-500
                dark:focus:ring-blue-500
                dark:focus:border-blue-500
              " :value="loggedInUser.username" disabled />
            </div>
          </form>
        </div>
      </section>
      <!-- End video-sec Area -->
  </div>
</template>
<script>
  import { mapGetters } from 'vuex';

  export default {
    middleware: 'auth',
    computed: {
      ...mapGetters(['loggedInUser']),
    },
    created() {
      if (!this.loggedInUser) {
        this.$router.replace('/user/login');
      }
    },
  };
</script>
