# Shopping-List

Copy all this in your /src folder and add following dependencies.

## Dependencies

```
npm install --save @angular/material @angular/cdk
```

```
npm install --save @angular/animations
```

```
npm install --save hammerjs
```

## Additions (if copying app folder only)

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
