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
  swdcTracker.trackEditorAction({
    entity: "editor",
    type: "activate",
    tz_offset_minutes: 420,
    file_name: "test filename",
    file_path: "test/file/path",
    file_syntax: "fortran",
    file_line_count: 10,
    file_character_count: 101,
    project_name: "manhattan",
    project_directory: "top_secret/plans/",
    plugin_id: 1,
    plugin_version: "?.?.?"
  })
  ...
}
```