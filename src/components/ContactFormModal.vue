<script lang="ts" setup>
import { inject, onMounted, type Ref, ref } from "vue";
import { type IContact, type IContactForm } from "@/models/contacts.interface";
import ContactForm from "./ContactForm.vue";

const dialogRef = inject("dialogRef");
const contactRef: Ref<IContact | undefined> = ref<IContact>();

function handleSubmit(contact: IContactForm) {
  console.log(contact);
  //@ts-expect-error using primevue dialogref
  dialogRef?.value?.close(contact);
}

onMounted(() => {
  //@ts-expect-error using primevue dialogref
  contactRef.value = dialogRef?.value?.data.contact;
});
</script>
<template>
  <ContactForm :contact="contactRef" @submit="handleSubmit"></ContactForm>
</template>
<style></style>
