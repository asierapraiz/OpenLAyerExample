export const DASHBOARD_PATHS={
    TERRENOS :{
        title: 'Terrenos',
        breadcrumb: [
          {
            label: 'terrenos',         
            url: ''
          }
        ]
      },    
      PREDIO_TERRENOS:{
        title: 'Terrenos',
        breadcrumb: [
          {
            label: 'predio:{{predioId}}',
            url: 'predio/:predioId/predio'
          },
          {
            label: 'terrenos',
            url: ''
          }
        ]
      },
      TERRENO_ID:{
        title: 'Terrenos',
        breadcrumb: [
          {
            label: 'terreno:{{terrenoId}}',
            url: 'terreno'
          },
          {
            label: 'terrenos',
            url: ''
          }
        ]
      },
      CARGAUNIDADESESPACIALES :{
        title: 'Carga de Unidades Espaciales',
        breadcrumb: [
          {
            label: 'Carga de Unidades Espaciales',         
            url: ''
          }
        ]
      },
      CARGAUNIDADESADMINISTRATIVAS :{
        title: 'Carga de Unidades Admninistrativas',
        breadcrumb: [
          {
            label: 'Carga de Unidades Admninistrativas',         
            url: ''
          }
        ]
      },
      CARGAINTERRESADO:{
        title: 'Carga de Interesados',
        breadcrumb: [
          {
            label: 'Carga de Interesados',         
            url: ''
          }
        ]
      },
      CONSTRUCCION_TERRENO:{
        title: 'Terrenos',
        breadcrumb: [
          {
            label: 'construccion:{{construccionId}}',
            url: 'construccion/{{construccionId}}'
          },
          {
            label: 'terrenos',
            url: ''
          }
        ]
      },
      UNIDADCONSTRUCCION_TERRENO:{
        title: 'Terrenos',
        breadcrumb: [
          {
            label: 'unidad:{{unidadId}}',
            url: 'unidad'
          },
          {
            label: 'terrenos',
            url: ''
          }
        ]
      },

      UNIDADCONSTRUCCION_CONSTRUCCION:{
        title: 'Construcciones',
        breadcrumb: [
          {
            label: 'unidadconstruccion:{{unidadId}}',
            url: ''
          },
          {
            label: 'construcciones',
            url: ''
          }
        ]
      },
      TERRENO_CONSTRUCCIONES:{
        title: 'Construcciones',
        breadcrumb: [
          {
            label: 'terreno:{{terrenoId}}',
            url: 'terreno/:terrenoId/terreno'
          },
          {
            label: 'construcciones',
            url: ''
          }
        ]
      },
      PREDIO_TERRENO_CONSTRUCCIONES:{
        title: 'Construcciones',
        breadcrumb: [
          {
            label: 'predio:{{predioId}}',
            url: 'predio/:predioId'
          },
          {
            label: 'terreno:{{terrenoId}}',
            url: 'predio/:predioId/terreno'
          },
          {
            label: 'construcciones',
            url: ''
          }
        ]
      },
      CONSTRUCCIONES:{
        title: 'Construcciones',
        breadcrumb: [
          {
            label: 'construcciones',         
            url: ''
          }
        ]
      },
      CONSTRUCCION_ID:{
        title: 'Construcciones',
        breadcrumb: [
          {
            label: 'construcción:{{construccionId}}',         
            url: ''
          },
          {
            label: 'construcciones',
            url: ''
          }
        ]
      },
      PREDIO_CONSTRUCCIONES:{
        title: 'Construcciones',
        breadcrumb: [
          {
            label: 'predio:{{predioId}}',
            url: 'predio'
          },
          {
            label: 'construcciones',
            url: ''
          }
        ]
      },
      
      TERRENO_PREDIO_CONSTRUCCIONES:{
        title: 'Construcciones',
        breadcrumb: [
          {
            label: 'terreno:{{terrenoId}}',
            url: 'terreno'
          },
          {
            label: 'predio:{{predioId}}',
            url: 'predio'
          },
          {
            label: 'construcciones',
            url: ''
          }
        ]
      },
      TERRENO_PREDIO_CONSTRUCCION_UNIDADCONSTRUCCION:{
        title: 'Construcciones',
        breadcrumb: [
          {
            label: 'terreno:{{terrenoId}}',
            url: 'terreno'
          },
          {
            label: 'predio:{{predioId}}',
            url: 'predio'
          },
          {
            label: 'construccion:{{construccionId}}',
            url: 'construcciones'
          },
          {
            label: 'unidadconstrucciones',
            url: ''
          }
        ]
      },
      UNIDADADCONSTRUCCION:{
        title: 'Unidades de Construcción',
        breadcrumb: [
          {
            label: 'unidadconstruccion',         
            url: ''
          }
        ]
      },
      CONSTRUCCION_UNIDADCONSTRUCCION:{
        title: 'Unidades de Construcción',
        breadcrumb: [
          {
            label: 'construcción:{{construccionId}}',
            url: 'construccion'
          },
          {
            label: 'unidadconstruccion',
            url: ''
          }
        ]
      },
      PREDIO_TERRENO_CONSTRUCCION_UNIDADCONSTRUCCION:{
        title: 'Unidades de Construcción',
        breadcrumb: [
          {
            label: 'predio:{{predioId}}',
            url: 'predio/:predioId/predio'
          },
          {
            label: 'terreno:{{terrenoId}}',
            url: 'predio/:predioId/terreno'
          },
          {
            label: 'construcción:{{construccionId}}',
            url: 'predio/:predioId/terreno/:terrenoId/construccion'
          },
          {
            label: 'unidadconstrucciones',
            url: ''
          }
        ]
      },
      PREDIO_UNIDADCONSTRUCCION:{
        title: 'Unidades de Construcción',
        breadcrumb: [
          {
            label: 'predio:{{predioId}}',
            url: 'predio/:predioId/predio'
          },
          {
            label: 'unidadconstrucciones',
            url: ''
          }
        ]
      },
      TERRENO_CONSTRUCCION_UNIDADCONSTRUCCION:{
        title: 'Unidades de Construcción',
        breadcrumb: [
          {
            label: 'terreno:{{terrenoId}}',
            url: 'terreno'
          },
          {
            label: 'construcción:{{construccionId}}',
            url: 'construccion'
          },
          {
            label: 'unidadconstrucciones',
            url: ''
          }
        ]
      },
      PREDIOS :{
        title: 'Predios',
        breadcrumb: [
          {
            label: 'predios',         
            url: ''
          }
        ]
      },
      PREDIO_ID:{
        title: 'Predios',
        breadcrumb: [
          {
            label: 'predio:{{predioId}}',
            url: ''
          },
          {
            label: 'predios',
            url: ''
          }
        ]
      },
      TERRENO_PREDIOS:{
        title: 'Predios',
        breadcrumb: [
          {
            label: 'terreno:{{terrenoId}}',
            url: 'terrenos'
          },
          {
            label: 'predios',
            url: ''
          }
        ]
      },
      UNIDAD_PREDIOS:{
        title: 'Predios',
        breadcrumb: [
          {
            label: 'unidadesConstruccion:{{unidadId}}',
            url: 'unidadesConstruccion'
          },
          {
            label: 'predios',
            url: ''
          }
        ]
      },
      CONSTRUCCION_PREDIO:{
        title: 'Predios',
        breadcrumb: [
          {
            label: 'construccion:{{construccionId}}',
            url: 'construccion/:construccionId'
          },
          {
            label: 'predios',
            url: ''
          }
        ]
      },
      INTERESADO_PREDIOS:{
        title: 'Predios',
        breadcrumb: [
          {
            label: 'interesado:{{interesadoId}}',
            url: 'interesado'
          },
          {
            label: 'predios',
            url: ''
          }
        ]
      },
      DERECHO_PREDIOS:{
        title: 'Predios',
        breadcrumb: [
          {
            label: 'derecho:{{derechoId}}',
            url: 'derecho'
          },
          {
            label: 'predios',
            url: ''
          }
        ]
      },
      INTERESADOS:{       
        title: 'Interesados',
        breadcrumb: [
          {
            label: 'interesados',         
            url: ''
          }
        ]
      },     
      TERRENO_PREDIO_INTERESADOS:{
        title: 'Interesados',
        breadcrumb: [
          {
            label: 'terreno :{{terrenoId}}',
            url: 'terreno'
          },
          {
            label: 'predio :{{predioId}}',
            url: 'terreno/:terrenoId/predio'
          },
          {
            label: 'interesados',
            url: ''
          }
        ]
      },
      PREDIO_INTERESADOS:{
        title: 'Interesados',
        breadcrumb: [          
          {
            label: 'predio :{{predioId}}',
            url: 'predio'
          },
          {
            label: 'interesados',
            url: ''
          }
        ]
      },
      DERECHO_INTERESADOS:{
        title: 'Interesados',
        breadcrumb: [          
          {
            label: 'derecho :{{derechoId}}',
            url: 'derecho'
          },
          {
            label: 'interesados',
            url: ''
          }
        ]
      },     
      AGRUPACION_INTERESADOS:{       
        title: 'AgrupacionesInteresado',
        breadcrumb: [
          {
            label: 'agrupaciones',         
            url: ''
          }
        ]
      },  
      AGRUPACION_INTERESADOS_MIEMBROS:{
        title: 'Miembros',
        breadcrumb: [        
          {
            label: 'agrupación :{{agrupacionId}}',
            url: 'agrupacion-interesado'
          } ,         
          {
            label: 'miembros',
            url: ''
          }
        ]
      },
      DERECHO_AGRUPACION_INTERESADOS:{
        title: 'Miembros',
        breadcrumb: [        
          {
            label: 'derecho :{{derechoId}}',
            url: 'derecho'
          } ,         
          {
            label: 'agrupacion',
            url: ''
          }
        ]
      },
      TERRENO_PREDIO_INTERESADO_AGRUPACION_INTERESADOS:{
        title: 'AgrupacionesInteresado',
        breadcrumb: [
          {
            label: 'terreno :{{terrenoId}}',
            url: 'terreno'
          },
          {
            label: 'predio :{{predioId}}',
            url: 'terreno/:terrenoId/predio'
          },          
          {
            label: 'interesado :{{interesadoId}}',
            url: 'terreno/:terrenoId/predio/:predioId/interesado'
          },
          {
            label: 'agrupaciones',
            url: ''
          }
        ]
      },
      TERRENO_PREDIO_AGRUPACION_INTERESADOS:{
        title: 'AgrupacionesInteresados',
        breadcrumb: [
          {
            label: 'terreno :{{terrenoId}}',
            url: 'terreno'
          },
          {
            label: 'predio :{{predioId}}',
            url: 'terreno/:terrenoId/predio'
          },          
          {
            label: 'agrupaciones',
            url: ''
          }
        ]
      },
      PREDIO_AGRUPACION_INTERESADOS:{
        title: 'AgrupacionesInteresados',
        breadcrumb: [         
          {
            label: 'predio :{{predioId}}',
            url: 'terreno/:terrenoId/predio'
          },          
          {
            label: 'agrupaciones',
            url: ''
          }
        ]
      },
      INTERESADO_AGRUPACION_INTERESADOS_MIEMBROS:{
        title: 'AgrupacionesInteresados',
        breadcrumb: [
          {
            label: 'terreno :{{terrenoId}}',
            url: 'terreno'
          },
          {
            label: 'predio :{{predioId}}',
            url: 'terreno/:terrenoId/predio'
          },
          {
            label: 'interesado :{{interesadoId}}',
            url: 'terreno/:terrenoId/predio/:predioId/interesado'
          },
          {
            label: 'agrupacion :{{agrupacionId}}',
            url: 'terreno/:terrenoId/:predioId/agrupación/:agrupacionId'
          } ,         
          {
            label: 'miembros',
            url: ''
          }
        ]
      },
      TERRENO_PREDIO_INTERESADOS_SELECT_AGRUPACION_INTERESADOS:{
        title: 'AgrupacionesInteresados',
        breadcrumb: [
          {
            label: 'terreno :{{terrenoId}}',
            url: 'terreno'
          },
          {
            label: 'predio :{{predioId}}',
            url: 'terreno/:terrenoId/predio'
          },
          {
            label: 'interesadoPendiente',
            url: 'terreno/:terrenoId/predio/:predioId/interesados'
          },
          {
            label: 'selecciona-agrupación',
            url: ''
          } 
        ]
      },
      PREDIO_INTERESADOS_SELECT_AGRUPACION_INTERESADOS:{
        title: 'AgrupacionesInteresados',
        breadcrumb: [          
          {
            label: 'predio :{{predioId}}',
            url: 'terreno/:terrenoId/predio'
          },
          {
            label: 'interesadoPendiente',
            url: 'terreno/:terrenoId/predio/:predioId/interesados'
          },
          {
            label: 'selecciona-agrupación',
            url: ''
          } 
        ]
      },
      INTERESADOS_SELECT_AGRUPACION_INTERESADOS:{
        title: 'AgrupacionesInteresados',
        breadcrumb: [
         
          {
            label: 'interesadoPendiente',
            url: 'interesado'
          },
          {
            label: 'selecciona-agrupación',
            url: ''
          } 
        ]
      },
      INTERESADO_AGRUPACION_INTERESADOS:{
        title: 'AgrupacionesInteresados',
        breadcrumb: [
          {
            label: 'interesado :{{interesadoId}}',
            url: 'interesado'
          },          
          {
            label: 'agrupaciones',
            url: ''
          }
        ]
      },
      DERECHOS :{
        title: 'Derechos',
        breadcrumb: [
          {
            label: 'derechos',         
            url: ''
          }
        ]
      },
      INTERESADO_DERECHOS :{
        title: 'Derechos',
        breadcrumb: [
          {
            label: 'interesado :{{interesadoId}}',
            url: 'interesado'
          },
          {
            label: 'derechos',         
            url: ''
          }      
        ]
      }
}