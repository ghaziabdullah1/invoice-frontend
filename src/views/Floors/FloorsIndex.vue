<template>
  <CrudManager :config="config" />
</template>

<script>
import CrudManager from '@/components/realty/CrudManager.vue'
import propertyApi from '@/api/property'
import { unwrapList } from '@/api/crud'

const loadProperties = async () => {
  const { items } = unwrapList(await propertyApi.getAll({ per_page: 100 }))
  return items.map((p) => ({ value: p.id, label: p.name }))
}

export default {
  name: 'FloorsIndex',
  components: { CrudManager },
  data() {
    return {
      config: {
        store: 'floors',
        title: 'realty.floor.title',
        subtitle: 'realty.floor.subtitle',
        addLabel: 'realty.floor.add',
        editLabel: 'realty.floor.edit',
        emptyLabel: 'realty.floor.empty',
        permissions: {
          create: 'create_floor',
          edit: 'edit_floor',
          delete: 'delete_floor',
        },
        filters: [
          { key: 'property_id', label: 'realty.floor.property', optionsLoader: loadProperties },
        ],
        columns: [
          { key: 'name', label: 'realty.floor.name', type: 'primary', subKey: 'name_en' },
          { key: 'floor_number', label: 'realty.floor.floor_number' },
          { key: 'property', label: 'realty.floor.property', get: (row) => row.property?.name },
          { key: 'units_count', label: 'realty.floor.units_count' },
          { key: 'is_active', label: 'realty.common.status', type: 'status' },
        ],
        fields: [
          {
            key: 'property_id',
            label: 'realty.floor.property',
            type: 'select',
            required: true,
            lockOnEdit: true,
            optionsLoader: loadProperties,
          },
          { key: 'name', label: 'realty.floor.name', type: 'text', required: true },
          { key: 'name_en', label: 'realty.floor.name_en', type: 'text' },
          { key: 'floor_number', label: 'realty.floor.floor_number', type: 'number', required: true, step: 1 },
          { key: 'description', label: 'realty.floor.description', type: 'textarea' },
          { key: 'is_active', label: 'realty.common.active', type: 'checkbox' },
        ],
      },
    }
  },
}
</script>
