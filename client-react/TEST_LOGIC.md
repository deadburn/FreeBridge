/\*\*

- PRUEBA DE LÓGICA DE COMPATIBILIDAD DE PROFESIONES
-
- Casos de Prueba:
-
- TEST 1: Freelancer "desarrollador" + Vacante "desarrollador"
- - Esperado: COMPATIBLE (sin modal)
-
- TEST 2: Freelancer "diseñador" + Vacante "desarrollador"
- - Esperado: INCOMPATIBLE (mostrar modal)
-
- TEST 3: Freelancer "desarrollador" + Vacante "diseño"
- - Esperado: INCOMPATIBLE (mostrar modal)
-
- TEST 4: Freelancer "especialista" + Vacante "marketing"
- - Esperado: COMPATIBLE (sin modal)
-
- ***
-
- LÓGICA DE VALIDACIÓN:
-
- 1.  getProfessionCategory("desarrollador") → "desarrollo"
- 2.  detectVacancyCategory("Desarrollador Web") → busca en keywords → "desarrollo"
- 3.  isVacancyCompatible() → "desarrollo" === "desarrollo" → true (no modal)
-
- Si categorías son iguales: SIN MODAL (no mostrar incompatibilidad)
- Si categorías son diferentes: CON MODAL (mostrar advertencia)
  \*/
