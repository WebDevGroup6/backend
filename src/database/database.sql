-- Schema creation
CREATE SCHEMA
public;

-- Core Tables
CREATE TABLE public.provincia
(
    id_provincia serial PRIMARY KEY,
    nombre varchar(50) NOT NULL UNIQUE
);

CREATE TABLE public.municipio
(
    id_municipio serial PRIMARY KEY,
    nombre varchar(50) NOT NULL,
    id_provincia int4 NOT NULL,
    CONSTRAINT municipio_nombre_id_provincia_key UNIQUE (nombre, id_provincia),
    CONSTRAINT municipio_id_provincia_fkey FOREIGN KEY (id_provincia) REFERENCES public.provincia(id_provincia) ON DELETE CASCADE
);

CREATE TABLE public.empleado
(
    id_empleado serial PRIMARY KEY,
    cedula varchar(15) NOT NULL UNIQUE,
    nombre varchar(100) NOT NULL,
    cargo varchar(50) NOT NULL,
    contacto varchar(50) NOT NULL,
    estado varchar(10) DEFAULT 'Activo' NOT NULL,
    fecha_contratacion date DEFAULT CURRENT_DATE NOT NULL,
    salario numeric(10, 2) NULL,
    CONSTRAINT empleado_estado_check CHECK ((estado)
    ::text = ANY
    (ARRAY[('Activo'), ('Inactivo')])),
    CONSTRAINT empleado_salario_check CHECK
    (salario >= 0)
);

    CREATE TABLE public.usuario
    (
        id_usuario serial PRIMARY KEY,
        id_empleado int4 NOT NULL UNIQUE,
        nombre_usuario varchar(50) NOT NULL UNIQUE,
        passwrd varchar(255) NOT NULL,
        estado varchar(10) DEFAULT 'Activo' NOT NULL,
        CONSTRAINT usuario_estado_check CHECK ((estado)
        ::text = ANY
        (ARRAY[('Activo'), ('Inactivo')])),
    CONSTRAINT usuario_id_empleado_fkey FOREIGN KEY
        (id_empleado) REFERENCES public.empleado
        (id_empleado) ON
        DELETE CASCADE
);

        -- Product and Risk Related Tables
        CREATE TABLE public.producto
        (
            id_producto serial PRIMARY KEY,
            nombre varchar(100) NOT NULL,
            descripcion text NULL,
            tipo varchar(10) NOT NULL,
            fabricante varchar(255) NOT NULL,
            fecha_aprobacion date NULL,
            estado varchar(10) DEFAULT 'Activo' NULL,
            fecha_vencimiento date NULL,
            lote varchar(50) NULL,
            codigo_digemaps varchar(20) NULL UNIQUE,
            CONSTRAINT chk_fecha_vencimiento CHECK (fecha_vencimiento > fecha_aprobacion),
            CONSTRAINT producto_estado_check CHECK ((estado)
            ::text = ANY
            (ARRAY[('Activo'), ('Retirado'), ('En Revision')])),
    CONSTRAINT producto_tipo_check CHECK
            ((tipo)::text = ANY
            (ARRAY[('Químico'), ('Biológico'), ('Físico')]))
);

            CREATE TABLE public.categoria_riesgo
            (
                id_categoria serial PRIMARY KEY,
                nombre varchar(50) NOT NULL UNIQUE,
                descripcion text NOT NULL
            );

            CREATE TABLE public.riesgo
            (
                id_riesgo serial PRIMARY KEY,
                codigo varchar(50) NOT NULL UNIQUE,
                descripcion text NOT NULL,
                severidad varchar(10) NOT NULL,
                probabilidad varchar(10) NOT NULL,
                estado varchar(10) DEFAULT 'Activo' NULL,
                fecha_registro date DEFAULT CURRENT_DATE NOT NULL,
                impacto varchar(50) NULL,
                CONSTRAINT riesgo_estado_check CHECK ((estado)
                ::text = ANY
                (ARRAY[('Activo'), ('Inactivo')])),
    CONSTRAINT riesgo_impacto_check CHECK
                ((impacto)::text = ANY
                (ARRAY[('Bajo'), ('Medio'), ('Alto')])),
    CONSTRAINT riesgo_probabilidad_check CHECK
                ((probabilidad)::text = ANY
                (ARRAY[('Raro'), ('Ocasional'), ('Frecuente')])),
    CONSTRAINT riesgo_severidad_check CHECK
                ((severidad)::text = ANY
                (ARRAY[('Bajo'), ('Medio'), ('Alto')]))
);

                CREATE TABLE public.evaluacion_riesgo
                (
                    id_evaluacion serial PRIMARY KEY,
                    id_producto int4 NOT NULL,
                    id_riesgo int4 NOT NULL,
                    fecha_evaluacion date NOT NULL,
                    puntuacion numeric(5, 2) NOT NULL,
                    id_empleado int4 NULL,
                    CONSTRAINT evaluacion_riesgo_id_empleado_fkey FOREIGN KEY (id_empleado) REFERENCES public.empleado(id_empleado) ON DELETE SET NULL,
                    CONSTRAINT evaluacion_riesgo_id_producto_fkey FOREIGN KEY (id_producto) REFERENCES public.producto(id_producto) ON DELETE CASCADE,
                    CONSTRAINT evaluacion_riesgo_id_riesgo_fkey FOREIGN KEY (id_riesgo) REFERENCES public.riesgo(id_riesgo) ON DELETE CASCADE
                );

                -- Laboratory and Test Related Tables
                CREATE TABLE public.tipo_prueba
                (
                    id_tipo serial PRIMARY KEY,
                    nombre varchar(100) NOT NULL UNIQUE,
                    descripcion text NOT NULL,
                    estado varchar(10) DEFAULT 'Activo' NOT NULL,
                    CONSTRAINT tipo_prueba_estado_check CHECK ((estado)
                    ::text = ANY
                    (ARRAY[('Activo'), ('Inactivo')]))
);

                    CREATE TABLE public.catalogo_pruebas
                    (
                        id_catalogo serial PRIMARY KEY,
                        nombre varchar(100) NOT NULL,
                        descripcion text NOT NULL,
                        estado varchar(10) DEFAULT 'Activo' NOT NULL,
                        CONSTRAINT catalogo_pruebas_estado_check CHECK ((estado)
                        ::text = ANY
                        (ARRAY[('Activo'), ('Inactivo')])),
    CONSTRAINT catalogo_pruebas_nombre_fkey FOREIGN KEY
                        (nombre) REFERENCES public.tipo_prueba
                        (nombre) ON
                        DELETE CASCADE
);

                        CREATE TABLE public.prueba
                        (
                            id_prueba serial PRIMARY KEY,
                            id_tipo int4 NOT NULL,
                            descripcion text NOT NULL,
                            estado varchar(10) DEFAULT 'Pendiente' NOT NULL,
                            CONSTRAINT prueba_estado_check CHECK ((estado)
                            ::text = ANY
                            (ARRAY[('Pendiente'), ('Completada')])),
    CONSTRAINT prueba_id_tipo_fkey FOREIGN KEY
                            (id_tipo) REFERENCES public.tipo_prueba
                            (id_tipo) ON
                            DELETE CASCADE
);

                            CREATE TABLE public.laboratorio
                            (
                                id_laboratorio serial PRIMARY KEY,
                                nombre varchar(100) NOT NULL,
                                direccion text NOT NULL,
                                contacto varchar(50) NOT NULL,
                                estado varchar(10) DEFAULT 'Activo' NOT NULL,
                                capacidad int4 NULL,
                                horario_atencion varchar(50) NULL,
                                CONSTRAINT laboratorio_capacidad_check CHECK (capacidad >= 0),
                                CONSTRAINT laboratorio_estado_check CHECK ((estado)
                                ::text = ANY
                                (ARRAY[('Activo'), ('Inactivo')]))
);

                                CREATE TABLE public.laboratorio_prueba
                                (
                                    id_laboratorio int4 NOT NULL,
                                    id_prueba int4 NOT NULL,
                                    CONSTRAINT laboratorio_prueba_pkey PRIMARY KEY (id_laboratorio, id_prueba),
                                    CONSTRAINT laboratorio_prueba_id_laboratorio_fkey FOREIGN KEY (id_laboratorio) REFERENCES public.laboratorio(id_laboratorio) ON DELETE CASCADE,
                                    CONSTRAINT laboratorio_prueba_id_prueba_fkey FOREIGN KEY (id_prueba) REFERENCES public.prueba(id_prueba) ON DELETE CASCADE
                                );

                                CREATE TABLE public.prueba_empleado
                                (
                                    id_empleado int4 NOT NULL,
                                    id_prueba int4 NOT NULL,
                                    CONSTRAINT prueba_empleado_pkey PRIMARY KEY (id_empleado, id_prueba),
                                    CONSTRAINT prueba_empleado_id_empleado_fkey FOREIGN KEY (id_empleado) REFERENCES public.empleado(id_empleado) ON DELETE CASCADE,
                                    CONSTRAINT prueba_empleado_id_prueba_fkey FOREIGN KEY (id_prueba) REFERENCES public.prueba(id_prueba) ON DELETE CASCADE
                                );

                                -- Supplier and Sample Related Tables
                                CREATE TABLE public.proveedor
                                (
                                    id_proveedor serial PRIMARY KEY,
                                    rnc varchar(11) NOT NULL UNIQUE,
                                    nombre varchar(100) NOT NULL,
                                    direccion text NOT NULL,
                                    id_municipio int4 NULL,
                                    contacto varchar(50) NOT NULL,
                                    estado varchar(10) DEFAULT 'Activo' NOT NULL,
                                    CONSTRAINT proveedor_estado_check CHECK ((estado)
                                    ::text = ANY
                                    (ARRAY[('Activo'), ('Inactivo')])),
    CONSTRAINT proveedor_rnc_check CHECK
                                    ((rnc)::text ~ '^[0-9]{9}$'::text),
    CONSTRAINT proveedor_id_municipio_fkey FOREIGN KEY
                                    (id_municipio) REFERENCES public.municipio
                                    (id_municipio) ON
                                    DELETE
                                    SET NULL
                                    );

                                    CREATE TABLE public.factura
                                    (
                                        id_factura serial PRIMARY KEY,
                                        id_proveedor int4 NOT NULL,
                                        fecha date NOT NULL,
                                        monto numeric(10, 2) NOT NULL,
                                        ncf varchar(20) NOT NULL UNIQUE,
                                        estado varchar(10) DEFAULT 'Pendiente' NULL,
                                        CONSTRAINT factura_estado_check CHECK ((estado)
                                        ::text = ANY
                                        (ARRAY[('Pendiente'), ('Pagada'), ('Anulada')])),
    CONSTRAINT factura_monto_check CHECK
                                        (monto >= 0),
    CONSTRAINT factura_id_proveedor_fkey FOREIGN KEY
                                        (id_proveedor) REFERENCES public.proveedor
                                        (id_proveedor) ON
                                        DELETE CASCADE
);

                                        CREATE TABLE public.muestra
                                        (
                                            id_muestra serial PRIMARY KEY,
                                            id_proveedor int4 NOT NULL,
                                            id_producto int4 NOT NULL,
                                            id_empleado int4 NOT NULL,
                                            fechamuestra date NOT NULL,
                                            observaciones text NULL,
                                            id_prueba int4 NOT NULL,
                                            CONSTRAINT muestra_id_empleado_fkey FOREIGN KEY (id_empleado) REFERENCES public.empleado(id_empleado) ON DELETE CASCADE,
                                            CONSTRAINT muestra_id_producto_fkey FOREIGN KEY (id_producto) REFERENCES public.producto(id_producto) ON DELETE CASCADE,
                                            CONSTRAINT muestra_id_prueba_fkey FOREIGN KEY (id_prueba) REFERENCES public.prueba(id_prueba) ON DELETE CASCADE
                                        );

                                        CREATE TABLE public.muestra_asignada
                                        (
                                            id_empleado int4 NOT NULL,
                                            id_muestra int4 NOT NULL,
                                            CONSTRAINT muestra_asignada_pkey PRIMARY KEY (id_empleado, id_muestra),
                                            CONSTRAINT muestra_asignada_id_empleado_fkey FOREIGN KEY (id_empleado) REFERENCES public.empleado(id_empleado) ON DELETE CASCADE,
                                            CONSTRAINT muestra_asignada_id_muestra_fkey FOREIGN KEY (id_muestra) REFERENCES public.muestra(id_muestra) ON DELETE CASCADE
                                        );

                                        -- Results and Auditing Tables
                                        CREATE TABLE public.resultados
                                        (
                                            id_resultado serial PRIMARY KEY,
                                            id_muestra int4 NOT NULL,
                                            id_prueba int4 NOT NULL,
                                            id_laboratorio int4 NOT NULL,
                                            id_empleado int4 NOT NULL,
                                            fecharesultado date NOT NULL,
                                            descripcion text NOT NULL,
                                            estado varchar(10) DEFAULT 'En proceso' NOT NULL,
                                            CONSTRAINT resultados_estado_check CHECK ((estado)
                                            ::text = ANY
                                            (ARRAY[('Aprobado'), ('Rechazado'), ('En proceso')])),
    CONSTRAINT resultados_id_empleado_fkey FOREIGN KEY
                                            (id_empleado) REFERENCES public.empleado
                                            (id_empleado) ON
                                            DELETE CASCADE,
    CONSTRAINT resultados_id_laboratorio_fkey FOREIGN KEY
                                            (id_laboratorio) REFERENCES public.laboratorio
                                            (id_laboratorio) ON
                                            DELETE CASCADE,
    CONSTRAINT resultados_id_muestra_fkey FOREIGN KEY
                                            (id_muestra) REFERENCES public.muestra
                                            (id_muestra) ON
                                            DELETE CASCADE,
    CONSTRAINT resultados_id_prueba_fkey FOREIGN KEY
                                            (id_prueba) REFERENCES public.prueba
                                            (id_prueba) ON
                                            DELETE CASCADE
);

                                            CREATE TABLE public.auditoria
                                            (
                                                id_auditoria serial PRIMARY KEY,
                                                id_entidad int4 NOT NULL,
                                                tipo_entidad varchar(10) NOT NULL,
                                                fecha date NOT NULL,
                                                resultado varchar(10) NOT NULL,
                                                sancion text NULL,
                                                CONSTRAINT auditoria_resultado_check CHECK ((resultado)
                                                ::text = ANY
                                                (ARRAY[('Aprobado'), ('Rechazado'), ('Observado')])),
    CONSTRAINT auditoria_tipo_entidad_check CHECK
                                                ((tipo_entidad)::text = ANY
                                                (ARRAY[('Proveedor'), ('Producto'), ('Laboratorio')]))
);

                                                CREATE TABLE public.auditoria_cambios
                                                (
                                                    id_auditoria serial PRIMARY KEY,
                                                    tabla_afectada varchar(50) NOT NULL,
                                                    id_registro_afectado int4 NOT NULL,
                                                    accion varchar(10) NOT NULL,
                                                    fecha_cambio timestamp DEFAULT CURRENT_TIMESTAMP NULL,
                                                    usuario varchar(50) NOT NULL,
                                                    CONSTRAINT auditoria_cambios_accion_check CHECK ((accion)
                                                    ::text = ANY
                                                    (ARRAY[('INSERT'), ('UPDATE'), ('DELETE')]))
);

                                                    CREATE TABLE public.registro
                                                    (
                                                        id_registro serial PRIMARY KEY,
                                                        id_entidad int4 NOT NULL,
                                                        tipo_entidad varchar(10) NOT NULL,
                                                        id_empleado int4 NOT NULL,
                                                        fecha timestamp DEFAULT CURRENT_TIMESTAMP NULL,
                                                        descripcion text NOT NULL,
                                                        CONSTRAINT registro_tipo_entidad_check CHECK ((tipo_entidad)
                                                        ::text = ANY
                                                        (ARRAY[('Muestra'), ('Prueba'), ('Resultado'), ('Producto'), ('Riesgo'), ('Evaluacion')])),
    CONSTRAINT registro_id_empleado_fkey FOREIGN KEY
                                                        (id_empleado) REFERENCES public.empleado
                                                        (id_empleado) ON
                                                        DELETE CASCADE
);

                                                        -- Important Views
                                                        CREATE OR REPLACE VIEW public.vista_riesgos_criticos AS
                                                        SELECT
                                                            p.id_producto,
                                                            p.nombre AS producto,
                                                            count(er.id_riesgo) AS total_riesgos,
                                                            max(er.puntuacion) AS max_puntuacion,
                                                            CASE
        WHEN avg(er.puntuacion) < 1.5 THEN 'Bajo'
        WHEN avg(er.puntuacion) >= 1.5 AND avg(er.puntuacion) <= 2.4 THEN 'Moderado'
        ELSE 'Alto'
    END AS nivel_riesgo
                                                        FROM producto p
                                                            LEFT JOIN evaluacion_riesgo er ON p.id_producto = er.id_producto
                                                        GROUP BY p.id_producto
                                                        HAVING max(er.puntuacion) >= 2.5 OR avg(er.puntuacion) >= 2.5;

                                                        -- Key Function
                                                        CREATE OR REPLACE PROCEDURE public.asignar_riesgo_producto
                                                        (
    IN p_id_producto integer, 
    IN p_id_riesgo integer, 
    IN p_id_empleado integer
)
LANGUAGE plpgsql AS $$
                                                        DECLARE
    v_severidad INT;
    v_probabilidad INT;
    v_puntuacion DECIMAL
                                                        (5,2);
                                                        BEGIN
                                                            -- Obtener severidad y probabilidad del riesgo
                                                            SELECT
                                                                CASE Severidad
            WHEN 'Bajo' THEN 1
            WHEN 'Medio' THEN 2
            WHEN 'Alto' THEN 3
        END,
                                                                CASE Probabilidad
            WHEN 'Raro' THEN 1
            WHEN 'Ocasional' THEN 2
            WHEN 'Frecuente' THEN 3
        END
                                                            INTO v_severidad
                                                            , v_probabilidad
    FROM Riesgo
    WHERE ID_Riesgo = p_ID_Riesgo;

                                                        -- Calcular puntuación
                                                        v_puntuacion :=
                                                        (v_severidad * v_probabilidad) / 1.8;

                                                        -- Insertar evaluación de riesgo
                                                        INSERT INTO Evaluacion_Riesgo
                                                            (ID_Producto, ID_Riesgo, Fecha_Evaluacion, Puntuacion, ID_Empleado)
                                                        VALUES
                                                            (p_ID_Producto, p_ID_Riesgo, CURRENT_DATE, v_puntuacion, p_ID_Empleado);

                                                        -- Actualizar estado del producto si la puntuación es alta
                                                        IF v_puntuacion >= 2.5 THEN
                                                        UPDATE Producto
        SET Estado = 'En Revision'
        WHERE ID_Producto = p_ID_Producto;
                                                        END
                                                        IF;
END;
$$;
