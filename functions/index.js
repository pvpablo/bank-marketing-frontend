const functions = require('firebase-functions')
const axios = require('axios')
const cors = require('cors')({ origin: true })
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)
const db = admin.firestore()

exports.predict = functions.firestore.document('predictions/{id}').onCreate((snap, context) => {
 const data = snap.data()
 const duration = data.duration
 const timestamp = data.timestamp
 const id = context.params.id
 const BASE_URL = 'https://bank-marketing-endpoint-o2b4bu4ala-uc.a.run.app'
 axios.get(`${BASE_URL}?duration=${duration}`).then(response => {
   // console.log(`The response data is ${response.data[0].score} for id ${id}`)
    const result = {
      duration: duration,
      timestamp: timestamp,
       class1Confidence: response.data[0].score,
       class2Confidence: response.data[1].score
    }
    const predictionRef = db.collection('predictions').doc(id)
    return predictionRef.update(result)
  }).catch(error => {
    return new Error(error)
  })
});
