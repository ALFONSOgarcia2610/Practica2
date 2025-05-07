import { createRoute } from '@tanstack/react-router'
import type { RootRoute } from '@tanstack/react-router'
import { DemoForm } from '@/hooks/demo.form-context'
import ProtectedRoute from '@/hooks/RutasProtejidas'



export default (parentRoute: RootRoute) =>
  createRoute({
    path: '/demo/form/Clima',
    component: () => (
      <ProtectedRoute>
        <DemoForm />
      </ProtectedRoute>
    ),
    getParentRoute: () => parentRoute,
  })
