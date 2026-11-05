<template>
  <CrudManager :config="config" />
</template>

<script>
import CrudManager from '@/components/realty/CrudManager.vue'

const PROPERTY_TYPES = ['residential', 'commercial', 'mixed', 'industrial']

export default {
  name: 'PropertiesIndex',
  components: { CrudManager },
  data() {
    const loadTypes = async () =>
      PROPERTY_TYPES.map((value) => ({ value, label: this.$t(`realty.property.types.${value}`) }))

    return {
      config: {
        store: 'properties',
        title: 'realty.property.title',
        subtitle: 'realty.property.subtitle',
        addLabel: 'realty.property.add',
        editLabel: 'realty.property.edit',
        emptyLabel: 'realty.property.empty',
        permissions: {
          create: 'create_property',
          edit: 'edit_property',
          delete: 'delete_property',
        },
        columns: [
          { key: 'name', label: 'realty.property.name', type: 'primary', subKey: 'name_en' },
          {
            key: 'type',
            label: 'realty.property.type',
            get: (row) => (row.type ? this.$t(`realty.property.types.${row.type}`) : null),
          },
          { key: 'city', label: 'realty.property.city' },
          { key: 'phone', label: 'realty.property.phone' },
          { key: 'floors_count', label: 'realty.property.floors_count' },
          { key: 'is_active', label: 'realty.common.status', type: 'status' },
        ],
        fields: [
          { key: 'name', label: 'realty.property.name', type: 'text', required: true },
          { key: 'name_en', label: 'realty.property.name_en', type: 'text' },
          { key: 'type', label: 'realty.property.type', type: 'select', required: true, optionsLoader: loadTypes },
          { key: 'city', label: 'realty.property.city', type: 'text' },
          { key: 'phone', label: 'realty.property.phone', type: 'text' },
          { key: 'email', label: 'realty.property.email', type: 'email' },
          { key: 'address', label: 'realty.property.address', type: 'textarea' },
          { key: 'notes', label: 'realty.property.notes', type: 'textarea' },
          { key: 'is_active', label: 'realty.common.active', type: 'checkbox' },
        ],
      },
    }
  },
}
</script>
