<template>
  <v-app>
      <v-container>
          <v-row>
              <v-col v-for="card in cards" :key="card.id" cols="12" sm="6" md="4" lg="3">
                  <v-card>
                      <v-card-title>{{ card.name }}</v-card-title>
                      <v-card-text>{{ card.type }}</v-card-text>
                      <v-card-actions>
                          <v-btn color="primary" :to="`/details/${card.id}`">View Details</v-btn>
                      </v-card-actions>
                  </v-card>
              </v-col>
          </v-row>
      </v-container>
  </v-app>
</template>

<script>
export default {
  data() {
      return {
          cards: []
      };
  },
  mounted() {
      this.fetchCards();
  },
  methods: {
      fetchCards() {
          fetch("/api/rooms")
              .then(response => response.json())
              .then(data => {
                  this.cards = data;
              })
              .catch(error => {
                  console.error('Error fetching cards:', error);
              });
      }
  }
};
</script>
