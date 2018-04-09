## Dependancies

```
npm install --save @angular/material @angular/cdk
```

```
npm install --save @angular/animations
```

## Additions (not needed if src folder is copied instead)

Add to styles.css

```css
@import "~@angular/material/prebuilt-themes/indigo-pink.css";
@import url("https://fonts.googleapis.com/icon?family=Material+Icons");
@import url("https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic");

body {
    font-family: Roboto;
}
```

Add to main.ts

```typescript
import 'hammerjs';
```