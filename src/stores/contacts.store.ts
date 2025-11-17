import { defineStore } from "pinia";
import type {
  IPhone,
  IContact,
  IContactsResponse,
  IPhoneResponse,
  INewContact,
  TPhoneNumber,
} from "@/models/contacts.interface";
import { computed, ref, type ComputedRef, type Ref } from "vue";
import { v4 as uuidv4 } from "uuid";

export const useContactsStore = defineStore("contacts", () => {
  const contactsMap = ref(new Map<string, IContact>());
  const contacts = computed(() => Array.from(contactsMap.value.values()));
  const phoneNumbers: ComputedRef<TPhoneNumber[]> = computed(() =>
    contacts.value.map(
      (contact: IContact): TPhoneNumber => contact.phone.phoneNumber
    )
  );
  const emails: ComputedRef<string[]> = computed(() =>
    contacts.value.map((contact: IContact): string => contact.email)
  );
  const states: ComputedRef<string[]> = computed(() =>
    Array.from(
      new Set(contacts.value.map((contact: IContact) => contact.address.state))
    ).sort()
  );
  const init = ref(false);

  async function fetchContacts(): Promise<void> {
    // if the data is already loaded, we won't have to make another call.
    // the api not returning any data can be a valid response, so we can not use empty arrays
    // or empty objects as an indicator that a call was not successful
    if (!init.value) {
      try {
        // get contacts info from the server
        const contactResponse = await fetch("/MOCK_DATA.json");
        const contactResponseData: IContactsResponse[] =
          await contactResponse.json();

        // map response data to application data
        contactResponseData.forEach((contactResponse: IContactsResponse) => {
          // remap data
          const responsePhone: IPhoneResponse = contactResponse.phone;
          const phoneInfo: IPhone = {
            type: responsePhone.type,
            phoneNumber: responsePhone.number,
          };

          // different programing languages have different naming conventions
          // so if the backend uses snake casing, and the front end uses camel casing
          // fields will need to be remapped
          const contactInfo: IContact = {
            id: contactResponse.id,
            firstName: contactResponse.first_name,
            lastName: contactResponse.last_name,
            active: contactResponse.active,
            address: contactResponse.address,
            email: contactResponse.email,
            phone: phoneInfo,
          };
          contactsMap.value.set(contactInfo.id, contactInfo);
        });
        setTimeout(() => (init.value = true), 1000);
      } catch (e) {
        console.error(e);
      }
    }
  }

  function getContact(id: string): IContact | null {
    // returns single instance of a contact
    if (id.trim() && contactsMap.value.has(id)) {
      return contactsMap.value.get(id)!;
    }
    return null;
  }

  async function updateContact(contact: IContact) {
    init.value = false;

    return new Promise((resolve) =>
      setTimeout(() => {
        contactsMap.value.set(contact.id, contact);
        init.value = true;
      }, 1500)
    );
  }

  async function addContact(contact: INewContact): Promise<void> {
    // enforce unique phone number and email
    if (
      !phoneNumbers.value.includes(contact.phone.phoneNumber) &&
      !emails.value.includes(contact.email)
    ) {
      const id = uuidv4();
      const active = true;
      const newContact: IContact = {
        ...contact,
        id,
        active,
      };
      await updateContact(newContact);
    } else {
      throw new Error("email and phone number must be unique");
    }
  }

  return {
    init,
    contactsMap,
    contacts,
    emails,
    phoneNumbers,
    states,
    fetchContacts,
    updateContact,
    addContact,
    getContact,
  } as {
    init: Ref<boolean>;
    contactsMap: Ref<Map<string, IContact>>;
    contacts: ComputedRef<IContact[]>;
    emails: ComputedRef<string[]>;
    phoneNumbers: ComputedRef<TPhoneNumber[]>;
    states: ComputedRef<string[]>;
    fetchContacts: () => Promise<void>;
    updateContact: (contact: IContact) => Promise<void>;
    addContact: (contact: INewContact) => Promise<void>;
    getContact: () => IContact;
  };
});
