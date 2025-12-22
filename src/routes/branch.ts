// src/routes/branchRoutes.ts
import { Router } from 'express'

import * as controllers from '@/controllers'
import * as validators from '@/validators'
import { isAuthenticated, requirePermissions } from '@/middlewares'
import { GlobalPermissionCode } from '@/bootstrap/permissionSeeds'

const BranchRouter = Router()

BranchRouter.post(
  '/',
  isAuthenticated,
  requirePermissions(GlobalPermissionCode.CreateBranch),
  validators.createBranch,
  controllers.createBranch
)
BranchRouter.get('/', isAuthenticated, controllers.listBranches)
BranchRouter.get(
  '/all',
  isAuthenticated,
  requirePermissions(GlobalPermissionCode.ReadBranch),

  controllers.listAllBranches
)
BranchRouter.patch(
  '/:id',
  isAuthenticated,
  requirePermissions(GlobalPermissionCode.UpdateBranch),
  validators.updateBranch,
  controllers.updateBranchById
)
BranchRouter.delete(
  '/:id',
  isAuthenticated,
  requirePermissions(GlobalPermissionCode.DeleteBranch),
  validators.deleteBranch,
  controllers.deleteBranchById
)

export default BranchRouter
