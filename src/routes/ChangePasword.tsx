
import { createRoute } from '@tanstack/react-router'
import type { RootRoute } from '@tanstack/react-router'
import ProtectedRoute from '@/hooks/RutasProtejidas'
import { ChangePasswordForm } from '@/hooks/Cambio'

export default (parentRoute: RootRoute) =>
  createRoute({
    path: '/demo/form/changepassword',
    component: () => (
      <ProtectedRoute>
        <ChangePasswordForm />
      </ProtectedRoute>
    ),
    getParentRoute: () => parentRoute,
  })