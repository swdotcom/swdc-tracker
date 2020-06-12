# swdc-tracker

Sends data to snowplow. Use this to track events in plugins written in js.

## Install

```
yarn add swdc-tracker
```

## Usage

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
    jwt: jwt,
    entity: "editor",
    type: "activate",
    tz_offset_minutes: 420,
    file_name: "your_file.js",
    file_path: "/path/to/your_file.js",
    file_syntax: "javascript",
    file_line_count: 10,
    file_character_count: 100,
    project_name: "your_project_name",
    project_directory: "/path/to/your/project",
    plugin_id: 1,
    plugin_version: "1.2.3"
  })
  ...
}
```

# Development

## Install Deps
```
yarn
```

## Build

```
yarn build
```
