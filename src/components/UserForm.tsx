import * as React from 'react'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQuery } from '@tanstack/react-query'
import type { AnyFieldApi } from '@tanstack/react-form'

function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <em className="text-red-500 text-sm">{field.state.meta.errors.join(', ')}</em>
      ) : null}
      {field.state.meta.isValidating ? <p className="text-blue-500 text-sm">Validando...</p> : null}
    </>
  )
}

class DB {
  private data = { firstName: 'FirstName', lastName: 'LastName' }

  getData() {
    return { ...this.data }
  }

  async saveUser(value: { firstName: string; lastName: string }) {
    this.data = value
    return value
  }
}

const db = new DB()

export default function UserForm() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['user-data'],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 1000))
      return db.getData()
    },
  })

  const saveUserMutation = useMutation({
    mutationFn: async (value: { firstName: string; lastName: string }) => {
      await new Promise((r) => setTimeout(r, 1000))
      return db.saveUser(value)
    },
  })

  const form = useForm({
    defaultValues: {
      firstName: data?.firstName ?? '',
      lastName: data?.lastName ?? '',
    },
    onSubmit: async ({ formApi, value }) => {
      await saveUserMutation.mutateAsync(value)
      await refetch()
      formApi.reset()
    },
  })

  if (isLoading) return <p>Cargando datos del formulario...</p>

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="space-y-6"
    >
      <div>
        <form.Field
          name="firstName"
          validators={{
            onChange: ({ value }) =>
              !value
                ? 'Nombre requerido'
                : value.length < 3
                  ? 'Mínimo 3 caracteres'
                  : undefined,
            onChangeAsyncDebounceMs: 500,
            onChangeAsync: async ({ value }) => {
              await new Promise((r) => setTimeout(r, 1000))
              return (
                value.includes('error') && 'No se permite "error" en el nombre'
              )
            },
          }}
          children={(field) => (
            <>
              <label htmlFor={field.name}>Nombre:</label>
              <input
                className="border rounded px-2 py-1 w-full"
                id={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldInfo field={field} />
            </>
          )}
        />
      </div>
      <div>
        <form.Field
          name="lastName"
          children={(field) => (
            <>
              <label htmlFor={field.name}>Apellido:</label>
              <input
                className="border rounded px-2 py-1 w-full"
                id={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldInfo field={field} />
            </>
          )}
        />
      </div>
      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) => (
          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
              disabled={!canSubmit}
            >
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </button>
            <button
              type="reset"
              onClick={() => form.reset()}
              className="border px-4 py-2 rounded"
            >
              Reiniciar
            </button>
          </div>
        )}
      />
    </form>
  )
}
