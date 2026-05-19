import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ProductoService } from '../producto/producto.service';
import { UsuarioService } from '../usuario/usuario.service';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const productService = app.get(ProductoService);
  const usuarioService = app.get(UsuarioService);

  console.log('🌱 Sembrando datos para Estanco Arboleas...');

  // Crear usuario admin por defecto
  try {
    await usuarioService.crear(
      'Admin Estanco',
      'admin@estancoarboleas.com',
      'admin123',
    );
    console.log('✅ Usuario admin creado: admin@estancoarboleas.com / admin123');
  } catch (e) {
    console.log('ℹ️  El admin ya existe, saltando...');
  }

  // Crear usuario de prueba
  try {
    await usuarioService.crear(
      'Cliente Prueba',
      'cliente@test.com',
      'cliente123',
    );
    console.log('✅ Usuario cliente creado: cliente@test.com / cliente123');
  } catch (e) {
    console.log('ℹ️  El cliente ya existe, saltando...');
  }

  // Productos del estanco - Categorías: Tabaco, Puros, Papel de liar, Encendedores, Accesorios, Timbres
  const productos = [
    // === TABACO ===
    {
      nombre: 'Ducados Rubio (30 unidades)',
      descripcion:
        'Clásico tabaco rubio español. Sabor suave y equilibrado. Ideal para el día a día. Pack de 30 cigarrillos.',
      precio: 5.2,
      imagenUrl: '',
      categoria: 'Tabaco',
      stock: 150,
    },
    {
      nombre: 'Winston Azul (20 unidades)',
      descripcion:
        'Tabaco americano de calidad premium. Sabor intenso y característico. Formato clásico de 20 cigarrillos.',
      precio: 4.8,
      imagenUrl: '',
      categoria: 'Tabaco',
      stock: 200,
    },
    {
      nombre: 'Marlboro Gold (20 unidades)',
      descripcion:
        'Icono mundial del tabaco. Sabor suave y refinado. La elección de millones de fumadores en todo el mundo.',
      precio: 5.5,
      imagenUrl: '',
      categoria: 'Tabaco',
      stock: 180,
    },
    {
      nombre: 'Chesterfield Original (20 unidades)',
      descripcion:
        'Tabaco de sabor clásico americano. Mezcla equilibrada de tabacos seleccionados. Desde 1875.',
      precio: 4.5,
      imagenUrl: '',
      categoria: 'Tabaco',
      stock: 120,
    },
    {
      nombre: 'L&M Azul (20 unidades)',
      descripcion:
        'Tabaco rubio de calidad a buen precio. Sabor suave y agradable. Muy popular en la zona.',
      precio: 4.2,
      imagenUrl: '',
      categoria: 'Tabaco',
      stock: 160,
    },
    {
      nombre: 'Camel Azul (20 unidades)',
      descripcion:
        'Tabaco con la inconfundible mezcla turca y americana. Sabor único y personalidad inigualable.',
      precio: 5.3,
      imagenUrl: '',
      categoria: 'Tabaco',
      stock: 90,
    },

    // === PUROS ===
    {
      nombre: 'Farias (Pack 5 unidades)',
      descripcion:
        'Puritos de calidad superior. Elaborados con tabaco 100% natural. Perfectos para después de comer. Pack de 5.',
      precio: 3.8,
      imagenUrl: '',
      categoria: 'Puros',
      stock: 75,
    },
    {
      nombre: 'Ducados Puros (Pack 10 unidades)',
      descripcion:
        'Puritos de liar con filtro. Sabor intenso a tabaco negro. Muy populares en España. Pack de 10.',
      precio: 4.2,
      imagenUrl: '',
      categoria: 'Puros',
      stock: 60,
    },
    {
      nombre: 'Caliqueños (Pack 5 unidades)',
      descripcion:
        'Puritos artesanales de origen canario. Sabor suave y aroma característico. Pack de 5.',
      precio: 3.5,
      imagenUrl: '',
      categoria: 'Puros',
      stock: 45,
    },
    {
      nombre: 'Cohiba Siglo I (Unitario)',
      descripcion:
        'Puro habano de lujo. El mejor tabaco cubano. Vitola perfecta para ocasiones especiales. Envuelto a mano.',
      precio: 22.0,
      imagenUrl: '',
      categoria: 'Puros',
      stock: 20,
    },
    {
      nombre: 'Montecristo No. 4 (Unitario)',
      descripcion:
        'Puro cubano de renombre mundial. Sabor complejo y equilibrado. Ideal para aficionados exigentes.',
      precio: 18.5,
      imagenUrl: '',
      categoria: 'Puros',
      stock: 15,
    },
    {
      nombre: 'Romeo y Julieta No. 2 (Unitario)',
      descripcion:
        'Puro cubano clásico. Aroma inconfundible y quemado uniforme. Una experiencia de fumar incomparable.',
      precio: 16.0,
      imagenUrl: '',
      categoria: 'Puros',
      stock: 18,
    },

    // === PAPEL DE LIAR ===
    {
      nombre: 'OCB Premium (Libro 50 hojas)',
      descripcion:
        'Papel de liar de alta calidad. Ultra fino y quema lenta. Goma natural. El favorito de los liadores expertos.',
      precio: 0.6,
      imagenUrl: '',
      categoria: 'Papel de liar',
      stock: 300,
    },
    {
      nombre: 'Zig-Zag Original (Libro 50 hojas)',
      descripcion:
        'El clásico papel de liar desde 1879. Maicero de toda la vida. Quemado uniforme y fácil de liar.',
      precio: 0.5,
      imagenUrl: '',
      categoria: 'Papel de liar',
      stock: 250,
    },
    {
      nombre: 'Smoking Brown (Libro 50 hojas)',
      descripcion:
        'Papel de liar color marrón sin blanquear. 100% natural. Sabor neutro y quema lenta. Muy apreciado.',
      precio: 0.7,
      imagenUrl: '',
      categoria: 'Papel de liar',
      stock: 200,
    },
    {
      nombre: 'RAW Classic (Libro 50 hojas)',
      descripcion:
        'Papel de liar ecológico sin aditivos. Filtros incluidos. Quemado ultralento. Marca de culto.',
      precio: 1.2,
      imagenUrl: '',
      categoria: 'Papel de liar',
      stock: 180,
    },
    {
      nombre: 'G-Rollz (Libro 50 hojas + Filtros)',
      descripcion:
        'Kit completo de liar con papel y filtros incluidos. Práctico y económico. Ideal para llevar.',
      precio: 1.0,
      imagenUrl: '',
      categoria: 'Papel de liar',
      stock: 150,
    },
    {
      nombre: 'Elements Rice (Libro 50 hojas)',
      descripcion:
        'Papel de liar de arroz. Transparente y ultrafino. Quema extremadamente lenta. Para los más exigentes.',
      precio: 1.5,
      imagenUrl: '',
      categoria: 'Papel de liar',
      stock: 120,
    },

    // === ENCENDEDORES ===
    {
      nombre: 'Clipper Clásico (Metal)',
      descripcion:
        'Encendedor recargable de metal. Diseño icónico con rueda. Recargable con gas butano. Múltiples colores.',
      precio: 2.5,
      imagenUrl: '',
      categoria: 'Encendedores',
      stock: 100,
    },
    {
      nombre: 'Bic Mini (Colores Surtidos)',
      descripcion:
        'Encendedor desechable mini. Compacto y práctico. Encendido seguro. Ideal para llevar en el bolsillo.',
      precio: 1.5,
      imagenUrl: '',
      categoria: 'Encendedores',
      stock: 200,
    },
    {
      nombre: 'Zippo Clásico (Cromo)',
      descripcion:
        'Encendedor de viento Zippo original. Fabricado en EE.UU. Garantía de por vida. Símbolo de estilo.',
      precio: 25.0,
      imagenUrl: '',
      categoria: 'Encendedores',
      stock: 15,
    },
    {
      nombre: 'Clipper Jet Flame (Antiviento)',
      descripcion:
        'Encendedor de llama jet. Resistente al viento. Recargable. Perfecto para usar en exteriores.',
      precio: 4.0,
      imagenUrl: '',
      categoria: 'Encendedores',
      stock: 60,
    },
    {
      nombre: 'Gas Butano Clipper (Recarga 100ml)',
      descripcion:
        'Recarga de gas butano para encendedores. Filtrado y purificado. 100ml de capacidad.',
      precio: 2.0,
      imagenUrl: '',
      categoria: 'Encendedores',
      stock: 80,
    },
    {
      nombre: 'Mechero Eléctrico USB (Recargable)',
      descripcion:
        'Encendedor eléctrico sin llama. Recargable por USB. Resistente al viento. Tecnología de arco eléctrico.',
      precio: 8.0,
      imagenUrl: '',
      categoria: 'Encendedores',
      stock: 35,
    },

    // === ACCESORIOS ===
    {
      nombre: 'Picadura American Spirit Azul (30g)',
      descripcion:
        'Picadura de liar premium. Tabaco 100% natural sin aditivos. Sabor suave y natural. Bolsa de 30 gramos.',
      precio: 6.5,
      imagenUrl: '',
      categoria: 'Accesorios',
      stock: 80,
    },
    {
      nombre: 'Picadura Pueblo Azul (30g)',
      descripcion:
        'Picadura de liar española. Tabaco de calidad superior. Sabor equilibrado. Bolsa de 30 gramos.',
      precio: 5.0,
      imagenUrl: '',
      categoria: 'Accesorios',
      stock: 100,
    },
    {
      nombre: 'Filtros OCB King Size (100 unidades)',
      descripcion:
        'Filtros de celulosa para liar. King Size. Suaves y cómodos. Pack de 100 unidades.',
      precio: 1.0,
      imagenUrl: '',
      categoria: 'Accesorios',
      stock: 150,
    },
    {
      nombre: 'Liyadora Eléctrica (Automática)',
      descripcion:
        'Máquina de liar cigarrillos eléctrica. Fácil y rápida. Funciona con pilas. Ideal para liadores frecuentes.',
      precio: 12.0,
      imagenUrl: '',
      categoria: 'Accesorios',
      stock: 25,
    },
    {
      nombre: 'Cenicero de Cristal (Grande)',
      descripcion:
        'Cenicero de cristal transparente. Base antideslizante. Fácil de limpiar. Tamaño grande para uso doméstico.',
      precio: 6.0,
      imagenUrl: '',
      categoria: 'Accesorios',
      stock: 40,
    },
    {
      nombre: 'Funda Puros (Viaje 5 unidades)',
      descripcion:
        'Estuche portapuros de cuero sintético. Protege tus puros en viajes. Capacidad para 5 puros. Cierre seguro.',
      precio: 9.5,
      imagenUrl: '',
      categoria: 'Accesorios',
      stock: 30,
    },

    // === TIMBRES ===
    {
      nombre: 'Timbre 0.50€ (Venta Unitaria)',
      descripcion:
        'Timbre fiscal de 0.50 euros. Válido para todo tipo de documentos oficiales y trámites administrativos.',
      precio: 0.5,
      imagenUrl: '',
      categoria: 'Timbres',
      stock: 500,
    },
    {
      nombre: 'Timbres 0.75€ (Venta Unitaria)',
      descripcion:
        'Timbres fiscales de 0.75 euros. Para documentos oficiales y gestiones administrativas.',
      precio: 0.75,
      imagenUrl: '',
      categoria: 'Timbres',
      stock: 500,
    },
    {
      nombre: 'Timbres 1€ (Venta Unitaria)',
      descripcion:
        'Timbres fiscales de 1 euro. Para documentos oficiales y gestiones administrativas.',
      precio: 1.0,
      imagenUrl: '',
      categoria: 'Timbres',
      stock: 500,
    },
    {
      nombre: 'Timbres 2€ (Venta Unitaria)',
      descripcion:
        'Timbres fiscales de 2 euros. Para documentos oficiales y gestiones administrativas.',
      precio: 2.0,
      imagenUrl: '',
      categoria: 'Timbres',
      stock: 400,
    },
    {
      nombre: 'Timbres 5€ (Venta Unitaria)',
      descripcion:
        'Timbres fiscales de 5 euros. Para documentos oficiales y gestiones administrativas.',
      precio: 5.0,
      imagenUrl: '',
      categoria: 'Timbres',
      stock: 300,
    },
    {
      nombre: 'Timbres 10€ (Venta Unitaria)',
      descripcion:
        'Timbres fiscales de 10 euros. Para documentos oficiales y gestiones administrativas.',
      precio: 10.0,
      imagenUrl: '',
      categoria: 'Timbres',
      stock: 200,
    },
  ];

  for (const producto of productos) {
    try {
      await productService.crear(producto);
    } catch (e) {
      console.log(`ℹ️  Producto "${producto.nombre}" ya existe, saltando...`);
    }
  }

  console.log(`✅ ${productos.length} productos insertados correctamente`);
  console.log('🌱 Seed completado con éxito!');
  await app.close();
}

seed().catch((err) => {
  console.error('Error durante el seed:', err);
  process.exit(1);
});
