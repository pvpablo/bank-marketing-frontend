<template>
  <v-container>
    <v-row class="text-center">
      <v-col class="mb-5 mt-10" cols="12">
        <v-row justify="center">
          <v-form ref="form">
            <!-- <v-text-field v-model="name" :counter="10" label="Name" required></v-text-field> -->
            <v-slider v-model="duration" :thumb-size="30" thumb-label="always" max="1000"></v-slider>
            <!-- <v-select v-model="select" :items="items" :rules="[v => !!v || 'Item is required']"
              label="Item" required></v-select> -->
            <v-btn color="primary" class="mr-4" @click="predict" :disabled="waiting">Predict</v-btn>
            <v-btn color="secondary" class="mr-4" @click="reset" :disabled="waiting">Reset Form</v-btn>
          </v-form>
        </v-row>
      </v-col>
    </v-row>
    <v-row class="text-center" v-if="result">
      <v-col class="mb-5" cols="12">
        <v-row justify="center">
          <h3>Latest Prediction</h3>
        </v-row>
        <v-row justify="center">
          <p>Won't deposit confidence:  <span :class="class1">{{class1Confidence}}</span></p>
        </v-row>
        <v-row justify="center">
        <p>Will deposit confidence: <span :class="class2">{{class2Confidence}}</span></p>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    data: () => ({
      class1: '',
      class2: '',
      waiting: false,
      class1Confidence: -1,
      class2Confidence: -1,
      result: false,
      select: null,
      items: [
        'Item 1',
        'Item 2',
        'Item 3',
        'Item 4',
      ],
      duration: 0,
    }),
    methods: {
      reset () {
        this.$refs.form.reset()
        this.class1Confidence = -1
        this.class2Confidence = -1
        this.result=false
      },
      async predict () {
        this.waiting=true
        const BASE_URL = 'https://bank-marketing-endpoint-o2b4bu4ala-uc.a.run.app'
        const response = await fetch(`${BASE_URL}?duration=${this.duration}`)
        const data = await response.json();
        this.class1Confidence = data[0].score
        this.class2Confidence = data[1].score
        if (this.class1Confidence >= 0.90) {
          this.class1 = 'success'
          this.class2 = 'error'
        } else if (this.class1Confidence >= 0.60 && this.class1Confidence < 0.90) {
          this.class1 = 'warning'
          this.class2 = 'error'
        } else if (this.class2Confidence >= 0.90) {
          this.class1 = 'error'
          this.class2 = 'success'
        } else if (this.class2Confidence >= 0.60 && this.class2Confidence < 0.90) {
          this.class1 = 'error'
          this.class2 = 'warning'
        } else {
          this.class1 = 'error'
          this.class2 = 'error'
        }
        this.result=true
        this.waiting=false
      }
    },
  }
</script>

<style>

</style>
