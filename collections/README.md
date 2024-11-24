# Guía para Ejecutar las Colecciones de Pruebas en Postman

Este proyecto contiene colecciones de pruebas para validar el correcto funcionamiento de las APIs relacionadas con **Diagnósticos**, **Pacientes**, **Médicos**, y **Paciente-Médico**. Asegúrate de ejecutar las colecciones en el orden especificado para garantizar la integridad de las precondiciones y el flujo de las pruebas.

---

## Orden de Ejecución de las Colecciones

### 1. **Diagnósticos**
Ejecuta las pruebas de la colección de **Diagnósticos** para validar las funcionalidades básicas relacionadas con la creación y consulta de diagnósticos. Esta colección debe ejecutarse primero, ya que su funcionamiento puede ser una precondición para colecciones posteriores.

---

### 2. **Pacientes**
Ejecuta las pruebas de la colección de **Pacientes** para validar la creación y gestión de datos de pacientes. Asegúrate de que los pacientes creados tengan atributos válidos que puedan ser utilizados en pruebas posteriores.

---

### 3. **Médicos**
Ejecuta las pruebas de la colección de **Médicos** para garantizar que la información de los médicos se gestiona correctamente. Estas pruebas también se basan en datos válidos para garantizar las precondiciones.

---

### 4. **Paciente-Médico**
La colección **Paciente-Médico** incluye pruebas que relacionan pacientes con médicos. Para garantizar que estas relaciones sean evaluadas correctamente:

- **Repite la primera prueba colección cinco veces antes de continuar con la última prueba de esta misma colección**. Esto asegura que se cumplan las precondiciones necesarias para evaluar el comportamiento en escenarios repetitivos.

---

## Notas Importantes

1. **Precondiciones**: 
   - Algunas pruebas en las colecciones validan precondiciones específicas (por ejemplo, que existan pacientes, médicos, o diagnósticos previos). 
   - Asegúrate de ejecutar las colecciones en el orden indicado para garantizar que estas precondiciones se cumplan.

2. **Verificación manual de resultados**: 
   - Si alguna prueba falla, verifica que los datos requeridos (como IDs o relaciones) estén configurados correctamente antes de volver a ejecutar la prueba.

3. **Entorno Postman**:
   - Configura un entorno en Postman con las variables necesarias (como `base_url`) antes de comenzar la ejecución de las colecciones.

4. **Ejecuciones iterativas**:
   - Para la colección **Paciente-Médico**, utiliza la funcionalidad de iteraciones de Postman o ejecútala manualmente cinco veces antes de ejecutar la prueba final.

---

## Ejecución de Pruebas

1. Importa las colecciones en Postman desde la carpeta `/collections`.
2. Configura el entorno necesario para las variables globales o de entorno.
3. Ejecuta las colecciones en el orden mencionado:
   - Diagnósticos
   - Pacientes
   - Médicos
   - Paciente-Médico
4. Asegúrate de seguir las indicaciones específicas para la colección **Paciente-Médico** (repetir 5 veces antes de la última prueba).

---