<script lang="ts" setup>
import type { IContactForm } from '@/models/contacts.interface'
import { InputText, Select, Button, Card, Message } from 'primevue'
import { ref, watch, type Ref } from 'vue'
import { Form, FormField, type FormInstance, type FormResolverOptions } from '@primevue/forms'
import { useContactsStore } from '@/stores/contacts.store'
import { phoneTypes, getPhoneType } from '@/models/phone.constants'

const props = defineProps<{ contact?: IContactForm }>()
const isNewContact = ref(false)
const contactForm: Ref<IContactForm> = ref<IContactForm>({})

const contactFormRef: Ref<FormInstance | undefined> = ref()

const emits = defineEmits(['submit'])

const contactStore = useContactsStore()

function submitForm() {
  const formFeilds = contactFormRef.value?.states
  let responseObject: IContactForm = {}
  if (formFeilds) {
    responseObject = {
      active: isNewContact.value ? true : props.contact?.active,
      id: isNewContact.value ? '' : props?.contact?.id,
      firstName: formFeilds.firstName?.value,
      lastName: formFeilds.lastName?.value,
      email: formFeilds.email?.value,
      address: {
        street: formFeilds.street?.value,
        city: formFeilds.city?.value,
        state: formFeilds.state?.value,
        zip: formFeilds.zip?.value,
      },
      phone: {
        type: formFeilds.phoneType?.value,
        phoneNumber: formFeilds.phoneNumber?.value,
      },
    }
  }
  emits('submit', responseObject)
}

const resolver = (resolveData: FormResolverOptions) => {
  const { values } = resolveData
  const errors: { [key: string]: { message: string }[] } = {}

  for (const key in values) {
    if (values[key] === null || values[key].trim() === '') {
      errors[key] = [{ message: 'Field is required' }]
    } else {
      contactFormRef.value!.states[key]!.valid = true
      contactFormRef.value!.states[key]!.invalid = false
      contactFormRef.value!.states[key]!.error = null
      contactFormRef.value!.states[key]!.errors = []
    }
  }

  return {
    values,
    errors,
  }
}

watch(
  () => props.contact,
  (newContact) => {
    if (newContact) {
      isNewContact.value = !newContact.id
      contactForm.value = newContact
    }
  },
  {
    deep: true,
    immediate: true,
  },
)
</script>
<template>
  <Card style="form-wrapper">
    <template #subtitle v-if="contactForm.id && !contactForm.active"
      >This contact is disabled</template
    >
    <template #content>
      <Form
        v-slot="$form"
        @submit="submitForm"
        :validate-on-blur="true"
        :resolver
        ref="contactFormRef"
      >
        <div class="form-row">
          <FormField v-slot="$field" name="firstName" :initialValue="contactForm.firstName">
            <InputText type="text" placeholder="First Name" />
            <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
              $field.error?.message
            }}</Message>
          </FormField>
          <FormField v-slot="$field" name="lastName" :initialValue="contactForm.lastName">
            <InputText type="text" placeholder="Last Name" />
            <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
              $field.error?.message
            }}</Message>
          </FormField>
        </div>
        <div class="form-row">
          <FormField
            v-slot="$field"
            name="email"
            :initialValue="contactForm.email"
            :validate-on-blur="true"
          >
            <InputText type="email" placeholder="Email" />
            <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
              $field.error?.message
            }}</Message>
          </FormField>
        </div>
        <div class="form-row">
          <FormField v-slot="$field" name="phoneType" :initialValue="contactForm?.phone?.type">
            <Select :options="phoneTypes" option-value="value">
              <template #value="slotProps">
                <div>
                  <i class="pi" :class="getPhoneType(slotProps.value)?.icon"></i>
                  {{ getPhoneType(slotProps.value)?.label }}
                </div>
              </template>
              <template #option="slotProps">
                <div>
                  <i class="pi" :class="slotProps.option.icon"></i> {{ slotProps.option.label }}
                </div>
              </template>
            </Select>
            <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
              $field.error?.message
            }}</Message>
          </FormField>
          <FormField
            v-slot="$field"
            name="phoneNumber"
            :initialValue="contactForm?.phone?.phoneNumber"
          >
            <InputText type="tel" placeholder="Phone Number" />
            <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
              $field.error?.message
            }}</Message>
          </FormField>
        </div>
        <div class="form-row">
          <FormField v-slot="$field" name="street" :initialValue="contactForm?.address?.street">
            <InputText type="text" placeholder="Street Address" />
            <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
              $field.error?.message
            }}</Message>
          </FormField>
          <FormField v-slot="$field" name="city" :initialValue="contactForm?.address?.city">
            <InputText type="tel" placeholder="City" />
            <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
              $field.error?.message
            }}</Message>
          </FormField>
        </div>
        <div class="form-row">
          <FormField v-slot="$field" name="state" :initialValue="contactForm?.address?.state">
            <Select name="state" :options="contactStore.states"></Select>
            <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
              $field.error?.message
            }}</Message>
          </FormField>
          <FormField v-slot="$field" name="zip" :initialValue="contactForm?.address?.zip">
            <InputText type="text" placeholder="zip" />
            <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
              $field.error?.message
            }}</Message>
          </FormField>
        </div>
        <div class="formRow">
          <Button type="submit" label="Submit" :disabled="!$form.valid"></Button>
        </div>
      </Form>
    </template>
  </Card>
</template>
<style>
.form-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.form-row {
  width: 600px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 0.5em;
  .p-formfield {
    width: 45%;
    display: flex;
    flex-direction: column;
    .p-select,
    .p-inputtext {
      width: 100% !important;
    }
  }
}
</style>
