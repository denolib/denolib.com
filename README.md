> Notice: Adding a badge can help your module be searched. The search page is in process.

# DenoLib

## Usage

For example:
```sh
deno -A https://denolib.com/denoland/deno_std@v0.2.8/http/file_server.ts
```

```ts
import { test } from "https://denolib.com/denoland/deno_std/testing/mod.ts";
```

## Badge

![DenoLib](https://denolib.com/badge?scope=denolib&repo=denolib.com)

Create `denolib.json` in the root directory.
```json
{
  "name": "denolib.com"
}
```

Markdown:
```md
![DenoLib](https://denolib.com/badge?scope=${scope}&repo=${repo})
```

Optional parameters:
- `style` - you can pass optional `style` parameter with [supported value](https://shields.io/#styles), for example: `![DenoLib](https://denolib.com/badge?scope=${scope}&repo=${repo}&style=${style})` where `const style = "flat-square"`
