<script setup lang="ts">
import DataTable from "@/components/DataTable.vue";
import { DynamicDialog, useToast, ConfirmDialog, Toast } from "primevue";
import { useDialog } from "primevue";
import type { IContact } from "@/models/contacts.interface";
import ContactFormModal from "@/components/ContactFormModal.vue";
import { useConfirm } from "primevue/useconfirm";
import { useContactsStore } from "@/stores/contacts.store";

const dialogService = useDialog();

const confirmService = useConfirm();

const toast = useToast();
const contactStore = useContactsStore();

function launchContactForm(contact?: IContact) {
  dialogService.open(ContactFormModal, {
    data: { contact },
    props: {
      modal: true,
      header: "Contact Form",
    },
    onClose: async (opt) => {
      if (opt?.data) {
        const successMessage = contact?.id
          ? "Contact updated"
          : "Contact created";
        if (contact?.id) {
          await contactStore.updateContact(opt!.data);
        } else {
          await contactStore.addContact(opt!.data);
        }
        toast.add({
          severity: "success",
          summary: successMessage,
        });
      }
    },
  });
}

function handleDelete(contact: IContact) {
  confirmService.require({
    header: `You are about to remove ${contact.firstName}, ${contact.lastName} from your contact list`,
    message: `I hope you're sure`,
    icon: "pi pi-exclamation-triangle",
    rejectProps: {
      label: "Cancel",
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      label: "Remove Contact",
      severity: "warn",
      outlined: true,
    },
    accept: async () => {
      contact.active = false;
      await contactStore.updateContact(contact);
      toast.add({
        severity: "warn",
        summary: "Contact removed",
      });
    },
  });
}

function handleActivateUser(contact: IContact) {
  confirmService.require({
    header: `You are about to activate ${contact.firstName}, ${contact.lastName} to your contact list`,
    message: `I hope you're sure`,
    icon: "pi pi-exclamation-triangle",
    rejectProps: {
      label: "Cancel",
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      label: "Activate Contact",
      severity: "success",
      outlined: true,
    },
    accept: async () => {
      contact.active = true;
      await contactStore.updateContact(contact);
      toast.add({
        severity: "success",
        summary: "Contact activated",
      });
    },
  });
}
</script>

<template>
  <main>
    <DataTable
      @edit="launchContactForm"
      @delete="handleDelete"
      @activate="handleActivateUser"
      @add="launchContactForm"
    ></DataTable>
    <DynamicDialog></DynamicDialog>
    <Toast />
    <ConfirmDialog></ConfirmDialog>
  </main>
</template>

<style lang="scss"></style>
