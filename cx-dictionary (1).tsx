import { useState, useMemo, useEffect, useRef } from "react";

const LOGO = "https://i.ibb.co/G34MTqPF/Logo.png";
const MASCOTA = "https://i.ibb.co/ccQ1WSCJ/expert-diccionario-sin-fondo.png";

const COLORS = {
  inspiracion:"#3BCEAC",interpretacion:"#0A2463",diseno:"#5A67D8",
  testeo:"#F59E0B",implementacion:"#EC4899",medicion:"#10B981",
};
const LABELS = {
  inspiracion:"Inspiracion",interpretacion:"Interpretacion",diseno:"Diseno",
  testeo:"Testeo",implementacion:"Implementacion",medicion:"Medicion"
};
const MONTSERRAT = `@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap'); * { font-family: 'Montserrat', sans-serif !important; }`;
const ADMIN_KEY = "emtelco2025cx";
const today = () => new Date().toISOString().slice(0,10);

const storage = {
  get:(k)=>{ try{const v=localStorage.getItem(k);return v?{value:v}:null;}catch{return null;} },
  set:(k,v)=>{ try{localStorage.setItem(k,v);return true;}catch{return null;} },
  list:(p='')=>{ try{return{keys:Object.keys(localStorage).filter(k=>k.startsWith(p))};}catch{return{keys:[]};} }
};

function saveVisit(){
  const k=`visits:${today()}`;
  storage.set(k,String((parseInt(storage.get(k)?.value||'0'))+1));
}
function saveSearch(term){
  const k=`searches:${today()}:${term.toLowerCase()}`;
  storage.set(k,String((parseInt(storage.get(k)?.value||'0'))+1));
  const hk=`history:${today()}`;
  let arr=[];try{arr=JSON.parse(storage.get(hk)?.value||'[]');}catch{}
  arr.push({term,time:new Date().toLocaleTimeString('es-CO',{hour:'2-digit',minute:'2-digit'})});
  if(arr.length>50)arr=arr.slice(-50);
  storage.set(hk,JSON.stringify(arr));
}
function saveCardView(name){
  const k=`card:${name.toLowerCase()}`;
  storage.set(k,String((parseInt(storage.get(k)?.value||'0'))+1));
}

const T = [
  {id:1,c:"inspiracion",n:"Arquetipos y Mapas de Empatia",d:"Representaciones detalladas de tipos de clientes reales construidas con datos.",s:"En lugar de hablar de el cliente como si todos fueran iguales, creamos personajes concretos con nombre, edad, necesidades y frustraciones.",e:"Una empresa identifica 4 arquetipos: Cliente Digital, Cliente Tradicional, Cliente Empresarial y Cliente Nuevo.",v:"Cuando el equipo disenha pensando en personas concretas, los resultados conectan mejor con la realidad."},
  {id:2,c:"inspiracion",n:"Bench (Benchmarking)",d:"Proceso de comparacion sistematica de los procesos y metricas propios contra los de las mejores empresas del sector.",s:"Es mirar como hacen las cosas los mejores para aprender y mejorar.",e:"Una empresa compara su NPS (35) con el promedio del sector (42) y con Amazon (72).",v:"Evita la trampa de compararse solo contra uno mismo."},
  {id:3,c:"inspiracion",n:"Ciencias del Comportamiento",d:"Campo interdisciplinario que incluye psicologia, economia conductual y neurociencia.",s:"Es la ciencia que estudia por que hacemos lo que hacemos.",e:"Explica por que los clientes eligen el plan del medio en un menu de 3 opciones.",v:"Aplicar ciencias del comportamiento hace que las estrategias sean mucho mas efectivas."},
  {id:4,c:"inspiracion",n:"Customer Feedback",d:"Informacion directa de los clientes sobre su experiencia.",s:"Es todo lo que los clientes dicen sobre su experiencia.",e:"Las 5 palabras mas frecuentes en el feedback negativo: espera, confuso, factura, transferencia, volver.",v:"El feedback es informacion gratuita y directa."},
  {id:5,c:"inspiracion",n:"Customer Insights",d:"Conclusiones profundas y accionables extraidas del analisis integrado de multiples fuentes de datos.",s:"Un dato te dice que paso. Un insight te dice por que paso.",e:"El dato: 40% llaman dos veces. Insight: no explican la causa raiz.",v:"Actuar sobre datos sin insight lleva a soluciones que no atacan la causa raiz."},
  {id:6,c:"inspiracion",n:"Diagnostico de Experiencia",d:"Evaluacion integral del estado actual de la experiencia del cliente.",s:"Es hacerle una resonancia magnetica completa a la relacion con los clientes.",e:"El diagnostico revela: NPS de 32, 68% de reclamos relacionados con facturacion.",v:"Sin diagnostico, las empresas invierten en mejorar lo que creen que esta mal."},
  {id:7,c:"inspiracion",n:"Journey Analytics",d:"Analisis de datos del recorrido completo del cliente a traves de multiples canales.",s:"Es usar datos para ver la pelicula completa del cliente, no solo escenas aisladas.",e:"Clientes que usan la app en su primera semana tienen retencion del 91%.",v:"Conecta los puntos entre canales que antes se analizaban por separado."},
  {id:8,c:"inspiracion",n:"Mapa del Comportamiento",d:"Representacion visual basada en datos reales que muestra como actuan los clientes.",s:"La gente no siempre hace lo que dice. El mapa registra lo que realmente ocurre.",e:"70% dice preferir app pero el 65% la abandona a la mitad y termina llamando.",v:"Disenar basado en comportamientos reales es mucho mas efectivo."},
  {id:9,c:"inspiracion",n:"Medicion del Comportamiento",d:"Analisis cuantitativo basado en datos reales sobre como actuan los clientes.",s:"En lugar de preguntarle al cliente que hace, medimos lo que realmente hace.",e:"55% de clientes que llaman visitaron la seccion de ayuda 30 minutos antes.",v:"El comportamiento real es la fuente mas honesta de insights."},
  {id:10,c:"inspiracion",n:"Segmentacion de Clientes",d:"Proceso de agrupacion de clientes en conjuntos homogeneos con base en caracteristicas compartidas.",s:"En lugar de tratar a todos igual, los dividimos en grupos segun lo que tienen en comun.",e:"Segmento A (empresas), Segmento B (residenciales), Segmento C (esporadicos).",v:"La segmentacion es el paso previo a la personalizacion."},
  {id:11,c:"inspiracion",n:"Voz del Cliente (VoC)",d:"Proceso sistematico de recoleccion, analisis e interpretacion de lo que los clientes dicen.",s:"Es prestarle oido a los clientes de verdad.",e:"Analizan 500 grabaciones y descubren que la palabra mas repetida es confuso.",v:"Permite tomar decisiones basadas en la realidad del cliente."},
  {id:12,c:"interpretacion",n:"CJM / Mapa de Experiencia",d:"Representacion visual del recorrido completo que hace un cliente al interactuar con la empresa.",s:"Es la historia de vida del cliente con nuestra empresa, dibujada en un mapa.",e:"Detecta la falla (molesto) > Busca numero (frustrado) > Espera 8 min > Resuelven (satisfecho).",v:"Sin el mapa, la empresa ve fragmentos. Con el, ve la pelicula completa."},
  {id:13,c:"interpretacion",n:"Emociones del Cliente",d:"Los estados afectivos que experimenta el cliente en cada punto de contacto.",s:"Cada vez que un cliente interactua siente algo. Esas emociones determinan si se queda o se va.",e:"Marca el numero (ansiedad) > Espera (frustracion) > Agente calido (alivio) > Resolucion (satisfaccion).",v:"Disenar experiencias que generen las emociones correctas es la estrategia mas poderosa."},
  {id:14,c:"interpretacion",n:"Expectativas del Cliente",d:"Creencias previas del cliente sobre como deberia ser el servicio.",s:"Las expectativas definen si la experiencia se percibe como buena, normal o mala.",e:"Slogan Te atendemos en menos de 1 minuto ancla expectativas. 3 minutos decepciona.",v:"Gestionar las expectativas es tan importante como mejorar el servicio."},
  {id:15,c:"interpretacion",n:"Experiencia del Cliente (CX)",d:"La suma total de percepciones, emociones y recuerdos que un cliente acumula al interactuar con una empresa.",s:"CX no es un momento, es una pelicula completa.",e:"Ana contrata internet. Proceso facil (+), tecnico tarde (-), soporte 20 min espera (-).",v:"Mejorar CX fideliza y reduce cancelaciones."},
  {id:16,c:"interpretacion",n:"Insight de Cliente",d:"Comprension profunda y accionable sobre las motivaciones reales de los clientes.",s:"Un dato te dice que paso. Un insight te dice por que paso.",e:"45% llama para consultar saldo. Insight: no confian en los cobros.",v:"Un insight verdadero puede transformar completamente una estrategia."},
  {id:17,c:"interpretacion",n:"Mapa de Escenarios Futuros",d:"Herramienta que visualiza como deberia ser la experiencia ideal del cliente en el futuro.",s:"Imaginamos como queremos que se sienta el cliente en 2 o 3 anos y lo dibujamos.",e:"Escenario 2027: el cliente resuelve cualquier solicitud en menos de 3 minutos.",v:"Evita que las mejoras sean reactivas y desconectadas."},
  {id:18,c:"interpretacion",n:"Momentos de Verdad",d:"Instantes criticos donde la empresa puede generar una impresion muy positiva o muy negativa.",s:"Son los momentos que el cliente nunca olvida.",e:"Pedro lleva 3 horas sin internet. El agente resuelve en 2 min y ofrece descuento. Pedro renueva.",v:"Identificar momentos de verdad permite enfocar recursos donde mas impactan."},
  {id:19,c:"interpretacion",n:"Percepcion del Cliente",d:"La interpretacion subjetiva que hace cada cliente de su experiencia.",s:"La percepcion es la realidad que importa en CX.",e:"Misma llamada: 4 min espera. Cliente A: fue rapido. Cliente B: espere una eternidad.",v:"Medir la percepcion es la unica forma de saber como se vive realmente el servicio."},
  {id:20,c:"interpretacion",n:"Propuesta de Valor",d:"La razon especifica por la que un cliente deberia elegir tu empresa sobre la competencia.",s:"Es responder la pregunta mas dificil: por que tu y no otro.",e:"Fuerte: Si tu internet falla, tecnico en menos de 4 horas o te devolvemos el mes.",v:"Sin propuesta de valor clara, los clientes eligen por precio."},
  {id:21,c:"interpretacion",n:"Touchpoints",d:"Todos los momentos en que un cliente entra en contacto con la empresa.",s:"Son las puertas de entrada a tu empresa.",e:"Ver el anuncio > llamar > firmar contrato > visita tecnico > primera factura > soporte.",v:"Identificar todos los puntos de contacto permite disenar cada uno con intencion."},
  {id:22,c:"interpretacion",n:"UX vs CX",d:"UX es la experiencia al usar un producto digital. CX es la experiencia completa con la empresa.",s:"UX es como te sientes usando la app. CX es todo lo demas tambien.",e:"App excelente (UX=9/10) pero al perder tarjeta lo transfieren 3 veces (CX=4/10).",v:"Una buena UX no garantiza una buena CX."},
  {id:23,c:"diseno",n:"Arquitectura de la Informacion",d:"Disciplina que organiza y estructura el contenido para que los usuarios naveguen de forma intuitiva.",s:"Es el arte de organizar la informacion para que sea facil de encontrar.",e:"IVR con 12 opciones: 45% llegaban al area equivocada. Rediseno a 4 categorias: solo 8%.",v:"Una mala arquitectura es invisible hasta que la gente se pierde."},
  {id:24,c:"diseno",n:"Behavioral Design",d:"Aplicacion de principios de psicologia del comportamiento al diseno de servicios.",s:"Es disenar con el conocimiento de como funciona la mente humana.",e:"Recordatorio + barra de progreso + boton de pago + norma social = pago puntual +28%.",v:"Logra cambios de comportamiento sin obligar ni pedir esfuerzo extra."},
  {id:25,c:"diseno",n:"Blueprint (Service Blueprint)",d:"Herramienta visual que mapea todos los componentes de un servicio.",s:"Es como el mapa de un iceberg: muestra lo que el cliente ve y todo lo que hay debajo.",e:"Blueprint de instalacion: experiencia cliente + acciones tecnico + procesos internos.",v:"Permite encontrar cuellos de botella. Es imposible mejorar lo que no puedes ver."},
  {id:26,c:"diseno",n:"Canvas",d:"Plantilla visual que permite disenar un modelo de servicio completo en una sola pagina.",s:"Es un lienzo dividido en secciones que muestran todo lo importante.",e:"Canvas para soporte premium: segmento empresarial, propuesta resolucion 2 horas.",v:"Facilita conversaciones estrategicas porque todos miran lo mismo."},
  {id:27,c:"diseno",n:"Customer Centricity",d:"Filosofia en la que el cliente es el centro de todas las decisiones estrategicas y operativas.",s:"Es cuando toda la empresa pregunta: como afecta esto a nuestros clientes.",e:"TI cambia actualizaciones de lunes 9 AM a domingo 3 AM para no afectar clientes.",v:"Mejorar la experiencia deja de ser responsabilidad de una sola area."},
  {id:28,c:"diseno",n:"Design Thinking",d:"Metodologia de innovacion centrada en las personas con 5 fases: Empatizar, Definir, Idear, Prototipar y Testear.",s:"Es resolver problemas partiendo de entender profundamente a las personas.",e:"Acompanan instalaciones, identifican problema, crean notificacion de progreso. Satisfaccion +24%.",v:"Evita el error mas costoso: crear soluciones para el problema equivocado."},
  {id:29,c:"diseno",n:"Diseno Conversacional",d:"Disciplina para crear dialogos naturales entre personas y sistemas automatizados.",s:"Es disenar como habla un sistema automatizado para que parezca humano.",e:"Sin diseno: Opcion invalida. Con diseno: tienes una pregunta sobre tu factura o servicio?",v:"El 70% de los clientes con mala experiencia con chatbot no vuelven a usarlo."},
  {id:30,c:"diseno",n:"Diseno de Servicios",d:"Disciplina que planifica integralmente todos los componentes de un servicio.",s:"Disenar un servicio va mas alla de crear una app o un protocolo.",e:"Instalacion: agendamiento digital + recordatorio con foto tecnico + encuesta 24h.",v:"Un servicio bien disenado funciona para el cliente Y para el equipo."},
  {id:31,c:"diseno",n:"Flujos de Interaccion",d:"Representacion visual del camino paso a paso que sigue un usuario dentro de una app.",s:"Es el mapa del camino que recorre el cliente dentro de una app.",e:"Reportar falla: Abrir app > Soporte > Tipo > Describir > Confirmar > Numero de caso.",v:"Disenar flujos antes de construir la app ahorra tiempo y dinero."},
  {id:32,c:"diseno",n:"Framework",d:"Estructura metodologica que organiza el pensamiento para abordar problemas de CX de manera sistematica.",s:"Imaginalo como el plano de un arquitecto: tienes los pasos claros antes de construir.",e:"Empresa adopta Design Thinking: todos siguen los mismos 5 pasos.",v:"Evita reinventar la rueda y garantiza que el equipo trabaje con el mismo metodo."},
  {id:33,c:"diseno",n:"Ideacion",d:"Fase del proceso de diseno centrada en generar la mayor cantidad posible de ideas creativas.",s:"Es la sesion de vale todo antes de la sesion de seamos realistas.",e:"Problema: clientes abandonan tras 3 min de espera. 45 min generan 60 ideas.",v:"La mayoria de las mejores soluciones no son las primeras que se ocurren."},
  {id:34,c:"diseno",n:"Marco 38s",d:"Framework de CX que estructura la transformacion en fases: Entender, Disenar, Implementar y Medir.",s:"Es la hoja de ruta completa para transformar la experiencia sin perderse.",e:"Facturacion: investiga > redisena con lenguaje simple > lanza > llamadas bajaron 35%.",v:"Sin un marco, las empresas implementan soluciones sin entender el problema real."},
  {id:35,c:"diseno",n:"Marco COM-B",d:"Modelo que establece que para adoptar algo nuevo se necesita Capacidad, Oportunidad y Motivacion.",s:"Si falta cualquiera de los tres, el cambio no ocurre.",e:"Autopago: tutorial + app ligera + descuento 5% = adopcion exitosa.",v:"Evita crear soluciones que la gente no adopta porque falta alguno de los tres elementos."},
  {id:36,c:"diseno",n:"Marco de Actuacion",d:"Guia practica que define como deben responder los colaboradores ante situaciones especificas.",s:"Es el libro de jugadas del equipo para momentos dificiles.",e:"Cliente furioso: 1 Escucha 2 Valida 3 Asume responsabilidad 4 Explica solucion 5 Compensa.",v:"Sin marco, cada agente improvisa. Con el marco, la experiencia es predecible."},
  {id:37,c:"diseno",n:"Marcos de Implementacion Comportamental",d:"Estructuras que aplican psicologia del comportamiento para facilitar la adopcion de nuevos comportamientos.",s:"Hacen que la opcion correcta sea la mas natural.",e:"El 85% de clientes resuelven esto en la app en menos de 2 minutos.",v:"Los cambios de comportamiento se facilitan ajustando el contexto y las opciones."},
  {id:38,c:"diseno",n:"Master Flow (Flujo Experto)",d:"Flujo de diseno de nivel muy alto que mapea en detalle todas las decisiones, validaciones, reglas de negocio, excepciones y tiempos estimados.",s:"Es el plano completo del bot: muestra absolutamente todo lo que puede pasar en una conversacion.",e:"Bot de ventas con 5 momentos: identificacion, comprension, especificacion, presentacion y validacion.",v:"Sin el Master Flow el equipo tecnico improvisa. Con el, el desarrollo es preciso."},
  {id:39,c:"diseno",n:"Matriz de Priorizacion",d:"Herramienta que ordena iniciativas segun impacto en el cliente y esfuerzo de implementacion.",s:"Cuando tienes 20 ideas pero recursos para 3, la matriz te dice cuales elegir.",e:"Simplificar IVR: alto impacto + bajo costo. Nueva app: alto impacto + alto costo.",v:"Sin priorizacion, los equipos trabajan en lo urgente o lo que mas les gusta."},
  {id:40,c:"diseno",n:"Mindspace",d:"Framework que identifica 9 factores psicologicos que influyen en las decisiones humanas.",s:"Es una guia que explica por que la gente toma ciertas decisiones.",e:"Por defecto + norma social + incentivo: adopcion de pago automatico sube de 20% a 65%.",v:"Ayuda a disenar servicios que van con la naturaleza humana."},
  {id:41,c:"diseno",n:"Service Design Thinking",d:"Aplicacion del Design Thinking al diseno integral de servicios.",s:"Va mas alla de la experiencia del cliente y tambien disena la del colaborador.",e:"Entrevistan clientes Y tecnicos. Descubren que el tecnico llega sin historial. Disenan solucion.",v:"Produce servicios buenos para el cliente y viables para la empresa."},
  {id:42,c:"diseno",n:"Starter Flow (Flujo Esencial)",d:"Flujo de diseno de nivel medio que visualiza las decisiones clave sin entrar en niveles tecnicos avanzados.",s:"Es el borrador estrategico del bot: muestra las rutas principales sin detallar reglas ni excepciones.",e:"Bot de soporte: autenticacion > identificacion del problema > solucion automatica o transferencia.",v:"Permite alinear al cliente y al equipo tecnico antes de invertir en el desarrollo completo."},
  {id:43,c:"testeo",n:"Card Sorting",d:"Tecnica en la que usuarios organizan tarjetas con conceptos segun su propio criterio logico.",s:"Le damos a los clientes tarjetas y les pedimos que las agrupen como les parezca natural.",e:"30 clientes agrupan facturacion y cambiar plan juntos pero el menu los tiene separados.",v:"Los menus disenados con card sorting tienen hasta 3 veces menos clientes confundidos."},
  {id:44,c:"testeo",n:"Diseno de Pantallas",d:"Proceso de creacion de interfaces digitales visualmente atractivas y simples de usar.",s:"Es decidir como se ve cada pantalla: botones, texto, colores, pasos.",e:"Pantalla pago: 8 campos y boton invisible. Rediseno: 3 pasos simples. Transacciones +40%.",v:"El buen diseno es la diferencia entre una app que se usa y una que se desinstala."},
  {id:45,c:"testeo",n:"Laboratorios de Experiencia",d:"Espacios para observar como interactuan usuarios reales con servicios o prototipos.",s:"Es invitar a clientes reales a probar algo mientras un equipo los observa.",e:"12 clientes prueban app de pagos. 9 de 12 no encuentran historial. Problema detectado.",v:"Revelan problemas que los usuarios no reportarian en una encuesta."},
  {id:46,c:"testeo",n:"Mapas de Calor",d:"Herramienta que muestra donde hacen clic, se desplazan o pasan tiempo los usuarios.",s:"Es como una fotografia termica de como los usuarios interactuan.",e:"80% hace clic en imagen decorativa. Se mueve el boton. Conversiones +35%.",v:"Muestran el comportamiento real sin necesidad de preguntarle nada al usuario."},
  {id:47,c:"testeo",n:"Microinteracciones",d:"Pequenos eventos de diseno que responden a una accion del usuario con retroalimentacion inmediata.",s:"Son los pequenos detalles que hacen que una app se sienta viva.",e:"Al pagar la factura: animacion check verde + Listo, tu pago esta procesado.",v:"Reducen la ansiedad del usuario y hacen el sistema mas humano."},
  {id:48,c:"testeo",n:"Prototipos",d:"Versiones preliminares de un servicio creadas rapidamente para probar conceptos antes de invertir.",s:"Es hacer un borrador funcional para saber si una idea funciona antes de gastar.",e:"Prototipo en papel del chatbot en una tarde. Descubren 3 flujos confusos antes de invertir.",v:"Aplica la filosofia de fallar barato y rapido."},
  {id:49,c:"testeo",n:"Pruebas A/B",d:"Metodo en el que se crean dos versiones distintas y se mide cual produce mejores resultados.",s:"Es como un experimento cientifico: version A vs version B.",e:"Version B Tu opinion mejora el servicio de miles: +42% respuestas vs version A.",v:"Eliminan el debate interno de que crees que funciona."},
  {id:50,c:"testeo",n:"Test con Usuarios",d:"Metodo en el que se observa directamente a usuarios reales mientras intentan completar tareas.",s:"Es sentarse al lado del cliente sin decirle que hacer y observar.",e:"6 de 8 clientes buscan cambiar plan en Mi Perfil cuando esta en Servicios.",v:"Revela problemas que el equipo de diseno nunca detectaria por conocer el sistema."},
  {id:51,c:"testeo",n:"Testeo",d:"Proceso de evaluacion de servicios antes del lanzamiento oficial para identificar errores.",s:"Es el control de calidad de la experiencia.",e:"Simulan 50 escenarios antes del lanzamiento. Encuentran 7 fallas criticas que corrigen.",v:"Evita que los clientes descubran los errores."},
  {id:52,c:"testeo",n:"Tree Testing",d:"Tecnica que evalua la efectividad de la estructura de navegacion de un menu.",s:"Es probar si la estructura de un menu tiene sentido para los usuarios.",e:"Solo 5 de 15 usuarios encuentran pagar mi factura en el primer intento.",v:"Separa los problemas de estructura de los de diseno visual."},
  {id:53,c:"testeo",n:"UI (User Interface)",d:"Diseno visual e interactivo de los elementos graficos con los que el usuario interactua.",s:"Si la UX es como funciona una app, la UI es como se ve.",e:"App con botones pequenos vs app con botones grandes y colores armonicos.",v:"Una app visualmente caotica hace que el cliente desconfie aunque funcione bien."},
  {id:54,c:"testeo",n:"UX (User Experience)",d:"Disciplina que estudia y optimiza la experiencia de una persona al interactuar con un producto digital.",s:"UX es la ciencia de hacer que usar algo digital sea facil, agradable y efectivo.",e:"App A: pagar factura en 7 pasos. App B: 3 pasos claros. La B tiene mejor UX.",v:"Una mala UX hace que los clientes abandonen la app y llamen al call center."},
  {id:55,c:"implementacion",n:"Agente Virtual",d:"Sistema de IA que simula un agente humano y atiende consultas de forma autonoma en multiples canales.",s:"Es como tener un colaborador digital disponible 24/7.",e:"Cliente quiere cambiar plan, reportar falla y consultar saldo. El agente lo gestiona todo en WhatsApp.",v:"Los agentes virtuales pueden resolver hasta el 80% de las interacciones sin humanos."},
  {id:56,c:"implementacion",n:"Agentic IA",d:"IA que actua de forma autonoma para alcanzar objetivos complejos: planifica, decide y ejecuta.",s:"Es la IA que no solo responde preguntas sino que actua por su cuenta.",e:"Cliente cobrado dos veces: la IA detecta, revisa historial, genera nota de credito y confirma.",v:"La Agentic IA representa el futuro de la atencion al cliente."},
  {id:57,c:"implementacion",n:"Automatizacion",d:"Uso de tecnologia para ejecutar tareas de forma automatica sin intervencion humana.",s:"La automatizacion hace que las maquinas hagan lo repetitivo para que las personas hagan lo humano.",e:"Sistema detecta internet al 50% > crea ticket > asigna tecnico > envia WhatsApp.",v:"Mejora la velocidad, reduce errores y libera agentes para momentos que requieren empatia."},
  {id:58,c:"implementacion",n:"Autoservicio",d:"Canales y herramientas que permiten al cliente resolver sus necesidades sin intervencion de un agente.",s:"Es cuando el cliente puede hacer las cosas solo, cuando quiera.",e:"Cliente a las 11 PM quiere fecha de corte. Entra a la app, ve la informacion en 20 segundos.",v:"El autoservicio bien disenado cuesta 10-20 veces menos que atenderla con un agente humano."},
  {id:59,c:"implementacion",n:"Caracterizacion de Procesos",d:"Documentacion detallada de como funciona un proceso, incluyendo pasos, responsables y tiempos.",s:"Es escribir el manual de instrucciones de cada proceso.",e:"Activacion: Registro 30 min > Asignacion 2h > Visita 2h > Pruebas 45 min.",v:"Garantiza consistencia y es la base para automatizar o mejorar cualquier proceso."},
  {id:60,c:"implementacion",n:"Chatbot",d:"Programa de IA que simula conversaciones escritas para resolver consultas de forma automatizada.",s:"Es el asistente de texto que responde en WhatsApp, web o app.",e:"Cliente escribe a las 11 PM. Bot responde en 3 segundos con monto y fecha de factura.",v:"Un chatbot bien entrenado resuelve hasta el 65% de consultas sin escalar a un agente."},
  {id:61,c:"implementacion",n:"CDP (Customer Data Platform)",d:"Plataforma que recopila y unifica datos del cliente de multiples fuentes en un perfil unico.",s:"Es el cerebro de datos de la empresa.",e:"Cuando Laura llama, el agente ve: 6 anos cliente, plan actual, ultima falla, canal preferido.",v:"Sin CDP, los agentes atienden a ciegos. Con CDP, cada interaccion parte desde el conocimiento."},
  {id:62,c:"implementacion",n:"Copilot",d:"Asistente de IA que trabaja en tiempo real junto al agente humano sugiriendo respuestas.",s:"Es el asistente invisible que ayuda al agente mientras atiende al cliente.",e:"Agente atiende: copilot muestra historial, causa probable, respuesta recomendada y protocolo.",v:"Los agentes con copilot reducen el AHT hasta un 30% y cometen menos errores."},
  {id:63,c:"implementacion",n:"CRM (Customer Relationship Management)",d:"Sistema que registra y analiza todas las interacciones de la empresa con sus clientes.",s:"Es la memoria institucional de la relacion con cada cliente.",e:"Agente ve: cliente desde 2017, llamo hace 15 dias, calificacion 3/5, renovacion en 30 dias.",v:"Garantiza continuidad en la relacion con el cliente."},
  {id:64,c:"implementacion",n:"Customer Success",d:"Funcion proactiva dedicada a garantizar que los clientes logren los resultados que esperaban.",s:"Customer Success no espera que el cliente llame con un problema. Va antes.",e:"Cliente lleva 2 meses sin configurar alertas. CS escribe: te ayudamos en 15 minutos.",v:"Las empresas con Customer Success tienen tasas de renovacion entre 20% y 40% mayores."},
  {id:65,c:"implementacion",n:"Experiencia Digital",d:"Totalidad de interacciones del cliente al relacionarse con la empresa a traves de canales digitales.",s:"Es todo lo que vive un cliente cuando usa los canales digitales.",e:"Ver anuncio > entrar al sitio > descargar app > pagar en 3 pasos.",v:"El 73% de clientes esperan experiencias digitales comparables a las mejores apps del mundo."},
  {id:66,c:"implementacion",n:"Experiencia Omnicanal",d:"Modelo en el que el cliente vive una experiencia integrada al moverse entre canales.",s:"La experiencia omnicanal hace que el cliente sienta que la empresa es una sola.",e:"Sandra inicia reclamo por chat. La llaman: veo que hablaste esta manana. No repitio nada.",v:"Los clientes con experiencia omnicanal tienen satisfaccion un 30% mayor."},
  {id:67,c:"implementacion",n:"Experiencia Proactiva",d:"Modelo en el que la empresa anticipa necesidades o problemas del cliente y actua primero.",s:"En lugar de esperar que el cliente llame, la empresa lo detecta antes y actua primero.",e:"Sistema detecta internet al 30%. WhatsApp: Detectamos degradacion. En 2h te avisamos.",v:"Es el salto evolutivo mas importante en atencion al cliente."},
  {id:68,c:"implementacion",n:"Experiencia Reactiva",d:"Modelo tradicional donde la empresa responde cuando el cliente toma la iniciativa de comunicarse.",s:"Es el modelo clasico: el cliente tiene un problema, llama, la empresa responde.",e:"Internet falla a las 8 AM. Cliente llama a las 11 AM. 3 horas de frustracion acumulada.",v:"El objetivo estrategico es reducir la reactividad aumentando la proactividad."},
  {id:69,c:"implementacion",n:"Gestion de Reclamos (PQR)",d:"Sistema estructurado para recibir, clasificar y resolver Peticiones, Quejas y Reclamos.",s:"PQR es el proceso oficial para manejar cuando algo sale mal.",e:"Cobro no reconocido: Reclamo recibido dia 1 > asignacion analista > respuesta max 15 dias.",v:"Un sistema PQR bien disenado convierte momentos criticos en oportunidades."},
  {id:70,c:"implementacion",n:"Hiperpersonalizacion",d:"Nivel avanzado de personalizacion que usa IA y datos en tiempo real para anticipar necesidades.",s:"La empresa predice lo que vas a necesitar antes de que lo pidas.",e:"App detecta cargos adicionales cada dia 25. El 23 envia: actualizar plan con 10% descuento?",v:"Logra que los clientes sientan que la empresa los entiende mejor que ellos mismos."},
  {id:71,c:"implementacion",n:"IVR (Interactive Voice Response)",d:"Sistema automatizado que guia a los clientes cuando llaman a traves de opciones.",s:"Es la recepcionista automatica que contesta cuando llamas.",e:"Sin IVR: 40% de llamadas al area equivocada. Con IVR optimizado: bajan al 8%.",v:"Un IVR bien disenado es el primer filtro de calidad del call center."},
  {id:72,c:"implementacion",n:"IVR Proactive",d:"Sistema que toma la iniciativa de contactar al cliente mediante llamadas automatizadas.",s:"Es el IVR al reves: el sistema llama primero al cliente.",e:"5.000 clientes con falla. IVR los llama automaticamente con el aviso en menos de 10 minutos.",v:"Puede reducir hasta el 40% el volumen de llamadas entrantes en situaciones de crisis."},
  {id:73,c:"implementacion",n:"Modelo de Relacion",d:"Estrategia que define el tipo e intensidad de relacion que la empresa establece con cada segmento.",s:"No todos los clientes quieren el mismo tipo de atencion.",e:"Digital (autoservicio) / Asistido (llamadas ocasionales) / Dedicado (gerente exclusivo).",v:"Intentar atender a todos igual es costoso e ineficiente."},
  {id:74,c:"implementacion",n:"Multicanalidad",d:"Presencia en multiples canales que funcionan de forma paralela pero independiente.",s:"Es estar en muchos lugares pero cada canal funciona por separado.",e:"Cliente escribe por Facebook. Le dicen que llame. Llama y tiene que explicar todo de nuevo.",v:"Es mejor que un solo canal, pero genera friccion. Es el paso previo a la omnicanalidad."},
  {id:75,c:"implementacion",n:"Omnicanalidad",d:"Modelo en el que todos los canales estan integrados y comparten la misma informacion en tiempo real.",s:"El cliente puede moverse entre canales sin perder el hilo.",e:"Carlos inicia chat por cobro. El agente dice: veo que escribiste hace unos minutos.",v:"Elimina la frustracion de tener que repetirse."},
  {id:76,c:"implementacion",n:"Personalizacion",d:"Practica de adaptar mensajes y experiencias para cada cliente especifico.",s:"Es cuando la empresa te trata como una persona unica.",e:"Juan llama: agente ya sabe 5 anos cliente, plan vence en 2 meses, ultima llamada por velocidad.",v:"Clientes con experiencias personalizadas gastan en promedio un 40% mas."},
  {id:77,c:"implementacion",n:"Recuperacion del Servicio",d:"Conjunto de acciones para corregir una falla y convertir una experiencia negativa en oportunidad.",s:"No basta con arreglar el problema tecnico. Hay que reconocer el impacto emocional.",e:"Tecnico no llego: llamada proactiva + reagendamiento prioritario + descuento 20%.",v:"La paradoja de la recuperacion: cliente con problema resuelto puede ser mas leal."},
  {id:78,c:"implementacion",n:"Voicebot",d:"Asistente virtual de voz basado en IA que comprende el lenguaje natural hablado.",s:"Es el IVR del siglo XXI. Hablas normalmente y el sistema te entiende.",e:"Mi internet no funciona. Voicebot: diagnostica y responde con el tiempo de resolucion.",v:"Los voicebots bien implementados resuelven entre el 40% y el 70% de consultas sin humanos."},
  {id:79,c:"implementacion",n:"WhatsApp Bot",d:"Chatbot integrado en WhatsApp Business API para automatizar conversaciones.",s:"Es el asistente automatico que vive dentro de WhatsApp.",e:"Cliente a las 6 AM: cambiar fecha de pago. Bot responde, verifica, actualiza y confirma.",v:"WhatsApp tiene tasa de apertura del 98% vs 20% del email."},
  {id:80,c:"implementacion",n:"WhatsApp Business API",d:"Plataforma de Meta que permite a empresas gestionar conversaciones masivas en WhatsApp.",s:"Es la version empresarial de WhatsApp para atender a miles de clientes simultaneamente.",e:"Confirma agendamiento con foto del tecnico y notifica cuando esta en camino.",v:"Atender al cliente donde ya esta genera experiencias mas naturales."},
  {id:81,c:"medicion",n:"AHT (Average Handle Time)",d:"Tiempo promedio total de una interaccion desde que inicia hasta que se cierra completamente.",s:"Incluye conversacion, espera y gestion posterior al contacto.",e:"4 de 12 minutos de AHT son por consultar 3 sistemas. Al integrarlos: AHT baja a 8 min.",v:"Ayuda a equilibrar eficiencia y calidad."},
  {id:82,c:"medicion",n:"CES (Customer Effort Score)",d:"Metrica que mide cuanto esfuerzo tuvo que hacer el cliente para resolver su necesidad.",s:"Mide que tan facil o dificil fue para el cliente hacer lo que necesitaba.",e:"Actualizar plan por app: promedio 3 de 7 indica friccion en el flujo.",v:"Reducir el esfuerzo tiene mayor impacto en la lealtad que deleitar al cliente."},
  {id:83,c:"medicion",n:"Churn Rate",d:"Porcentaje de clientes que cancelan su servicio durante un periodo especifico.",s:"Es la tasa de fuga de clientes. Bajo es bueno, alto es senal de alerta.",e:"Churn subio de 3% a 7% en un trimestre. Coincide con lanzamiento de competencia.",v:"Es el termometro de la salud del negocio."},
  {id:84,c:"medicion",n:"CSAT (Customer Satisfaction Score)",d:"Metrica que mide el nivel de satisfaccion del cliente despues de una interaccion especifica.",s:"Es la forma mas directa de saber si el cliente quedo contento.",e:"SMS post-llamada: Que tan satisfecho quedaste? 1-5. Promedio menor a 4 activa alerta.",v:"Detecta problemas en tiempo real."},
  {id:85,c:"medicion",n:"Cultura Centrada en el Cliente",d:"Estado organizacional en el que todos los colaboradores tienen sus decisiones orientadas al cliente.",s:"Es cuando toda la empresa piensa primero en el cliente antes de tomar una decision.",e:"Finanzas propone comision por pago en efectivo. Se analiza que 30% de clientes mayores lo prefiere.",v:"La cultura centrada en el cliente no es un proyecto, es una forma de ser."},
  {id:86,c:"medicion",n:"Definicion del Impacto",d:"Proceso de cuantificacion del valor generado por una iniciativa de CX.",s:"Es responder: valio la pena? No en terminos de creemos que si, sino en numeros concretos.",e:"Simplificar facturacion: llamadas -38%, NPS +8 puntos, cancelaciones -12%.",v:"Sin definicion del impacto, las iniciativas de CX se perciben como gasto."},
  {id:87,c:"medicion",n:"Engagement",d:"Nivel de conexion activa e interaccion frecuente del cliente con la empresa.",s:"Es que tan enganchado esta el cliente.",e:"Clientes que abren 3+ notificaciones al mes: cancelacion 2%. Los que no abren ninguna: 18%.",v:"Es uno de los mejores predictores de lealtad y riesgo de cancelacion."},
  {id:88,c:"medicion",n:"FCR (First Call Resolution)",d:"Porcentaje de casos que se resuelven completamente en el primer contacto.",s:"Es el indicador de lo hicimos bien a la primera.",e:"Cliente llama por internet. Agente detecta, soluciona remotamente y explica como prevenirlo.",v:"Resolver bien a la primera es hasta 5 veces mas barato que atender una segunda llamada."},
  {id:89,c:"medicion",n:"Guias de Calidad Emitida",d:"Estandares internos que definen como debe prestarse el servicio.",s:"Son las reglas del juego internas del equipo.",e:"Responder antes de 3 timbres + verificar identidad en 30 seg + no transferir sin avisar.",v:"Garantiza que el servicio sea predecible y consistente."},
  {id:90,c:"medicion",n:"Guias de Calidad Percibida",d:"Criterios que evaluan si el cliente realmente vivio una experiencia de calidad desde su perspectiva.",s:"Es la diferencia entre lo que la empresa cree que entrego y lo que el cliente vivio.",e:"Agente: 100/100 en estandares. Cliente: 60/100 porque la explicacion fue confusa.",v:"Medir solo la calidad emitida es hacer un examen para la empresa, no para el cliente."},
  {id:91,c:"medicion",n:"Lealtad del Cliente",d:"Disposicion sostenida del cliente a seguir eligiendo la misma empresa incluso con alternativas mas baratas.",s:"Un cliente leal vuelve, defiende la marca y recomienda sin que se lo pidan.",e:"Laura lleva 8 anos. 3 veces le ofrecieron mejor precio. 3 veces rechazo por la calidad.",v:"Un cliente leal gasta 3 veces mas y cuesta 5 veces menos retener que adquirir."},
  {id:92,c:"medicion",n:"Madurez CX",d:"Modelo que clasifica a las empresas en niveles de sofisticacion en la gestion de la experiencia.",s:"Es el termometro de evolucion en CX.",e:"N1: mide volumen. N2: satisfaccion basica. N3: NPS. N4: insights. N5: IA predictiva.",v:"Conocer el nivel de madurez permite hacer un diagnostico honesto."},
  {id:93,c:"medicion",n:"NPS (Net Promoter Score)",d:"Indice que mide la lealtad preguntando que tan probable es que recomiende la empresa del 0 al 10.",s:"Promotores 9-10, Neutros 7-8, Detractores 0-6. NPS = %Promotores - %Detractores.",e:"60% promotores - 15% detractores = NPS 45. Muy bueno en el sector.",v:"Es la metrica de lealtad mas usada en el mundo."},
  {id:94,c:"medicion",n:"Tasa de Abandono",d:"Porcentaje de usuarios que inician un proceso pero no lo completan.",s:"Es medir cuantas personas empezaron algo pero no lo terminaron.",e:"72% abandona al contratar por app en el paso de adjuntar documentos. Simplificarlo: +45%.",v:"Senala exactamente donde hay un problema."},
  {id:95,c:"medicion",n:"Tasa de Retencion",d:"Porcentaje de clientes que permanecen activos con la empresa al finalizar un periodo.",s:"Es la medida de cuantos clientes se quedan.",e:"82% retencion anual. El 65% de quienes se van cancela en los primeros 6 meses.",v:"Retener un cliente cuesta 5-7 veces menos que adquirir uno nuevo."},
].sort((a,b)=>a.n.localeCompare(b.n,'es'));

const ALL_TERMS = T;
const AVAILABLE_LETTERS = [...new Set(ALL_TERMS.map(t=>t.n[0].toUpperCase()))].sort();
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

function FlipCard({t}) {
  const [fl,setFl] = useState(false);
  const col = COLORS[t.c];
  const handleClick = () => { if(!fl) saveCardView(t.n); setFl(f=>!f); };
  return (
    <div onClick={handleClick} style={{perspective:1000,cursor:'pointer',height:300}}>
      <div style={{position:'relative',width:'100%',height:'100%',transformStyle:'preserve-3d',transition:'transform 0.6s',transform:fl?'rotateY(180deg)':'rotateY(0deg)'}}>
        <div style={{position:'absolute',inset:0,backfaceVisibility:'hidden',WebkitBackfaceVisibility:'hidden',borderTop:`4px solid ${col}`,boxShadow:'0 2px 8px rgba(0,0,0,0.1)',background:'white',borderRadius:12,padding:20,display:'flex',flexDirection:'column',boxSizing:'border-box'}}>
          <div style={{display:'flex',alignItems:'flex-start',gap:10,marginBottom:10}}>
            <div style={{background:`${col}22`,borderRadius:'50%',minWidth:36,minHeight:36,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:13,color:col,flexShrink:0}}>{t.n[0].toUpperCase()}</div>
            <h3 style={{color:'#0A2463',fontWeight:700,fontSize:12,lineHeight:1.4,margin:0}}>{t.n}</h3>
          </div>
          <p style={{color:'#4B5563',fontSize:11,lineHeight:1.6,flex:1,overflow:'hidden',margin:0}}>{t.d}</p>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:10}}>
            <span style={{background:`${col}22`,color:col,fontSize:10,padding:'2px 8px',borderRadius:20,fontWeight:700}}>{LABELS[t.c]}</span>
            <span style={{color:col,fontSize:10,fontWeight:600}}>Toca para ver mas</span>
          </div>
        </div>
        <div style={{position:'absolute',inset:0,backfaceVisibility:'hidden',WebkitBackfaceVisibility:'hidden',transform:'rotateY(180deg)',backgroundColor:col,borderRadius:12,padding:16,display:'flex',flexDirection:'column',boxSizing:'border-box'}}>
          <div style={{overflowY:'auto',flex:1,display:'flex',flexDirection:'column',gap:8}}>
            {[['En palabras simples',t.s],['Ejemplo',t.e],['Para que sirve',t.v]].map(([lbl,txt])=>(
              <div key={lbl}><p style={{color:'white',fontSize:10,fontWeight:700,margin:'0 0 3px'}}>{lbl}</p><p style={{color:'rgba(255,255,255,0.9)',fontSize:11,lineHeight:1.5,margin:0}}>{txt}</p></div>
            ))}
          </div>
          <p style={{color:'rgba(255,255,255,0.6)',fontSize:10,textAlign:'center',margin:'8px 0 0'}}>Toca para volver</p>
        </div>
      </div>
    </div>
  );
}

function AdminPanel({onClose}) {
  const [data,setData] = useState(null);
  const [loading,setLoading] = useState(true);
  const [activeTab,setActiveTab] = useState('resumen');

  useEffect(()=>{
    const result={visits:{},searches:{},history:{},cards:{}};
    ['visits:','searches:','history:','card:'].forEach(prefix=>{
      const {keys}=storage.list(prefix);
      keys.forEach(k=>{
        const r=storage.get(k);if(!r)return;
        if(k.startsWith('visits:')) result.visits[k.replace('visits:','')]=parseInt(r.value)||0;
        else if(k.startsWith('searches:')){
          const parts=k.replace('searches:','').split(':');
          const date=parts[0],term=parts.slice(1).join(':');
          if(!result.searches[date])result.searches[date]={};
          result.searches[date][term]=(result.searches[date][term]||0)+(parseInt(r.value)||0);
        } else if(k.startsWith('history:')){
          try{result.history[k.replace('history:','')]=JSON.parse(r.value||'[]');}catch{}
        } else if(k.startsWith('card:')){
          result.cards[k.replace('card:','')]=parseInt(r.value)||0;
        }
      });
    });
    setData(result);setLoading(false);
  },[]);

  const totalVisits = data?Object.values(data.visits).reduce((a,b)=>a+b,0):0;
  const topSearches = data?(()=>{const agg={};Object.values(data.searches).forEach(d=>Object.entries(d).forEach(([t,c])=>{agg[t]=(agg[t]||0)+c;}));return Object.entries(agg).sort((a,b)=>b[1]-a[1]).slice(0,10);})():[];
  const topCards = data?Object.entries(data.cards||{}).sort((a,b)=>b[1]-a[1]).slice(0,10):[];
  const totalCardClicks = data?Object.values(data.cards||{}).reduce((a,b)=>a+b,0):0;
  const visitsByDay = data?Object.entries(data.visits).sort((a,b)=>a[0].localeCompare(b[0])):[];
  const todayHistory = data?(data.history[today()]||[]).slice(-20).reverse():[];
  const maxV = visitsByDay.length?Math.max(...visitsByDay.map(([,v])=>v),1):1;
  const tabs=[{id:'resumen',label:'Resumen'},{id:'tarjetas',label:'Tarjetas'},{id:'busquedas',label:'Busquedas'},{id:'historial',label:'Historial'},{id:'visitas',label:'Visitas'}];

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(10,36,99,0.85)',zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
      <div style={{background:'white',borderRadius:16,width:'100%',maxWidth:740,maxHeight:'90vh',overflow:'hidden',display:'flex',flexDirection:'column'}}>
        <div style={{background:'linear-gradient(135deg,#0A2463,#1e4a8a)',padding:'16px 20px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div><p style={{color:'white',fontWeight:800,fontSize:16,margin:0}}>Panel Administrativo</p><p style={{color:'rgba(255,255,255,0.6)',fontSize:12,margin:0}}>Analiticas del Diccionario CX · emtelco</p></div>
          <button onClick={onClose} style={{background:'rgba(255,255,255,0.15)',border:'none',color:'white',borderRadius:8,width:32,height:32,cursor:'pointer',fontSize:18,fontWeight:700}}>✕</button>
        </div>
        <div style={{display:'flex',borderBottom:'1px solid #e5e7eb',overflowX:'auto'}}>
          {tabs.map(tab=>(<button key={tab.id} onClick={()=>setActiveTab(tab.id)} style={{padding:'10px 18px',border:'none',borderBottom:activeTab===tab.id?'3px solid #0A2463':'3px solid transparent',background:'transparent',color:activeTab===tab.id?'#0A2463':'#6b7280',fontWeight:activeTab===tab.id?700:400,fontSize:13,cursor:'pointer',whiteSpace:'nowrap'}}>{tab.label}</button>))}
        </div>
        <div style={{overflowY:'auto',flex:1,padding:20}}>
          {loading?<div style={{textAlign:'center',padding:40,color:'#6b7280'}}>Cargando analiticas...</div>:(
            <>
              {activeTab==='resumen'&&(
                <div>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))',gap:12,marginBottom:24}}>
                    {[
                      {label:'Visitas totales',val:totalVisits,icon:'👥',color:'#0A2463'},
                      {label:'Visitas hoy',val:data.visits[today()]||0,icon:'📅',color:'#3BCEAC'},
                      {label:'Clics en tarjetas',val:totalCardClicks,icon:'🃏',color:'#5A67D8'},
                      {label:'Busquedas unicas',val:topSearches.length,icon:'🔍',color:'#F59E0B'},
                    ].map(({label,val,icon,color})=>(
                      <div key={label} style={{background:'#f8fafc',borderRadius:12,padding:'14px 16px',borderLeft:`4px solid ${color}`,cursor:'default',userSelect:'none'}}>
                        <p style={{fontSize:20,margin:'0 0 4px'}}>{icon}</p>
                        <p style={{fontSize:24,fontWeight:800,color,margin:0}}>{val}</p>
                        <p style={{fontSize:11,color:'#6b7280',margin:0}}>{label}</p>
                      </div>
                    ))}
                  </div>
                  {topSearches.length>0&&(<div><p style={{fontWeight:700,color:'#0A2463',fontSize:13,marginBottom:8}}>Top 5 Busquedas</p>
                    {topSearches.slice(0,5).map(([term,cnt],i)=>(
                      <div key={term} style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                        <span style={{background:'#0A2463',color:'white',borderRadius:'50%',width:22,height:22,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:700,flexShrink:0}}>{i+1}</span>
                        <div style={{flex:1}}>
                          <div style={{display:'flex',justifyContent:'space-between',marginBottom:2}}><span style={{fontSize:12,color:'#374151',textTransform:'capitalize'}}>{term}</span><span style={{fontSize:11,color:'#6b7280'}}>{cnt}x</span></div>
                          <div style={{height:5,background:'#e5e7eb',borderRadius:3}}><div style={{height:5,background:'#3BCEAC',borderRadius:3,width:`${Math.round((cnt/(topSearches[0][1]||1))*100)}%`}}/></div>
                        </div>
                      </div>
                    ))}
                  </div>)}
                  {totalVisits===0&&<div style={{textAlign:'center',padding:'32px 16px',color:'#9ca3af'}}><p style={{fontSize:32,margin:'0 0 8px'}}>📊</p><p style={{fontSize:13}}>Aun no hay datos.</p></div>}
                </div>
              )}
              {activeTab==='tarjetas'&&(
                <div>
                  <p style={{fontWeight:700,color:'#0A2463',fontSize:14,marginBottom:4}}>Tarjetas mas consultadas</p>
                  <p style={{color:'#6b7280',fontSize:12,marginBottom:16}}>Conteo de clics por tarjeta</p>
                  {topCards.length===0?(
                    <div style={{textAlign:'center',padding:'32px 16px',color:'#9ca3af'}}><p style={{fontSize:32,margin:'0 0 8px'}}>🃏</p><p style={{fontSize:13}}>Aun no hay tarjetas consultadas.</p></div>
                  ):topCards.map(([term,cnt],i)=>(
                    <div key={term} style={{display:'flex',alignItems:'center',gap:10,marginBottom:10,padding:'10px 14px',background:'#f8fafc',borderRadius:10}}>
                      <span style={{background:i<3?'#5A67D8':'#e5e7eb',color:i<3?'white':'#6b7280',borderRadius:'50%',width:28,height:28,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,flexShrink:0}}>{i+1}</span>
                      <div style={{flex:1}}>
                        <div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}>
                          <span style={{fontSize:13,color:'#374151',fontWeight:500,textTransform:'capitalize'}}>{term}</span>
                          <span style={{fontSize:12,fontWeight:700,color:'#5A67D8'}}>{cnt} clic{cnt!==1?'s':''}</span>
                        </div>
                        <div style={{height:6,background:'#e5e7eb',borderRadius:3}}><div style={{height:6,background:i===0?'#5A67D8':i===1?'#3BCEAC':'#0A2463',borderRadius:3,width:`${Math.round((cnt/(topCards[0][1]||1))*100)}%`}}/></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {activeTab==='busquedas'&&(
                <div>
                  <p style={{fontWeight:700,color:'#0A2463',fontSize:14,marginBottom:16}}>Palabras mas buscadas</p>
                  {topSearches.length===0?<p style={{color:'#9ca3af',fontSize:13}}>Sin busquedas registradas aun.</p>:topSearches.map(([term,cnt],i)=>(
                    <div key={term} style={{display:'flex',alignItems:'center',gap:10,marginBottom:10,padding:'10px 14px',background:'#f8fafc',borderRadius:10}}>
                      <span style={{background:i<3?'#0A2463':'#e5e7eb',color:i<3?'white':'#6b7280',borderRadius:'50%',width:28,height:28,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,flexShrink:0}}>{i+1}</span>
                      <div style={{flex:1}}>
                        <div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}><span style={{fontSize:13,color:'#374151',fontWeight:500,textTransform:'capitalize'}}>{term}</span><span style={{fontSize:12,fontWeight:700,color:'#0A2463'}}>{cnt}x</span></div>
                        <div style={{height:6,background:'#e5e7eb',borderRadius:3}}><div style={{height:6,background:i===0?'#3BCEAC':i===1?'#0A2463':'#5A67D8',borderRadius:3,width:`${Math.round((cnt/(topSearches[0][1]||1))*100)}%`}}/></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {activeTab==='historial'&&(
                <div>
                  <p style={{fontWeight:700,color:'#0A2463',fontSize:14,marginBottom:4}}>Historial de busquedas de hoy ({today()})</p>
                  {todayHistory.length===0?<p style={{color:'#9ca3af',fontSize:13}}>Sin busquedas hoy aun.</p>:(
                    <div style={{display:'flex',flexDirection:'column',gap:6}}>
                      {todayHistory.map((item,i)=>(
                        <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 14px',background:'#f8fafc',borderRadius:8}}>
                          <span>🔍</span><span style={{fontSize:13,color:'#374151',flex:1,textTransform:'capitalize'}}>{item.term}</span>
                          <span style={{fontSize:11,color:'#9ca3af',background:'#e5e7eb',padding:'2px 8px',borderRadius:10}}>{item.time}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {activeTab==='visitas'&&(
                <div>
                  <p style={{fontWeight:700,color:'#0A2463',fontSize:14,marginBottom:16}}>Conteo de ingresos por dia</p>
                  {visitsByDay.length===0?<p style={{color:'#9ca3af',fontSize:13}}>Sin visitas registradas aun.</p>:(
                    <div>
                      <div style={{display:'flex',alignItems:'flex-end',gap:8,height:140,marginBottom:8}}>
                        {visitsByDay.slice(-7).map(([date,val])=>(
                          <div key={date} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
                            <span style={{fontSize:11,fontWeight:700,color:'#0A2463'}}>{val}</span>
                            <div style={{width:'100%',background:'#0A2463',borderRadius:'4px 4px 0 0',height:`${Math.round((val/maxV)*100)}px`,minHeight:4}}/>
                            <span style={{fontSize:9,color:'#9ca3af',whiteSpace:'nowrap'}}>{date.slice(5)}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{marginTop:16,display:'flex',flexDirection:'column',gap:8}}>
                        {[...visitsByDay].reverse().map(([date,val])=>(
                          <div key={date} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 14px',background:'#f8fafc',borderRadius:8}}>
                            <span style={{fontSize:13,color:'#374151'}}>📅 {date}</span>
                            <span style={{fontWeight:700,color:'#0A2463',fontSize:14}}>{val} ingreso{val!==1?'s':''}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
        <div style={{borderTop:'1px solid #e5e7eb',padding:'12px 20px',background:'#f8fafc',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <span style={{fontSize:11,color:'#9ca3af'}}>Datos almacenados en el navegador</span>
          <button onClick={onClose} style={{background:'#0A2463',color:'white',border:'none',borderRadius:8,padding:'8px 20px',cursor:'pointer',fontWeight:700,fontSize:13}}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}

const PAGES={COVER:'cover',INTRO:'intro',TERMS:'terms'};

export default function App() {
  const [page,setPage]=useState(PAGES.COVER);
  const [search,setSearch]=useState('');
  const [selLetter,setSelLetter]=useState('');
  const [cat,setCat]=useState('all');
  const [showAdmin,setShowAdmin]=useState(false);
  const [adminInput,setAdminInput]=useState('');
  const [showAdminInput,setShowAdminInput]=useState(false);
  const [adminError,setAdminError]=useState(false);
  const searchTimer=useRef(null);

  useEffect(()=>{if(page===PAGES.TERMS)saveVisit();},[page]);

  const filtered=useMemo(()=>{
    const q=search.toLowerCase();
    return ALL_TERMS.filter(t=>(cat==='all'||t.c===cat)&&(!selLetter||t.n[0].toUpperCase()===selLetter)&&(!q||t.n.toLowerCase().includes(q)||t.d.toLowerCase().includes(q)));
  },[search,selLetter,cat]);

  const grouped=useMemo(()=>{const g={};filtered.forEach(t=>{const l=t.n[0].toUpperCase();if(!g[l])g[l]=[];g[l].push(t);});return g;},[filtered]);

  const handleSearch=v=>{
    setSearch(v);if(v)setSelLetter('');
    if(searchTimer.current)clearTimeout(searchTimer.current);
    if(v.trim().length>=2)searchTimer.current=setTimeout(()=>saveSearch(v.trim()),1500);
  };

  const handleAdminSubmit=()=>{
    if(adminInput===ADMIN_KEY){setShowAdmin(true);setShowAdminInput(false);setAdminInput('');setAdminError(false);}
    else{setAdminError(true);setTimeout(()=>setAdminError(false),2000);}
  };

  const handleLetter=l=>{setSelLetter(p=>p===l?'':l);setSearch('');};

  if(page===PAGES.COVER) return (
    <div style={{background:'linear-gradient(135deg,#0A2463 0%,#1e4a8a 50%,#3BCEAC 100%)',minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'48px 24px',position:'relative',overflow:'hidden'}}>
      <style>{`@keyframes float{from{transform:translateY(0)}to{transform:translateY(-18px)}}@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}@keyframes mfl{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}} ${MONTSERRAT}`}</style>
      {[...Array(10)].map((_,i)=>(<div key={i} style={{position:'absolute',borderRadius:'50%',background:'rgba(255,255,255,0.06)',width:30+(i*23)%80,height:30+(i*23)%80,left:`${(i*17+5)%90}%`,top:`${(i*13+10)%80}%`,animation:`float ${3+i%4}s ease-in-out infinite alternate`}}/>))}
      <div style={{position:'absolute',top:20,left:24}}>
        <img src={LOGO} alt="emtelco" style={{height:36,filter:'brightness(0) invert(1)'}} onError={e=>e.target.style.display='none'}/>
      </div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:40,flexWrap:'wrap',zIndex:1,maxWidth:960,width:'100%'}}>
        <div style={{flex:1,minWidth:280,textAlign:'left'}}>
          <div style={{animation:'pulse 3s ease-in-out infinite',marginBottom:12,fontSize:42}}>📖</div>
          <h1 style={{fontSize:'clamp(36px,6vw,72px)',fontWeight:800,color:'white',margin:'0 0 4px',lineHeight:1.1}}>Diccionario</h1>
          <h1 style={{fontSize:'clamp(44px,8vw,88px)',fontWeight:800,color:'#3BCEAC',margin:'0 0 16px',lineHeight:1}}>CX</h1>
          <p style={{color:'rgba(255,255,255,0.85)',fontSize:'clamp(13px,2vw,18px)',fontWeight:600,marginBottom:8}}>Donde la experiencia del cliente cobra sentido</p>
          <p style={{color:'rgba(255,255,255,0.65)',fontSize:'clamp(12px,1.5vw,15px)',maxWidth:420,lineHeight:1.6,marginBottom:32}}>Descubre los 95 conceptos esenciales de CX explicados de forma simple, clara y practica.</p>
          <button onClick={()=>setPage(PAGES.INTRO)} style={{background:'linear-gradient(135deg,#3BCEAC,#2ab89a)',color:'#0A2463',fontWeight:800,fontSize:17,border:'none',borderRadius:50,padding:'15px 44px',cursor:'pointer',boxShadow:'0 8px 30px rgba(59,206,172,0.4)'}}>Explorar Diccionario</button>
        </div>
        <div style={{flex:'0 0 auto',animation:'mfl 3s ease-in-out infinite',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{width:'clamp(280px,38vw,460px)',height:'clamp(280px,38vw,460px)',backgroundImage:`url(${MASCOTA})`,backgroundSize:'contain',backgroundRepeat:'no-repeat',backgroundPosition:'center'}}/>
        </div>
      </div>
    </div>
  );

  if(page===PAGES.INTRO) return (
    <div style={{background:'linear-gradient(135deg,#f0f9ff,#e0f2fe,#ccfbf1)',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:24}}>
      <style>{`@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}} ${MONTSERRAT}`}</style>
      <div style={{background:'rgba(255,255,255,0.85)',backdropFilter:'blur(20px)',borderRadius:24,padding:'48px 40px',maxWidth:620,width:'100%',boxShadow:'0 20px 60px rgba(10,36,99,0.12)'}}>
        <div style={{display:'flex',justifyContent:'center',marginBottom:20}}><div style={{animation:'pulse 2s ease-in-out infinite',fontSize:52}}>💙</div></div>
        <h2 style={{textAlign:'center',color:'#0A2463',fontWeight:800,fontSize:'clamp(22px,4vw,34px)',marginBottom:6}}>Que es CX?</h2>
        <p style={{textAlign:'center',color:'#3BCEAC',fontWeight:700,marginBottom:28}}>La clave para conectar con tus clientes</p>
        {["La Experiencia del Cliente (CX) es todo lo que siente y percibe una persona cuando interactua con una empresa.",
          "En un mundo donde todos ofrecen cosas similares, la experiencia es lo que marca la diferencia.",
          "Este diccionario esta hecho para ti: sin tecnicismos complicados, con ejemplos del dia a dia."
        ].map((txt,i)=>(
          <div key={i} style={{display:'flex',gap:12,alignItems:'flex-start',marginBottom:16}}>
            <div style={{background:'#0A2463',color:'white',borderRadius:'50%',width:28,height:28,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:13,flexShrink:0}}>{i+1}</div>
            <p style={{color:'#374151',fontSize:14,lineHeight:1.7,margin:0}}>{txt}</p>
          </div>
        ))}
        <div style={{display:'flex',gap:12,justifyContent:'center',marginTop:24}}>
          <button onClick={()=>setPage(PAGES.COVER)} style={{background:'transparent',border:'2px solid #0A2463',color:'#0A2463',fontWeight:700,borderRadius:50,padding:'12px 24px',cursor:'pointer',fontSize:14}}>Volver</button>
          <button onClick={()=>setPage(PAGES.TERMS)} style={{background:'linear-gradient(135deg,#0A2463,#1e4a8a)',color:'white',fontWeight:700,border:'none',borderRadius:50,padding:'12px 32px',cursor:'pointer',fontSize:14}}>Ver terminos</button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{minHeight:'100vh',background:'#f8fafc'}}>
      <style>{MONTSERRAT}</style>
      {showAdmin&&<AdminPanel onClose={()=>setShowAdmin(false)}/>}
      {showAdminInput&&(
        <div style={{position:'fixed',inset:0,background:'rgba(10,36,99,0.7)',zIndex:8888,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'white',borderRadius:16,padding:28,width:320,boxShadow:'0 20px 60px rgba(0,0,0,0.3)'}}>
            <p style={{fontWeight:800,color:'#0A2463',fontSize:16,margin:'0 0 4px'}}>Acceso Administrativo</p>
            <p style={{color:'#6b7280',fontSize:12,margin:'0 0 16px'}}>Ingresa la clave de acceso</p>
            <input type="password" value={adminInput} onChange={e=>{setAdminInput(e.target.value);setAdminError(false);}} onKeyDown={e=>e.key==='Enter'&&handleAdminSubmit()} placeholder="Clave de acceso..."
              style={{width:'100%',padding:'10px 14px',border:`2px solid ${adminError?'#ef4444':'#e5e7eb'}`,borderRadius:10,fontSize:14,outline:'none',boxSizing:'border-box',marginBottom:adminError?4:12}}/>
            {adminError&&<p style={{color:'#ef4444',fontSize:11,margin:'0 0 8px'}}>Clave incorrecta. Intenta de nuevo.</p>}
            <div style={{display:'flex',gap:8}}>
              <button onClick={()=>{setShowAdminInput(false);setAdminInput('');setAdminError(false);}} style={{flex:1,background:'transparent',border:'1px solid #e5e7eb',borderRadius:8,padding:'8px',cursor:'pointer',fontWeight:600,fontSize:13,color:'#6b7280'}}>Cancelar</button>
              <button onClick={handleAdminSubmit} style={{flex:1,background:'#0A2463',color:'white',border:'none',borderRadius:8,padding:'8px',cursor:'pointer',fontWeight:700,fontSize:13}}>Ingresar</button>
            </div>
          </div>
        </div>
      )}
      <div style={{background:'white',borderBottom:'1px solid #e5e7eb',position:'sticky',top:0,zIndex:100,padding:'12px 24px'}}>
        <div style={{maxWidth:1200,margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:10}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <img src={LOGO} alt="emtelco" style={{height:28}} onError={e=>e.target.style.display='none'}/>
            <div style={{width:1,height:24,background:'#e5e7eb'}}/>
            <span style={{fontWeight:700,color:'#0A2463',fontSize:15}}>Diccionario CX</span>
            <span style={{color:'#6b7280',fontSize:12}}>95 terminos · A-Z · modelo e-Motion</span>
          </div>
          <div style={{display:'flex',gap:8}}>
            <button onClick={()=>setShowAdminInput(true)} style={{background:'transparent',border:'1px solid #e5e7eb',borderRadius:20,padding:'6px 14px',cursor:'pointer',color:'#9ca3af',fontSize:12}} title="Acceso administrativo">⚙</button>
            <button onClick={()=>setPage(PAGES.COVER)} style={{background:'transparent',border:'1px solid #d1d5db',borderRadius:20,padding:'6px 16px',cursor:'pointer',color:'#374151',fontSize:13,fontWeight:600}}>Inicio</button>
          </div>
        </div>
      </div>
      <div style={{background:'linear-gradient(135deg,#0A2463,#1e4a8a)',padding:'16px 24px 0'}}>
        <div style={{maxWidth:580,margin:'0 auto',position:'relative'}}>
          <span style={{position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',fontSize:16}}>🔍</span>
          <input value={search} onChange={e=>handleSearch(e.target.value)} placeholder="Buscar termino..."
            style={{width:'100%',paddingLeft:44,paddingRight:search?40:16,paddingTop:12,paddingBottom:12,borderRadius:50,border:'none',fontSize:15,outline:'none',boxSizing:'border-box'}}/>
          {search&&<button onClick={()=>setSearch('')} style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'#6b7280',fontSize:16}}>✕</button>}
        </div>
        {search&&<p style={{color:'rgba(255,255,255,0.8)',fontSize:13,marginTop:8,textAlign:'center'}}>{filtered.length} resultado{filtered.length!==1?'s':''} encontrado{filtered.length!==1?'s':''}</p>}
        <div style={{maxWidth:1200,margin:'12px auto 0',paddingBottom:12,overflowX:'auto'}}>
          <div style={{display:'flex',gap:4,minWidth:'max-content',justifyContent:'center'}}>
            <button onClick={()=>{setSelLetter('');setSearch('');}} style={{width:36,height:32,borderRadius:8,border:'none',cursor:'pointer',fontWeight:700,fontSize:11,background:!selLetter?'#3BCEAC':'rgba(255,255,255,0.15)',color:!selLetter?'#0A2463':'rgba(255,255,255,0.9)'}}>ALL</button>
            {ALPHABET.map(l=>{const has=AVAILABLE_LETTERS.includes(l),sel=selLetter===l;
              return <button key={l} onClick={()=>has&&handleLetter(l)} style={{width:32,height:32,borderRadius:8,border:'none',cursor:has?'pointer':'default',fontWeight:700,fontSize:13,background:sel?'#3BCEAC':has?'rgba(255,255,255,0.2)':'rgba(255,255,255,0.05)',color:sel?'#0A2463':has?'white':'rgba(255,255,255,0.25)',transform:sel?'scale(1.15)':'scale(1)',transition:'all 0.2s'}}>{l}</button>;
            })}
          </div>
        </div>
      </div>
      <div style={{background:'white',padding:'12px 24px',borderBottom:'1px solid #e5e7eb',overflowX:'auto'}}>
        <div style={{display:'flex',gap:8,maxWidth:1200,margin:'0 auto',minWidth:'max-content',alignItems:'center'}}>
          <span style={{color:'#6b7280',fontSize:11,fontWeight:600,flexShrink:0}}>Fases e-Motion:</span>
          <button onClick={()=>setCat('all')} style={{border:'2px solid #0A2463',borderRadius:20,padding:'5px 14px',cursor:'pointer',background:cat==='all'?'#0A2463':'transparent',color:cat==='all'?'white':'#0A2463',fontWeight:700,fontSize:12}}>Todas</button>
          {Object.entries(COLORS).map(([key,col])=>(<button key={key} onClick={()=>setCat(key)} style={{border:`2px solid ${col}`,borderRadius:20,padding:'5px 14px',cursor:'pointer',background:cat===key?col:'transparent',color:cat===key?'white':col,fontWeight:700,fontSize:12,whiteSpace:'nowrap'}}>{LABELS[key]}</button>))}
        </div>
      </div>
      <div style={{maxWidth:1200,margin:'0 auto',padding:24}}>
        {filtered.length===0?(
          <div style={{textAlign:'center',padding:'60px 24px'}}>
            <p style={{color:'#6b7280',fontSize:18}}>No se encontraron terminos</p>
            <button onClick={()=>{setSearch('');setSelLetter('');setCat('all');}} style={{marginTop:16,background:'#0A2463',color:'white',border:'none',borderRadius:20,padding:'10px 24px',cursor:'pointer',fontWeight:700}}>Ver todos</button>
          </div>
        ):Object.entries(grouped).sort().map(([letter,terms])=>(
          <div key={letter} style={{marginBottom:32}}>
            <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:16}}>
              <div style={{background:'linear-gradient(135deg,#0A2463,#1e4a8a)',color:'white',fontWeight:800,fontSize:22,width:48,height:48,borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,boxShadow:'0 4px 12px rgba(10,36,99,0.3)'}}>{letter}</div>
              <div style={{flex:1,height:2,background:'linear-gradient(90deg,#0A2463,transparent)',borderRadius:2}}/>
              <span style={{color:'#9ca3af',fontSize:12,flexShrink:0}}>{terms.length} termino{terms.length!==1?'s':''}</span>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:16}}>
              {terms.map(t=><FlipCard key={t.id} t={t}/>)}
            </div>
          </div>
        ))}
      </div>
      <div style={{background:'#0A2463',padding:'20px 24px',marginTop:40}}>
        <div style={{maxWidth:1200,margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
          <img src={LOGO} alt="emtelco" style={{height:32,filter:'brightness(0) invert(1)'}} onError={e=>e.target.style.display='none'}/>
          <p style={{color:'rgba(255,255,255,0.7)',fontSize:13,margin:0}}>Haz clic en cualquier tarjeta para ver mas informacion</p>
          <p style={{color:'rgba(255,255,255,0.5)',fontSize:12,margin:0}}>2025</p>
        </div>
      </div>
    </div>
  );
}
