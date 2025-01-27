# Documentación de comandos del archivo `package.json`

A continuación, se describen los comandos incluidos en la sección `scripts` del archivo `package.json`:

---

## 1. **`dev`**

```bash
npm run dev
```

### Descripción:

Este comando inicia el servidor de desarrollo utilizando **Vite**.

- **Uso:** Ideal para el desarrollo local. Permite recargar los cambios automáticamente (HMR - Hot Module Replacement) cuando modificas los archivos del proyecto.

---

## 2. **`build`**

```bash
npm run build
```

### Descripción:

Realiza la compilación de producción utilizando **Vite**.

- **Salida:** Genera los archivos optimizados en la carpeta `dist` (o en la carpeta configurada).
- **Uso:** Se utiliza para preparar el proyecto para producción.

---

## 3. **`lint`**

```bash
npm run lint
```

### Descripción:

Ejecuta ESLint para analizar el código y encontrar errores o problemas de estilo en los archivos con extensiones `.js` y `.jsx`.

- **Opciones utilizadas:**

  - `--ext js,jsx`: Define las extensiones de los archivos a analizar.
  - `--report-unused-disable-directives`: Muestra advertencias si hay directivas `eslint-disable` innecesarias.
  - `--max-warnings 0`: No permite advertencias; cualquier advertencia se considera un error.

- **Uso:** Útil para mantener un código limpio y sin errores de estilo o sintaxis.

---

## 4. **`preview`**

```bash
npm run preview
```

### Descripción:

Inicia un servidor para previsualizar el resultado de la compilación de producción.

- **Uso:** Se utiliza para revisar cómo se verá el proyecto antes de implementarlo en producción. Necesita que el comando `build` haya sido ejecutado previamente.

---

## 5. **`prepare`**

```bash
npm run prepare
```

### Descripción:

Ejecuta **Husky** para configurar hooks de Git en el proyecto.

- **Uso:** Este comando se ejecuta automáticamente después de instalar las dependencias (gracias a la configuración de Husky en los scripts de instalación). Sirve para preparar los hooks de Git, como `pre-commit` o `pre-push`.

---

## Ejemplo de uso combinado

1. Ejecuta `npm run dev` para trabajar en el proyecto en un entorno de desarrollo.
2. Usa `npm run lint` para verificar que el código esté limpio antes de realizar un commit.
3. Ejecuta `npm run build` y luego `npm run preview` para revisar el proyecto antes de implementarlo.
