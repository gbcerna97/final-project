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
