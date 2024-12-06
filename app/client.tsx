/// <reference types="vinxi/types/client" />

import { createRouter } from '@app/router'
import { StartClient } from '@tanstack/start'
import { hydrateRoot } from 'react-dom/client'

const router = createRouter()

export default hydrateRoot(document, <StartClient router={router} />)
