<template>
  <div class="q-pa-md">
    <div class="q-mb-md">
      <q-btn icon="add" label="เพิ่มลูกค้า" color="primary" @click="onCreate" />
    </div>
    <q-table title="รายชื่อลูกค้า" :rows="rows" :columns="columns" row-key="customer_id">
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn flat dense round icon="edit" color="blue" @click="onEdit(props.row.customer_id)" />
          <q-btn flat dense round icon="delete" color="red" @click="onDelete(props.row.customer_id)" />
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const rows = ref([])

const columns = [
  { name: 'customer_id', align: 'center', label: 'รหัสลูกค้า', field: 'customer_id', sortable: true },
  { name: 'first_name', align: 'center', label: 'ชื่อ', field: 'first_name', sortable: true },
  { name: 'last_name', align: 'center', label: 'นามสกุล', field: 'last_name', sortable: true },
  { name: 'email', align: 'center', label: 'อีเมล', field: 'email', sortable: true },
  { name: 'address', align: 'center', label: 'ที่อยู่', field: 'address', sortable: true },
  { name: 'phone_number', align: 'center', label: 'เบอร์โทร', field: 'phone_number', sortable: true },
  { name: 'actions', align: 'center', label: 'การจัดการ', field: 'id' }
]

const fetchData = async () => {
  try {
    const response = await fetch('http://localhost:8800/api/v1/customers')
    rows.value = await response.json()
  } catch (error) {
    console.error('Fetch error:', error)
  }
}

const onCreate = () => {
  router.push('/create')
}

const onEdit = (id) => {
  router.push('/update/' + id)
  console.log(id)
}

const onDelete = async (id) => {

  try {
    const response = await fetch(`http://localhost:8800/api/v1/customers/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    })

    const result = await response.json()

    if (!response.ok) throw new Error(result.message || "ลบไม่สำเร็จ")

    alert(result.message || "ลบข้อมูลสำเร็จ!")
    await fetchData()
  } catch (error) {
    console.error("Error:", error)
    alert("เกิดข้อผิดพลาด: " + error.message)
  }
}

onMounted(fetchData)
</script>
