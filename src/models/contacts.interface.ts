export type TPhoneNumber =
  `${number}${number}${number}-${number}${number}${number}-${number}${number}${number}${number}`

export interface IAddress {
  street: string
  city: string
  state: string
  zip: string
}

export interface IAddressForm {
  street?: string
  city?: string
  state?: string
  zip?: string
}

export interface IPhone {
  type: string
  phoneNumber: TPhoneNumber
}

export interface IPhoneResponse {
  type: string
  number: TPhoneNumber
}

export interface IPhoneForm {
  type?: string
  phoneNumber?: TPhoneNumber
}

export interface IPhoneType {
  label: string
  icon: string
  value: string
}

export interface IContactsResponse {
  id: string
  first_name: string
  last_name: string
  email: string
  active: boolean
  phone: IPhoneResponse
  address: IAddress
}

export interface IContact {
  id: string
  firstName: string
  lastName: string
  email: string
  active: boolean
  phone: IPhone
  address: IAddress
}

export interface INewContact {
  firstName: string
  lastName: string
  email: string
  phone: IPhone
  address: IAddress
}

export interface IContactForm {
  id?: string
  firstName?: string
  lastName?: string
  email?: string
  active?: boolean
  phone?: IPhoneForm
  address?: IAddressForm
}
/*
  As a best practice we should define complex data types individually
  For this demo we are only using 1 address and 1 phone per contact, but its
  concievable that we would want to provide multiple of each for a given contact
*/
