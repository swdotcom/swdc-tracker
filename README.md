# swdc-tracker

Sends data to snowplow. Use this to track events in plugins written in js.

## example usage

extension.ts
```ts

import swdcTracker from 'swdc-tracker'

// initialize it once with the backend api host, namespace and appId
swdcTracker.initialize("https://api.software.com", "codetime-events", "codetime-vscode")

```


./Utils.ts
```ts

import swdcTracker from 'swdc-tracker'

export function openSomeFile() {
  swdcTracker.trackEditorAction("file", "open", 420)
  ...
}
```