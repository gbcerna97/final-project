<template>
  <div>
      <Navbar />
      <!-- Start video-sec Area -->
      <section id="about" class="video-sec-area pb-100 pt-40">
        <div class="container">
          <div class="row justify-content-start align-items-center">
            <div class="col-lg-6 video-right justify-content-center align-items-center d-flex">
              <div class="overlay overlay-bg"></div>
            </div>
            <div class="col-lg-6 video-left">
              <h6>Freshly brewed Coffee.</h6>
              <h1>We Only Serve <br>
                Freshly Brewed Coffee</h1>
              <p><span>Coffee that you love, brewed right in front of you.</span></p>
              <p>
                  Discover the perfect cup of freshly brewed coffee at our coffee shop. Savor the rich aroma and bold flavors that will awaken your senses and leave you craving for more.
              </p>
              <img class="img-fluid" width="150" src="~assets/img/signature.png" alt="">
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
            <div class="single-menu" style="min-height: 500px;">
              <img class="mb-2" :src="`http://localhost:1337${product.Image.data.attributes.formats.small.url}`" style="width: 300px; height: 200px; object-fit: cover;">
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

      <ApiComponent/>

  </div>
</template>

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

<style>

</style>





