import { createRoute } from '@tanstack/react-router'
import type { RootRoute } from '@tanstack/react-router'
import { DemoForm } from '@/hooks/demo.form'
import ProtectedRoute from '@/hooks/RutasProtejidas'



export default (parentRoute: RootRoute) =>
  createRoute({
    path: '/demo/form/Pokemon',
    component: () => (
      <ProtectedRoute>
        <DemoForm />
      </ProtectedRoute>
    ),
    getParentRoute: () => parentRoute,
  })
