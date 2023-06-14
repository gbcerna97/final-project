<template>
  <!-- Start menu Area -->
  <section id="coffee" class="section-gap">
    <div class="container">
      <div class="row d-flex justify-content-center">
        <div class="menu-content pb-60 col-lg-10">
          <div class="title text-center">
            <h1 class="mb-10">Enjoying our comments? Leave a review!</h1>
            <p>Leave a review for us. We'd love to hear from you.</p>
          </div>
        </div>
      </div>

      <div class="row">
        <div v-for="comment in comments" :key="comment.id" class="col-lg-4">
          <div class="single-menu" style="min-height: 200px;">
            <small>{{ comment.User.data.attributes.username }}</small><br>
            <p>"{{ comment.Comment }}"</p>
            <div class="py-4 pull-ri">
              <button
                v-if="comment.User.data.id === loggedInUser.id"
                class="text-primary"
                @click="editComment(comment.id)"
              >
                Edit
              </button>
              <button
                v-if="comment.User.data.id === loggedInUser.id"
                class="text-danger"
                @click="confirmDeleteComment(comment.id)"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
        <div class="col-lg-12">
          
          <form @submit.prevent="addComment">
            
            <textarea v-model="comment" class="form-control mb-2" rows="3" required></textarea>
            <button type="submit" class="btn btn-primary">Add Comment</button>
          </form>
          
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import { ref, onMounted } from 'vue';
  import { throttle } from 'lodash'; // Import the throttle function from lodash
  import { mapGetters } from 'vuex';

  export default {
    middleware: 'auth',

    setup() {
      const comments = ref([]);

      const fetchComments = async () => {
        try {
          const response = await fetch('http://localhost:1337/api/comments?populate=*');
          const data = await response.json();
          comments.value = data.data.map(item => ({
            id: item.id,
            ...item.attributes,
          }));
        } catch (error) {
          console.error('Failed to fetch comments:', error);
        }
      };

      // Use throttle from lodash to limit the frequency of API calls
      const throttledFetchComments = throttle(fetchComments, 1000); // Adjust the delay as needed

      onMounted(throttledFetchComments);

      return {
        comments, // Assign the comments directly instead of comments.value
      };
    },

    data() {
      return {
        success: false,
        comment: '',
        editingCommentId: null, // Add a variable to store the ID of the comment being edited
        editedComment: '', // Add a variable to store the edited comment text
      }
    },

    computed: {
      ...mapGetters(['loggedInUser', 'getUserId']),
    },

    methods: {
      async addComment() {

        try {
          const payload = {
            data: {
              User: this.getUserId,
              Comment: this.comment
            }
          };

          await this.$axios.post('http://localhost:1337/api/comments', payload);

          this.success = true; // Set the success flag to true

          // Fetch the new comments and append the new comment to the existing array
          const response = await fetch('http://localhost:1337/api/comments?populate=*');
          const data = await response.json();
          const newComment = data.data.map(item => ({
            id: item.id,
            ...item.attributes,
          })).pop(); // Use pop() to get the last item, assuming it is the newly added comment

          console.log('New comment:', newComment);

          this.comments.push(newComment);

          this.comment = '';

        } catch (e) {
          if (e.response && e.response.data && e.response.data.error) {
            this.err = e.response.data.error.message; // Set the error message if there is a response error
          }
        }
      },
      confirmDeleteComment(commentId) {
        if (confirm('Are you sure you want to delete this comment? This action cannot be undone.')) {
          this.deleteComment(commentId);
        }
      },
      
      async deleteComment(commentId) {
        try {
          console.log('Deleting comment:', commentId);
          this.$axios.setToken(false);
          await this.$axios.delete(`http://localhost:1337/api/comments/${commentId}`);

          // Remove the deleted comment from the comments array
          this.comments = this.comments.filter(comment => comment.id !== commentId);

          this.$toast.success('Comment deleted successfully!', {
            duration: 5000,
          });
        } catch (error) {
          console.error('Failed to delete comment:', error);
        }
      },

      editComment(commentId) {
        // Find the comment with the specified ID
        const comment = this.comments.find(comment => comment.id === commentId);
        if (comment) {
          this.editingCommentId = comment.id; // Set the editingCommentId to the ID of the comment being edited
          this.editedComment = comment.Comment; // Set the editedComment to the current comment text
          // Show an alert box with an input field to edit the comment
          const newCommentText = window.prompt('Edit comment:', this.editedComment);
          if (newCommentText) {
            this.updateComment(commentId, newCommentText); // Call the updateComment method to update the comment
          }
        }
      },

      async updateComment(commentId, newCommentText) {
        try {
          const payload = {
            data: {
              Comment: newCommentText,
            },
          };

          await this.$axios.put(`http://localhost:1337/api/comments/${commentId}`, payload);

          // Update the comment in the comments array
          const commentIndex = this.comments.findIndex(comment => comment.id === commentId);
          if (commentIndex !== -1) {
            this.comments[commentIndex].Comment = newCommentText;
          }

          this.$toast.success('Comment updated successfully!', {
            duration: 5000,
          });
        } catch (error) {
          console.error('Failed to update comment:', error);
        }
      },
    },
  };
</script>
