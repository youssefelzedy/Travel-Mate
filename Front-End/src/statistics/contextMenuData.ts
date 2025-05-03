import { faGear } from '@fortawesome/free-solid-svg-icons'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { faClockRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'

enum ContextMenuItemType {
  anchor = 'anchor',
  button = 'button'
}
export interface ContextMenuItem {
  label: string
  type: string
  icon: object
  action?: (event: MouseEvent) => void
  href?: string
}

export const profileButtonContextMenuData: ContextMenuItem[] = [
  {
    label: 'Profile',
    type: ContextMenuItemType.anchor,
    icon: faUser,
    href: '/user/profile'
  },
  {
    label: 'Settings',
    type: ContextMenuItemType.anchor,
    icon: faGear,
    href: '/user/settings'
  },
  {
    label: 'History',
    type: ContextMenuItemType.anchor,
    icon: faClockRotateLeft,
    href: '/user/history'
  },
  {
    label: 'Logout',
    type: ContextMenuItemType.button,
    icon: faRightFromBracket,
    action: () => {}
  }
]

const defaultContextMenuData: ContextMenuItem[] = []
