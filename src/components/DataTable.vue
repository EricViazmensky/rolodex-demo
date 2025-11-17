<script setup lang="ts">
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { useContactsStore } from "@/stores/contacts.store";
import { onBeforeMount, ref, watch, type Ref } from "vue";
import type { IContact } from "@/models/contacts.interface";
import { Button } from "primevue";
import { FilterMatchMode } from "@primevue/core/api";
import InputText from "primevue/inputtext";
import Select from "primevue/select";
import ToggleSwitch from "primevue/toggleswitch";
import { getPhoneType } from "@/models/phone.constants";

// declare variables are needed for the component to work
const sortField = ref("");
const sortOrder: Ref<number> = ref(0);
const contactsStore = useContactsStore();
const contacts: Ref<IContact[]> = ref([]);
const showInactive = ref(false);

// this is specific to PrimeVue's DataTable to control what filters are used
const filters = ref({
  lastName: { value: null, matchMode: FilterMatchMode.CONTAINS },
  firstName: { value: null, matchMode: FilterMatchMode.CONTAINS },
  phone: { value: null, matchMode: FilterMatchMode.CONTAINS },
  email: { value: null, matchMode: FilterMatchMode.CONTAINS },
  "address.state": { value: null, matchMode: FilterMatchMode.EQUALS },
});

// declare props (inputs) and emits (outputs) of the component

const emits = defineEmits(["delete", "edit", "activate", "add"]);

// declare functions that the component will use
function setSortField(event: string) {
  sortField.value = event;
}

function setSortOrder(event: number) {
  sortOrder.value = event;
}

function editUser(contact: IContact) {
  emits("edit", contact);
}

function removeUser(contact: IContact) {
  emits("delete", contact);
}

function activateUser(contact: IContact) {
  emits("activate", contact);
}

function addUser() {
  emits("add");
}

// set up lifecycle hooks and watchers
onBeforeMount(async () => {
  await contactsStore.fetchContacts();
});

watch(
  () => contactsStore.contacts,
  (newContacts) => {
    if (newContacts) {
      contacts.value = newContacts.filter((c) =>
        showInactive.value ? true : c.active
      );
    }
  },
  {
    deep: true,
  }
);

watch(
  showInactive,
  (newShowInactive) =>
    (contacts.value = contactsStore.contacts.filter((c) =>
      newShowInactive ? true : c.active
    ))
);

watch([sortField, sortOrder], (values) => {
  const field = values[0];
  const order = values[1];
  const sortedContacts = [...contacts.value];
  if (field === "address") {
    sortedContacts.sort((a: IContact, b: IContact): number => {
      if (order === 1) {
        return a.address.state.toLocaleLowerCase() <
          b.address.state.toLocaleLowerCase()
          ? -1
          : 1;
      } else {
        return a.address.state.toLocaleLowerCase() >
          b.address.state.toLocaleLowerCase()
          ? -1
          : 1;
      }
    });
  }
  if (field === "phone") {
    sortedContacts.sort((a: IContact, b: IContact) => {
      if (order === 1) {
        return a.phone.phoneNumber < b.phone.phoneNumber ? -1 : 1;
      } else {
        return a.phone.phoneNumber > b.phone.phoneNumber ? -1 : 1;
      }
    });
  }
  contacts.value = sortedContacts;
});
</script>
<template>
  <DataTable
    :value="contacts"
    paginator
    :rows="10"
    @update:sort-field="setSortField"
    @update:sort-order="setSortOrder!"
    :loading="!contactsStore.init"
    loading-icon="pi pi-spin pi-spinner-dotted"
    v-model:filters="filters"
    filterDisplay="row"
  >
    <template #header>
      <div class="table-header">
        <div class="left-hand-actions">
          <h1>Contacts</h1>
          <Button
            rounded
            icon="pi pi-user-plus"
            label="Add New Contact"
            @click="addUser()"
          ></Button>
        </div>

        <span>
          <label for="showInactive"
            >{{ showInactive ? "Hide" : "Show" }} inactive contacts</label
          >
          <ToggleSwitch
            v-model="showInactive"
            name="showInactive"
          ></ToggleSwitch>
        </span></div
    ></template>
    <Column
      field="active"
      header="Active"
      v-if="showInactive"
      style="width: 50px"
    >
      <template #body="slotProps">
        <i
          class="pi"
          :class="slotProps.data.active ? 'pi-circle-fill' : 'pi-circle'"
          v-tooltip="`User is ${slotProps.data.active ? 'active' : 'inactive'}`"
        />
      </template>
    </Column>
    <Column field="lastName" header="Last Name" sortable>
      <template #filter="{ filterModel, filterCallback }">
        <InputText
          v-model="filterModel.value"
          type="text"
          @input="filterCallback()"
          placeholder="Search by last name"
        />
      </template>
    </Column>
    <Column field="firstName" header="First Name" sortable>
      <template #filter="{ filterModel, filterCallback }">
        <InputText
          v-model="filterModel.value"
          type="text"
          @input="filterCallback()"
          placeholder="Search by first name"
        />
      </template>
    </Column>
    <Column
      field="address"
      header="Address"
      sortable
      :showFilterMenu="false"
      filter-field="address.state"
    >
      <template #filter="{ filterModel, filterCallback }">
        <Select
          :options="contactsStore.states"
          v-model="filterModel.value"
          @change="filterCallback()"
          placeholder="Select State"
        ></Select>
      </template>
      <template #body="slotProps">
        <div>{{ slotProps.data.address.street }}</div>
        <div>
          {{ slotProps.data.address.city }}, {{ slotProps.data.address.state }},
          {{ slotProps.data.address.zip }}
        </div>
      </template>
    </Column>
    <Column field="phone" header="Phone Number" sortable style="width: 15%">
      <template #body="slotProps">
        <span
          class="pi"
          :class="getPhoneType(slotProps.data.phone.type)?.icon"
          v-tooltip="getPhoneType(slotProps.data.phone.type)?.label"
        ></span>
        <a :href="'tel:' + slotProps.data.phone.phoneNumber">{{
          slotProps.data.phone.phoneNumber
        }}</a>
      </template>
      <template #filter="{ filterModel, filterCallback }">
        <InputText
          v-model="filterModel.value"
          type="text"
          @input="filterCallback()"
          placeholder="Search by phone number"
        />
      </template>
    </Column>
    <Column field="email" header="Email" sortable style="width: 15%">
      <template #body="slotProps">
        <a :href="'mailto:' + slotProps.data.email">{{
          slotProps.data.email
        }}</a>
      </template>
      <template #filter="{ filterModel, filterCallback }">
        <InputText
          v-model="filterModel.value"
          type="text"
          @input="filterCallback()"
          placeholder="Search by email address"
        />
      </template>
    </Column>
    <Column header="Actions" style="width: 120px; padding: 12px">
      <template #body="slotProps">
        <div class="button-wrapper">
          <Button
            style="font-size: 10px !important"
            icon="pi pi-user-edit"
            rounded
            aria-label="Edit Contact"
            @click="editUser(slotProps.data)"
            v-tooltip="'Edit contact'"
          />
          <Button
            v-if="slotProps.data.active"
            style="font-size: 10px !important"
            icon="pi pi-times-circle"
            rounded
            aria-label="Remove Contact"
            @click="removeUser(slotProps.data)"
            severity="secondary"
            v-tooltip="'Remove contact'"
          />
          <Button
            v-tooltip="'Activate contact'"
            v-if="!slotProps.data.active"
            style="font-size: 10px !important"
            icon="pi pi-plus-circle"
            rounded
            aria-label="Remove Contact"
            @click="activateUser(slotProps.data)"
            severity="secondary"
          />
        </div>
      </template>
    </Column>
  </DataTable>
</template>
<style>
.table-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  .left-hand-actions {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 10px;
    .p-button {
      height: 30px;
      margin-left: 5px;
    }
  }
  span {
    display: flex;
    align-items: anchor-center;
    label {
      margin-right: 5px;
    }
  }
}
</style>
