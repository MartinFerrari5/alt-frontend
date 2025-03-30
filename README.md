## Estructura de Carpetas

```
src/
├── components/
│   ├── admin/
│   │   └── users/
│   │       ├── CompaniesSection.jsx      // Sección de relaciones de compañías (incluye selector)
│   │       ├── ProjectsSection.jsx         // Sección de relaciones de proyectos (usa modal personalizado)
│   │       ├── RelationSection.jsx         // Componente genérico para mostrar relaciones
│   │       ├── EditProjectRelationModal.jsx
│   │       └── UserEditForm.jsx
│   └── layout/
│       └── Sidebar.jsx
├── hooks/
│   └── data/
│       ├── options/
│       │   ├── optionsService.js
│       │   └── relationsService.js
│       └── users/
│           └── useUserHooks.js
├── lib/
│   └── axios.js
├── pages/
│   └── admin/
│       └── UsersDetail.jsx
└── util/
    └── validationSchema.js
```
