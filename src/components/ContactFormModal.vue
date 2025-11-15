<script lang="ts" setup>
import { inject } from 'vue'
import { type IContactForm } from '@/models/contacts.interface'
import ContactForm from './ContactForm.vue'

const dialogRef = inject('dialogRef')

function handleSubmit(contact: IContactForm) {
  dialogRef?.value?.close(contact)
}
</script>
<template>
  <ContactForm :contact="dialogRef!.data?.contact" @submit="handleSubmit"></ContactForm>
</template>
<style></style>
