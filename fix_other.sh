sed -i 's/const firstRegisteredId = mockRegister\.mock\.calls\[0\]\[0\];/const firstRegisteredId = mockRegister.mock.calls[0]?.[0];/g' src/components/Interactable.test.tsx
sed -i 's/const secondRegisteredId = mockRegister\.mock\.calls\[1\]\[0\];/const secondRegisteredId = mockRegister.mock.calls[1]?.[0];/g' src/components/Interactable.test.tsx
sed -i 's/posSubscription(/posSubscription?.(/g' src/components/Player.test.tsx
sed -i 's/import React, { useEffect, useMemo, useRef, useId, useState } from '\''react'\'';/import React, { useEffect, useMemo, useRef, useId } from '\''react'\'';/g' src/components/Interactable.tsx
