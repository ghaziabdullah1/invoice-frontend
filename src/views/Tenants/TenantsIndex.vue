<template>
  <CrudManager :config="config" />
</template>

<script>
import CrudManager from '@/components/realty/CrudManager.vue'
import unitApi from '@/api/unit'
import { unwrapList } from '@/api/crud'

const loadUnits = async () => {
  const { items } = unwrapList(await unitApi.getAll({ per_page: 100 }))
  return items.map((u) => ({
    value: u.id,
    label: u.floor?.name ? `${u.floor.name} — ${u.name}` : u.name,
    disabled: !!u.tenant,
  }))
}

export default {
  name: 'TenantsIndex',
  components: { CrudManager },
  data() {
    return {
      config: {
        store: 'tenants',
        title: 'realty.tenant.title',
        subtitle: 'realty.tenant.subtitle',
        addLabel: 'realty.tenant.add',
        editLabel: 'realty.tenant.edit',
        emptyLabel: 'realty.tenant.empty',
        permissions: {
          create: 'create_tenant',
          edit: 'edit_tenant',
          delete: 'delete_tenant',
        },
        filters: [{ key: 'unit_id', label: 'realty.tenant.unit', optionsLoader: loadUnits }],
        columns: [
          { key: 'name', label: 'realty.tenant.name', type: 'primary' },
          { key: 'phone', label: 'realty.tenant.phone' },
          { key: 'email', label: 'realty.tenant.email' },
          { key: 'unit', label: 'realty.tenant.unit', get: (row) => row.unit?.name },
          { key: 'is_active', label: 'realty.common.status', type: 'status' },
        ],
        fields: [
          { key: 'unit_id', label: 'realty.tenant.unit', type: 'select', optionsLoader: loadUnits },
          { key: 'name', label: 'realty.tenant.name', type: 'text', required: true },
          { key: 'phone', label: 'realty.tenant.phone', type: 'text' },
          { key: 'email', label: 'realty.tenant.email', type: 'email' },
          { key: 'id_number', label: 'realty.tenant.id_number', type: 'text' },
          { key: 'notes', label: 'realty.tenant.notes', type: 'textarea' },
          { key: 'is_active', label: 'realty.common.active', type: 'checkbox' },
        ],
      },
    }
  },
}
</script>
