<template>
  <CrudManager :config="config" />
</template>

<script>
import CrudManager from '@/components/realty/CrudManager.vue'
import floorApi from '@/api/floor'
import { unwrapList } from '@/api/crud'

const loadFloors = async () => {
  const { items } = unwrapList(await floorApi.getAll({ per_page: 100 }))
  return items.map((f) => ({
    value: f.id,
    label: f.property?.name ? `${f.property.name} — ${f.name}` : f.name,
  }))
}

export default {
  name: 'UnitsIndex',
  components: { CrudManager },
  data() {
    return {
      config: {
        store: 'units',
        title: 'realty.unit.title',
        subtitle: 'realty.unit.subtitle',
        addLabel: 'realty.unit.add',
        editLabel: 'realty.unit.edit',
        emptyLabel: 'realty.unit.empty',
        permissions: {
          create: 'create_unit',
          edit: 'edit_unit',
          delete: 'delete_unit',
        },
        filters: [{ key: 'floor_id', label: 'realty.unit.floor', optionsLoader: loadFloors }],
        columns: [
          { key: 'name', label: 'realty.unit.name', type: 'primary' },
          { key: 'floor', label: 'realty.unit.floor', get: (row) => row.floor?.name },
          { key: 'area', label: 'realty.unit.area' },
          {
            key: 'monthly_rent',
            label: 'realty.unit.monthly_rent',
            get: (row) =>
              row.monthly_rent === null || row.monthly_rent === undefined
                ? null
                : Number(row.monthly_rent).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }),
          },
          { key: 'tenant', label: 'realty.unit.tenant', get: (row) => row.tenant?.name },
          { key: 'is_active', label: 'realty.common.status', type: 'status' },
        ],
        fields: [
          {
            key: 'floor_id',
            label: 'realty.unit.floor',
            type: 'select',
            required: true,
            lockOnEdit: true,
            optionsLoader: loadFloors,
          },
          { key: 'name', label: 'realty.unit.name', type: 'text', required: true },
          { key: 'area', label: 'realty.unit.area', type: 'number', min: 0 },
          { key: 'monthly_rent', label: 'realty.unit.monthly_rent', type: 'number', min: 0 },
          { key: 'description', label: 'realty.unit.description', type: 'textarea' },
          { key: 'is_active', label: 'realty.common.active', type: 'checkbox' },
        ],
      },
    }
  },
}
</script>
