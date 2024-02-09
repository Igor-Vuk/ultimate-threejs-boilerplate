# THREE.JS BOILERPLATE

This is a starting point with most useful features already implemented.

## How to use it?

1. run `npm install`
2. run `npm run dev`
3. project will automatically open in your browser
4. to **view it on mobile**, after running `npm install` look for the **Network** address in the console.
5. `npm run preview` to locally preview the production build
6. run `npm run build` to build for deployment. This will also create `stats.html` file which is a **Rollup Visualizer**

## What does it include?

- `three`, `react-three/drei` and `react-three-fiber` installed and configure
- `vite` and `vite.config.js` file. `Rollup` is used for bundling
- `leva` GUI installed and configured to be used with basic features needed for webgl:

  - _canvas control_
  - _camera control_
  - _controls control_
  - _directional light control_
  - _shadow camera control_
  - _soft shadow control_
  - _environment map control_
  - _axes helper control_
  - _grid helper control_
  - _performance monitor(Perf) control_

  To show/hide the GUI press **"h"** on the keyboard.

  This features can be easily turned off/on or changed.

  Leva also exports `set` function that can be used to control it outside of GUI

- `preparation` for easy loding and implementation:
  - **model loading** - takes compressed and nonrmal version (.glb),
  - **texture loading** - add any texture (diffuse, AO...),
  - **environment map loading**
  - **action, morph, skinned animation loading** - just play different type of animations
  - **curve loading and follow path** - by loading `.json` file with vertices coordinate and calling the `curveMethod` function we can load curves as a mesh or make object follow them (example included)
- `Suspense` for loading included with option to use **fallback** or **Loader** from drei

- `eslint` and `.eslintrc` configured for linting the files
- `prettier` and `prettierrc.json` configured for code formatting

  - recommended VSCode extensions are: **ESlin** and **Prettier ESLint** in order to make linting and formatting live while typing

- `style.css` file for styling

## What is the starting model being used?

Starting model is a simple model made on **Blender** exported with Draco compression and imported in three.js. We are also loading basic **diffuse texture** and **environment map**

Model contains **morph(Shape key)** and normal **keyframes** animation
