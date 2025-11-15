import { ref, type Ref } from 'vue'
import type { IPhoneType } from './contacts.interface'

export const phoneTypes: Ref<IPhoneType[]> = ref([
  { label: 'Home', value: 'home', icon: 'pi-home' },
  { label: 'Mobile', value: 'mobile', icon: 'pi-mobile' },
  { label: 'Office', value: 'office', icon: 'pi-building' },
])

export function getPhoneType(phoneType: string): IPhoneType | null {
  const phoneDisplayType = phoneTypes.value.find((pt) => pt.value === phoneType)
  return phoneDisplayType ? phoneDisplayType : null
}
