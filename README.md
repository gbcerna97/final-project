#### Node.js

##### Node.js
Since this utilizes both Next.js and Strapi, the first thing to do is install Node.js since both of these tools requires it.

To check the version of the Node.js installed, run the the command below:

```
node --version
```

Otherwise, you have to install Node.js. Visit here, [https://nodejs.org](https://nodejs.org) to download the latest version of Node.js.

#### Setting Up Projects

##### Strapi
The first thing to set up is the Strapi project that will serve ast the backend to cater user authentication.
To set up Strapi backend, we'll be using the ``create-strapi-app`` command, which automatically sets up the Strapi.

```
npx create-strapi-app strapi-auth --quickstart
```

With the ``--quikstart`` flag, the Strapi project will be installed using teh default settings. 

Once the installation is done, the newly created Strapi project will automatically launch in the browser. From there, we can create the admin user for the project by filling-in the necessary information.

> [!info] Note 
> Installation might take a while depending on the network connectivity.

The admin interface will be accessible through [http://localhost:1337/admin](http://localhost:1337/admin) once the project is launched by running the ``npm run develop`` command.

##### Nuxt.js
To set up Next.js environment, we will be using the ``create-next-app``, which automatically set up everything. 

```
npx create-next-app ecommerce-uptown-clothing
```

After installation, run ``npm run dev`` or ``yarn dev`` or ``pnpm dev`` to start the development server on ``http://localhost:3000``.

#### Set up Auth Module
```
npm install @nuxtjs/strapi
```

Add the following  to the ``modules`` in ``nuxt.config.js``:
```js
    // nuxt-auth/nuxt.config.js
    export default {
      // Modules: https://go.nuxtjs.dev/config-modules
	    modules: [
	        '@nuxtjs/strapi'
		],
	
	    strapi: {
		    url: process.env.STRAPI_URL || 'http://localhost:1337',
		    prefix: '/api',
		    version: 'v4',
		    cookie: {},
		    cookieName: 'strapi_jwt'
		},
```

The auth-module relies on Vuex, a state management pattern + library for Vue.js applications. You can activate the store by creating a new ``./store/index.js`` file

```js
    // nuxt-auth/store/index.js
    export const getters = {
      isAuthenticated(state) {
        return state.auth.loggedIn
      },
      loggedInUser(state) {
        return state.auth.user
      },
    }
```

#### Set up User Interface

We can proceed with building the user-interface of our app.

###### Create a Header component
Create a new `./components/Navbar.vue` file, and copy/paste the following code in it:

```html
<template>
	<v-app-bar>
	  <v-toolbar-title @click="$router.push('/')">
		Uptown Clothing Store
	  </v-toolbar-title>
	  <v-spacer></v-spacer>
	  <v-btn @click="$router.push('/Cart')" class="text-none" stacked>
		<v-badge :content="cartStore.productsTotal" color="error">
		  <v-icon>mdi-cart-outline</v-icon>
		</v-badge>
	  </v-btn>
	  
	<v-btn
      v-if="isAuthenticated"
      class="text-dark p-5"
      color="primary"
      to="/user/Login"
    >
      Login
    </v-btn>
    <v-btn
      v-if="isAuthenticated"
      class="text-dark p-5"
      color="primary"
      to="/user/Register"
    >
      Register
    </v-btn>
    <v-btn
      v-if="!isAuthenticated"
      class="text-dark p-5"
      color="primary"
      to="/user/Me"
    >
      Profile
    </v-btn>
    <v-btn
      v-if="!isAuthenticated"
      class="text-dark p-5"
      color="primary"
      href="/logout"
      @click.prevent="userLogout"
    >
      Logout
    </v-btn>
	</v-app-bar>
</template>
  
```

```js
<script setup>
  import {
    useCartStore
  } from "../stores/cart";
  import {
    mapGetters
  } from 'vuex';
  const cartStore = useCartStore();
  const {
    isAuthenticated
  } = mapGetters(['isAuthenticated']);
  const userLogout = async () => {
    await this.$auth.logout()
  };
</script>
<style lang="scss" scoped></style>
```

In the code above, we have created a header component using Vuetify.js. Apart from that, we've defined the computed property `isAuthenticated` and `userLogout` method used in the component's template.

Add your navbar component to all your pages by extending the main layout. Add a new `app.vue` file, and copy/paste the following code in it:

```html
<template>
  <v-app id="inspire" :theme="useCartStore().getTheme">
    <!-- Header -->
    <Header />
    <v-main>
      <v-container>
        <RouterView />
      </v-container>
    </v-main>
  </v-app>
</template>
<script setup>
  import {
    useCartStore
  } from './stores/cart';
</script>

```

After completing the header:

-   Run `npm run dev` to start the development server.
-   Visit `http://localhost:3000` to view your application.

###### Create a Login Page

Create a new `./pages/user/Login.vue` file, and copy/paste the following code in it:

```html
<template>
  <v-card class="mx-auto my-4" max-width="344">
    <v-col cols="12">
      <div class="max-w-md w-full mx-4">
        <div v-show="error !== ''" class="p-3 border">
          <p>{{ error }}</p>
        </div>
        <h1 class="text-3xl font-extrabold text-center">Login</h1>
        <h5 
          class="text-sm font-thin mb-4 text-center">
          Please enter email and password to login.
        </h5>
        <form 
          ref="loginForm"
		  @submit.prevent="userLogin" 
		  class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <v-row class="text-center mb-3">
            <v-text-field 
              v-model="identifier" 
              type="email" 
              label="Email">
            </v-text-field>
          </v-row>
          <v-row class="text-center mb-3">
            <v-text-field 
	          v-model="password" 
	          type="password" 
	          label="Password">
	        </v-text-field>
          </v-row>
          <v-col class="text-center" cols="12">
            <v-btn 
              :disabled="identifier === '' || password === ''" 
              color="primary" size="x-large">
              Login
            </v-btn>
          </v-col>
        </form>
      </div>
    </v-col>
  </v-card>
</template>
```

```js
<script>
  export default {
    data() {
      return {
        identifier: '',
        password: '',
        error: '',
      }
    },
    methods: {
      async loginUser(e) {
        e.preventDefault()
        try {
          const user = await this.$strapi.login({
            identifier: this.identifier,
            password: this.password,
          })
          console.log(user)
          if (user !== null) {
            this.error = ''
            this.$nuxt.$router.push('/Cart')
          }
        } catch (error) {
          this.error = 'Error in login credentials'
        }
      },
    },
    middleware: 'authenticated',
  }
</script>
<style></style>
```

We’ve just built our login logic; users provide a unique identifier (email) and password, then click on the login button, which calls the loginUser method. This method attempts to log the user in using the @nuxtjs/strapi module i.e this.$strapi.login() method and returns a user object if a user is found or an error if the credentials are invalid.

###### Create a Registration Page

Create a new `./pages/user/Register.vue` file, and copy/paste the following code in it:

```html
<template>
  <v-card class="mx-auto my-4" max-width="344">
    <v-col cols="12">
      <div class="max-w-md w-full mx-4">
        <div v-show="error !== ''" class="p-3 border">
          <p>{{ error }}</p>
        </div>
        <h1 class="text-3xl font-extrabold text-center">Register</h1>
        <h5 
          class="text-sm font-thin mb-4 text-center">
          Please fill out the form to create an account.
        </h5>
        <form @submit="createUser">
          <v-row class="text-center mb-3">
            <v-text-field v-model="username" label="Username"></v-text-field>
          </v-row>
          <v-row class="text-center mb-3">
            <v-text-field 
            v-model="email" 
            type="email" 
            label="Email"></v-text-field>
          </v-row>
          <v-row class="text-center mb-3">
            <v-text-field 
              v-model="password" 
              type="password" 
              label="Password"></v-text-field>
          </v-row>
          <v-col class="text-center" cols="12">
            <v-btn 
              :disabled="email === '' || password === '' || username === ''"  
              type="submit" color="primary" size="x-large">Register</v-btn>
          </v-col>
        </form>
      </div>
    </v-col>
  </v-card>
</template>
```

```js
<script>
  export default {
    data() {
      return {
        email: '',
        username: '',
        password: '',
        error: '',
      }
    },
    methods: {
      async createUser(e) {
        e.preventDefault();
        try {
          const response = await this.$strapi.register({
            email: this.email,
            username: this.username,
            password: this.password,
          });
          if (response.status === 'success') {
            this.error = '';
            this.$nuxt.$router.push('/user/Login');
          } else {
            this.error = response.message || 'An error occurred during registration.';
          }
        } catch (error) {
          this.error = error.message;
        }
      },
    },
    middleware: 'authenticated',
  }
</script>
<style></style>
```

###### Create a Profile Page

Create a new `./pages/user/Me.vue` file, and copy/paste the following code in it:

```html
// frontend/pages/user/Me.vue <template>
  <div class="max-w-md w-full mx-auto mt-8">
    <h1 class="text-3xl font-extrabold mb-4">Your profile</h1>
    <form @submit.prevent="userLogin">
      <div class="mb-6">
        <label for="email" class="
            block
            mb-2
            text-sm
            font-medium
            text-gray-900
            dark:text-gray-300
          ">Your email</label>
        <input type="email" class="
            mb-6
            bg-gray-100
            border border-gray-300
            text-gray-900 text-sm
            rounded-lg
            focus:ring-blue-500 focus:border-blue-500
            block
            w-full
            p-2.5
            cursor-not-allowed
            dark:bg-gray-700
            dark:border-gray-600
            dark:placeholder-gray-500
            dark:text-gray-500
            dark:focus:ring-blue-500
            dark:focus:border-blue-500
          " :value="loggedInUser.email" disabled />
      </div>
      <div class="mb-6">
        <label for="username" class="
            block
            mb-2
            text-sm
            font-medium
            text-gray-900
            dark:text-gray-300
          ">Your username</label>
        <input type="text" class="
            mb-6
            bg-gray-100
            border border-gray-300
            text-gray-900 text-sm
            rounded-lg
            focus:ring-blue-500 focus:border-blue-500
            block
            w-full
            p-2.5
            cursor-not-allowed
            dark:bg-gray-700
            dark:border-gray-600
            dark:placeholder-gray-500
            dark:text-gray-500
            dark:focus:ring-blue-500
            dark:focus:border-blue-500
          " :value="loggedInUser.username" disabled />
      </div>
    </form>
  </div>
</template>
```

```js
<script>
  import {
    mapGetters
  } from 'vuex'
  export default {
    middleware: 'auth',
    computed: {
      ...mapGetters(['loggedInUser']),
    },
  }
</script>
```

Now, the `ecommerce-uptown-clothing` is ready to cater authentication. To use, just run both projects and access `http://localhost:3000`.

