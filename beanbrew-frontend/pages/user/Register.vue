<template>
  <div>
    <div class="max-w-md w-full mx-auto mt-8">
      <h1 class="text-3xl font-extrabold mb-4">Register</h1>
      <form @submit.prevent="userRegister">
        <div v-if="err" class="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">
          {{ err }}
        </div>
        <div v-if="success" class="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800" role="alert"> Your account has been created successfully! <router-link to="user/login" class="font-medium"></router-link>
        </div>
        <div class="mb-6">
          <label for="username" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Username</label>
          <input v-model="username" type="text" class="shadow-sm border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="Enter username..." required />
        </div>
        <div class="mb-6">
          <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Email</label>
          <input v-model="email" type="email" class="shadow-sm border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="Enter email..." required />
        </div>
        <div class="mb-6">
          <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Password</label>
          <input v-model="password" type="password" class="shadow-sm border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="Enter password" required />
        </div>
        <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"> Submit </button>
      </form>
      <small class="text-center mt-4">Have an account? Login <NuxtLink class="text-dark link-opacity-100-hover" to="/user/login">here.</NuxtLink></small>
    </div>
  </div>
</template>
<script>
  export default {
    auth: 'guest', // Set authentication level to 'guest' for this component
    data() {
      return {
        success: false, // Initialize success flag as false
        err: null, // Initialize the error message as null
        username: '', // Initialize username input field as an empty string
        email: '', // Initialize email input field as an empty string
        password: '', // Initialize password input field as an empty string
      }
    },
    methods: {
      async userRegister() { // Define a method for user registration
        try {
          this.$axios.setToken(false) // Set the token to false to clear any existing token
          await this.$axios.post('http://localhost:1337/api/auth/local/register', {
            username: this.username, // Get the entered username
            email: this.email, // Get the entered email
            password: this.password, // Get the entered password
          })
          this.success = true // Set the success flag to true
          // Display success message and redirect to login page after 3 seconds
          setTimeout(() => {
            window.location.href = 'http://localhost:3000/user/login';
          }, 3000);
          this.$toast.success('Your account has been created successfully!', {
            duration: 5000,
          })
          // Redirect to login page using Vue Router
          this.$router.push('http://localhost:3000/user/login')
        } catch (e) {
          if (e.response && e.response.data && e.response.data.error) {
            this.err = e.response.data.error.message // Set the error message if there is a response error
          }
        }
      },
    },
  }
</script>

<style>
  * {
    box-sizing: border-box;
  }

  /* Style the body */
  body {
    font-family: Arial, Helvetica, sans-serif;
    margin: 0;
  }

  /* Header/logo Title */
  .header {
    padding: 80px;
    text-align: center;
    background: #1abc9c;
    color: white;
  }

  /* Increase the font size of the heading */
  .header h1 {
    font-size: 40px;
  }

  /* Style the top navigation bar */
  .navbar {
    overflow: hidden;
    background-color: #333;
  }

  /* Style the navigation bar links */
  .navbar a {
    float: left;
    display: block;
    color: white;
    text-align: center;
    padding: 14px 20px;
    text-decoration: none;
  }

  /* Right-aligned link */
  .navbar a.right {
    float: right;
  }

  /* Change color on hover */
  .navbar a:hover {
    background-color: #ddd;
    color: black;
  }

  /* Column container */
  .row {
    display: -ms-flexbox;
    /* IE10 */
    display: flex;
    -ms-flex-wrap: wrap;
    /* IE10 */
    flex-wrap: wrap;
  }

  /* Create two unequal columns that sits next to each other */
  /* Sidebar/left column */
  .side {
    -ms-flex: 30%;
    /* IE10 */
    flex: 30%;
    background-color: #f1f1f1;
    padding: 20px;
  }

  /* Main column */
  .main {
    -ms-flex: 70%;
    /* IE10 */
    flex: 70%;
    background-color: white;
    padding: 20px;
  }

  /* Fake image, just for this example */
  .fakeimg {
    background-color: #aaa;
    width: 100%;
    padding: 20px;
  }

  /* Footer */
  .footer {
    padding: 20px;
    text-align: center;
    background: #ddd;
  }

  /* Responsive layout - when the screen is less than 700px wide, make the two columns stack on top of each other instead of next to each other */
  @media screen and (max-width: 700px) {
    .row {
      flex-direction: column;
    }
  }

  /* Responsive layout - when the screen is less than 400px wide, make the navigation links stack on top of each other instead of next to each other */
  @media screen and (max-width: 400px) {
    .navbar a {
      float: none;
      width: 100%;
    }
  }
</style>