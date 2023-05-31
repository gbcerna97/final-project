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
npx create-next-app beanbrew-frontend
```

After installation, run ``npm run dev`` or ``yarn dev`` or ``pnpm dev`` to start the development server on ``http://localhost:3000``.

#### Set up Auth Module and Axios
```
npm install axios @nuxtjs/auth-next
```

Add the following  to the ``modules`` in ``nuxt.config.js``:
```js
    // beanbrew-frontend/nuxt.config.js
    export default {
      axios: {
	    // Base URL of the API
	    baseURL: 'http://localhost:1337',
	    // Headers to send with every request
	    headers: {
	      common: {
	        'Accept': 'application/json',
	        'Content-Type': 'application/json'
	      }
	    }
	  },
	
	  auth: {
	    // Options
	    strategies: {
	      local: {
	        token: {
	          property: 'jwt',
	        },
	        user: {
	          property: false,
	        },
	        endpoints: {
	          login: {
	            url: 'http://localhost:1337/api/auth/local',
	            method: 'post',
	          },
	          user: {
	            url: 'http://localhost:1337/api/users/me',
	            method: 'get',
	          },
	          logout: false,
	        },
	      },
	    },
	},
	modules: [
	    '@nuxtjs/axios',
	    '@nuxtjs/auth-next'
	  ],
```

The auth-module relies on Vuex, a state management pattern + library for Vue.js applications. You can activate the store by creating a new ``./store/index.js`` file

```js
    // beanbrew-frontend/store/index.js
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
  
```

```js
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
```

In the code above, we have created a header component using Bootstrap. Apart from that, we've defined the computed property `isAuthenticated` and `userLogout` method used in the component's template.

Add your navbar component to all your pages by extending the main layout. 

After completing the header:

-   Run `npm run dev` to start the development server.
-   Visit `http://localhost:3000` to view your application.

###### Create a Login Page

Create a new `./pages/user/Login.vue` file, and copy/paste the following code in it:

```html
<template>
  <div class="card p-4 mt-8">
    <div class="max-w-md w-full mx-auto mt-8 p-4">
      <h1 class="text-3xl font-extrabold mb-4">Login</h1>
      <form @submit.prevent="userLogin">
        <div 
          v-if="err" class="
          p-4
          mb-4
          text-sm text-red-700
          bg-red-100
          rounded-lg
          dark:bg-red-200 dark:text-red-800
        " role="alert">
          {{ err }}
        </div>
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
            v-model="email" type="email" class="
            shadow-sm
            border border-gray-300
            text-sm
            rounded-lg
            focus:ring-blue-500 focus:border-blue-500
            block
            w-full
            p-2.5
            dark:border-gray-600
            dark:placeholder-gray-400
            dark:focus:ring-blue-500
            dark:focus:border-blue-500
            dark:shadow-sm-light
          " placeholder="Enter email..." required />
        </div>
        <div class="mb-6">
          <label
            for="password" class="
            block
            mb-2
            text-sm
            font-medium
            text-gray-900
            dark:text-gray-300
          ">Password</label>
          <input 
            v-model="password" type="password" class="
            shadow-sm
            border border-gray-300
            text-sm
            rounded-lg
            focus:ring-blue-500 focus:border-blue-500
            block
            w-full
            p-2.5
            dark:border-gray-600
            dark:placeholder-gray-400
            dark:focus:ring-blue-500
            dark:focus:border-blue-500
            dark:shadow-sm-light
          " placeholder="Enter password..." required />
        </div>
        <button 
          type="submit" class="
          text-white
          bg-blue-700
          hover:bg-blue-800
          focus:ring-4 focus:outline-none focus:ring-blue-300
          font-medium
          rounded-lg
          text-sm
          px-5
          py-2.5
          text-center
          dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800
        "> Sign in </button>
      </form>

      <small class="text-center">No account yet? Register <NuxtLink class="text-dark link-opacity-100-hover mt-4" to="/user/register">here.</NuxtLink></small>
    </div>
  </div>
</template>
```

```js
<script>
  export default {
    auth: 'guest',
    data() {
      return {
        err: null,
        email: '',
        password: '',
      }
    },
    methods: {
      async userLogin() {
        try {
          await this.$auth.loginWith('local', {
            data: {
              identifier: this.email,
              password: this.password
            },
          })
        } catch (e) {
          if (e.response) this.err = e.response.data.error.message
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
```

We’ve just built our login logic; users provide a unique identifier (email) and password, then click on the login button, which calls the loginUser method. This method attempts to log the user in using the @nuxtjs/strapi module i.e this.$strapi.login() method and returns a user object if a user is found or an error if the credentials are invalid.

###### Create a Registration Page

Create a new `./pages/user/Register.vue` file, and copy/paste the following code in it:

```html
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
```

```js
<script>
  export default {
    auth: 'guest',
    data() {
      return {
        success: false,
        err: null,
        username: '',
        email: '',
        password: '',
      }
    },
    methods: {
      async userRegister() {
        try {
          this.$axios.setToken(false)
          await this.$axios.post('http://localhost:1337/api/auth/local/register', {
            username: this.username,
            email: this.email,
            password: this.password,
          })
          this.success = true
          // Display success message
          setTimeout(() => {
            window.location.href = 'http://localhost:3000/user/login';
          }, 3000);
          this.$toast.success('Your account has been created successfully!', {
            duration: 5000,
          })
          // Redirect to login page
          this.$router.push('http://localhost:3000/user/login')
        } catch (e) {
          if (e.response && e.response.data && e.response.data.error) {
            this.err = e.response.data.error.message
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
```

###### Create a Profile Page

Create a new `./pages/user/Me.vue` file, and copy/paste the following code in it:

```html
// beanbrew-frontend/pages/user/Me.vue
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

#### Integrating API

Now, we will be integrating API from [API Ninjas ](https://api-ninjas.com/api).

You'll have to create an account. Once account is set, go to My Account page, and copy your API Key so you can use it later in your Nuxt app.

![[Pasted image 20230531204030.png]]

You can also manage your usage here like the API Calls made, the Usage HIstory and many more.

##### Setting up API Components

In your Nuxt app, create a new components and `ApiComponent.vue`. But before anything else, create a `.env` file so we can store our API Key securely.

```js
NUXT_ENV_YOUR_API_KEY=YOUR_API_KEY
```

This way, we can call our API KEY anywhere in our app without actually calling it explicitly.

Inside the `ApiComponent`, copy the following code:

```html
<template>
  <!-- Start menu Area -->
  <section id="coffee" class="menu-area section-gap">
    <div class="container">
      <div class="row d-flex justify-content-center">
        <div class="menu-content pb-60 col-lg-10">
          <div class="title text-center">
            <h1 class="mb-10">Bored? Try these pastimes!</h1>
            <p>Just click on any of the buttons to try.</p>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-lg-4">
          <div class="single-menu" style="min-height: 100px;">
            <div class="title-div justify-content-center d-flex">
              <button class="btn btn-primary" @click="generateQuote">Generate Quote</button>
            </div>
            <p class="text-center">Generate random quotes.</p><br>
            <p class="text-italic">"{{ quote }}"</p>
            <p class="text-right">- {{ author }}</p>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="single-menu" style="min-height: 100px;">
            <div class="title-div justify-content-center d-flex">
              <button class="btn btn-primary" @click="generateFact">Facts</button>
            </div>
            <p class="text-center">Click button to get some interesting facts.</p><br>
            <p class="text-italic font-weight-bold">{{ fact.fact }}</p>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="single-menu" style="min-height: 100px;">
            <div class="title-div justify-content-center d-flex">
              <button class="btn btn-primary" @click="generateJoke">Generate Joke</button>
            </div>
            <p class="text-center">Generate random jokes.</p><br>
            <p class="text-italic font-weight-bold">{{ joke.joke }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- End menu Area -->
</template>
```

```js
<script>
import axios from 'axios';

export default {
  data() {
    return {
      quote: '',
      author: '',
      fact: '',
      joke: '',
      apiKey: process.env.NUXT_ENV_YOUR_API_KEY
    };
  },
  created() {
    this.generateQuote()
    this.generateFact(); // Load initial fact data
    this.generateJoke(); // Load initial joke data
  },
  methods: {
    /**
     * Fetches a random quote from the API and updates the quote and author data properties.
     */
    generateQuote() {
      const category = ''; // Specify the desired category for quotes

      const url = `https://api.api-ninjas.com/v1/quotes?category=${category}`;

      axios
        .get(url, {
          headers: {
            'X-Api-Key': this.apiKey
          }
        })
        .then(response => {
          const { quote, author } = response.data[0];
          this.quote = quote;
          this.author = author;
        })
        .catch(error => {
          console.error('Error:', error);
        });
    },
    /**
     * Fetches a random fact from the API and updates the fact data property.
     */
    generateFact() {
      const limit = 3;

      axios
        .get(`https://api.api-ninjas.com/v1/facts?limit=${limit}`, {
          headers: {
            'X-Api-Key': this.apiKey
          }
        })
        .then(response => {
          const facts = response.data;
          const randomIndex = Math.floor(Math.random() * facts.length);
          this.fact = facts[randomIndex];
        })
        .catch(error => {
          console.error('Error:', error);
        });
    },
    /**
     * Fetches a random joke from the API and updates the joke data property.
     */
    generateJoke() {
      const limit = 3;

      axios
        .get(`https://api.api-ninjas.com/v1/jokes?limit=${limit}`, {
          headers: {
            'X-Api-Key': this.apiKey
          }
        })
        .then(response => {
          const jokes = response.data;
          const randomIndex = Math.floor(Math.random() * jokes.length);
          this.joke = jokes[randomIndex];
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  },
};
</script>

```

Here, we call our API Key from our `.env `file and use it to fetch data from our API endpoint. Notice that we have also define three methods `getQuote`, `getFact` and `getJoke`. These methods are used to get data from the API endpoint using the same API Key.

In our `index.vue` we call our `ApiComponent` along with othe components:

```html
<template>
  <div>
      <Navbar />
      <!-- Start video-sec Area -->
      <section id="about" class="video-sec-area pb-100 pt-40">
        <div class="container">
          <div class="row justify-content-start align-items-center">
            <div class="col-lg-6 video-right justify-content-center align-items-center d-flex">
              <div class="overlay overlay-bg"></div>
              <a class="play-btn" href="https://www.youtube.com/watch?v=ARA0AxrnHdM"><img class="img-fluid" src="~/assets/img/play-icon.png" alt=""></a>
            </div>
            <div class="col-lg-6 video-left">
              <h6>Freshly brewed Coffee.</h6>
              <h1>We Only Serve <br>
                Freshly Brewed Coffee</h1>
              <p><span>Coffee that you love, brewed right in front of you.</span></p>
              <p>
                  Discover the perfect cup of freshly brewed coffee at our coffee shop. Savor the rich aroma and bold flavors that will awaken your senses and leave you craving for more.
              </p>
              <img class="img-fluid" src="~assets/img/signature.png" alt="">
            </div>
          </div>
        </div>
      </section>
      <!-- End video-sec Area -->
      
      <!-- Start menu Area -->
      <section id="coffee" class="menu-area section-gap">
        <div class="container">
          <div class="row d-flex justify-content-center">
          <div class="menu-content pb-60 col-lg-10">
            <div class="title text-center">
            <h1 class="mb-10">What kind of Coffee we serve for you</h1>
            <p>Here are some of our best selling coffees and pastries</p>
            </div>
          </div>
          </div>             

          <div class="row">
            <div v-for="product in products" :key="product.id" class="col-lg-4">
              <div class="single-menu" style="min-height: 300px;">
                <div class="title-div justify-content-between d-flex">
                  <h4>{{ product.Name }}</h4>
                  <p class="price float-right">₱{{ product.Price }}</p>
                </div>
                <p>{{ product.Description }}</p>
              </div>
            </div>
        </div>
		  </div>  
		</section>
      <!-- End menu Area -->

      <!-- Start gallery Area -->
      <section id="gallery" class="gallery-area section-gap">
        <div class="container">
          <div class="row d-flex justify-content-center">
            <div class="menu-content pb-60 col-lg-10">
              <div class="title text-center">
                <h1 class="mb-10">What kind of Coffee we serve for you</h1>
                <p>Who are in extremely love with eco friendly system.</p>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-lg-4">
              <a href="img/g1.jpg" class="img-pop-home">
                <img class="img-fluid" src="~/assets/img/g1.jpg" alt="">
              </a>
              <a href="img/g2.jpg" class="img-pop-home">
                <img class="img-fluid" src="~/assets/img/g2.jpg" alt="">
              </a>
            </div>
            <div class="col-lg-8">
              <a href="img/g3.jpg" class="img-pop-home">
                <img class="img-fluid" src="~/assets/img/g3.jpg" alt="">
              </a>
              <div class="row">
                <div class="col-lg-6">
                  <a href="img/g4.jpg" class="img-pop-home">
                    <img class="img-fluid" src="~/assets/img/g4.jpg" alt="">
                  </a>
                </div>
                <div class="col-lg-6">
                  <a href="img/g5.jpg" class="img-pop-home">
                    <img class="img-fluid" src="~/assets/img/g5.jpg" alt="">
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- End gallery Area -->

      <ApiComponent/> <!-- Call ApiComponent here-->

  </div>
</template>
```

```js
<script>
import { ref, onMounted } from 'vue';
import Navbar from '@/components/Navbar';
import ApiComponent from '@/components/ApiComponent';

export default {
  name: 'HomePage',
  components: {
    Navbar,
    ApiComponent,
  },
  setup() {
    // Define a reactive reference for the products data
    const products = ref([]);

    // Define an async function to fetch the products data
    const fetchProducts = async () => {
      try {
        // Make a request to the API endpoint to fetch the products data
        const response = await fetch('http://localhost:1337/api/products?populate=*');
        const data = await response.json();
        // Extract the necessary attributes from the fetched data and update the products ref
        products.value = data.data.map(item => item.attributes);
      } catch (error) {
        // Handle any errors that occur during the fetch request
      }
    };

    // Call the fetchProducts function when the component is mounted
    onMounted(fetchProducts);

    // Return the reactive reference and any other properties or methods needed in the component
    return {
      products
    };
  }
}
</script>
```

Now go back to your browser and try out these APIs.
