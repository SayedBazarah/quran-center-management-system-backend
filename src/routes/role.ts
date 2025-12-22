// src/routes/roleRoutes.ts
import { Router } from 'express'
import * as controllers from '@/controllers'
import * as validators from '@/validators'
import { isAuthenticated, requirePermissions } from '@/middlewares'
import { GlobalPermissionCode } from '@/bootstrap/permissionSeeds'

const RoleRouter = Router()

RoleRouter.post(
  '/',
  isAuthenticated,
  requirePermissions(GlobalPermissionCode.CreateBranch),
  validators.createRole,
  controllers.createRole
)
RoleRouter.get(
  '/',
  isAuthenticated,
  requirePermissions(
    GlobalPermissionCode.ReadRole,
    GlobalPermissionCode.CreateAdmin
  ),
  controllers.listRoles
)
RoleRouter.get(
  '/permissions',
  isAuthenticated,
  requirePermissions(
    GlobalPermissionCode.CreateRole,
    GlobalPermissionCode.UpdateRole
  ),
  controllers.listPermissions
)
RoleRouter.patch(
  '/:id',
  isAuthenticated,
  requirePermissions(GlobalPermissionCode.UpdateRole),
  validators.updateRole,
  controllers.updateRoleById
)
RoleRouter.delete(
  '/:id',
  isAuthenticated,
  requirePermissions(GlobalPermissionCode.DeleteRole),
  validators.deleteRole,
  controllers.deleteRoleById
)

export default RoleRouter
