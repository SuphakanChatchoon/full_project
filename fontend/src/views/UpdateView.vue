<template>
    <div class="q-gutter-md" style="max-width:400px;">
      <q-form @submit.prevent="onSubmit" class="q-gutter-md">
        <q-input v-model="id" label="ID" readonly />
        <q-input v-model="first_name" label="First Name" outlined />
        <q-input v-model="last_name" label="Last Name" outlined />
        <q-input v-model="email" label="Email" outlined type="email" />
        <q-input v-model="address" label="Address" outlined />
        <q-input v-model="phone_number" label="Phone Number" outlined type="tel" />
        <q-btn type="submit" label="Update" color="primary" class="rounded-btn" />
      </q-form>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router' 
  
  const route = useRoute()
  const router = useRouter()
  
  // Define reactive variables for form fields
  const id = ref(route.params.id)
  const first_name = ref('')
  const last_name = ref('')
  const email = ref('')
  const address = ref('')
  const phone_number = ref('')
  
  // Fetch data when the component is mounted
  const fetchData = () => {
    fetch("http://localhost:8800/api/v1/customers/" + id.value)
      .then(res => res.json())
      .then(result => {
        first_name.value = result.first_name
        last_name.value = result.last_name
        email.value = result.email
        address.value = result.address
        phone_number.value = result.phone_number
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
        alert('Error fetching data')
      })
  }
  
  // Call fetchData on component mount
  onMounted(() => {
    fetchData()
  })
  
  // Handle form submission
  const onSubmit = () => {
    const myHeaders = new Headers()
    myHeaders.append("Content-Type", "application/json")
  
    const raw = JSON.stringify({
      first_name: first_name.value,
      last_name: last_name.value,
      email: email.value,
      address: address.value,
      phone_number: phone_number.value
    })
  
    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    }
  
    fetch("http://localhost:8800/api/v1/customers/" + id.value, requestOptions)
      .then((response) => {
        if (!response.ok) {
          return response.json().then((error) => {
            throw new Error(error.message || 'Something went wrong!')
          })
        }
        return response.json()
      })
      .then((result) => {
        alert(result.message)
        if (result.status === 'ok') {
          router.push('/')
        }
        // Fetch the updated data after submission
        fetchData()
      })
      .catch((error) => {
        console.error('Error during update:', error)
        alert(`Error: ${error.message}`)
      })
  }
  </script>